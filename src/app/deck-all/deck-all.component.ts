import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";

import { DeckDataService } from "../../services/deck-data.service";
import { TokenStorageService } from "../../services/token-storage.service";


@Component({
  selector: 'app-deck-all',
  templateUrl: './deck-all.component.html',
  styleUrls: ['./deck-all.component.scss']
})
export class DeckAllComponent implements OnInit {

  public all_decks: any[] = []; //list of all decks
  public all_decks_sorted: any = []; //list of user objects storing a list of decks
  public all_decks_sorted_visible: any = []; //list of user objects storing a list of decks, with visible set to true
  public user_dict: any = {}; //dictionary of user ids and usernames
  public loading = false; //display spinner while page is loading

  public current_sort = "name";
  public filter_active = true;
  public filter_inactive = false;
  public filter_legal = true;
  public filter_illegal = true;
  public filter_uklegal = true;
  public filter_partner = true;
  public filter_nopartner = true;

  public themes: any[] = [];
  public filter_themes: any[] = [];

  constructor(private deckData: DeckDataService, private tokenStorage: TokenStorageService, private router: Router) { }

  ngOnInit(): void {
    //force user to log in to view
    if (this.tokenStorage.getUser() == null || this.tokenStorage.getUser() == {} ||
      this.tokenStorage.getUser().id == null || this.tokenStorage.getUser().id < 0) {
      this.router.navigate(['login']);
    }
    else {
      this.loading = true;
      this.deckData.getUserDict().then((user_data) => {
        this.user_dict = user_data;
        this.deckData.getBanList().then(()=> {
          this.deckData.getAllDecks().then((deck_data) => {
            this.all_decks = deck_data;
            this.deckData.getThemeList().then((themes) => {
              this.themes = themes;
              this.filter_themes = [];
            });
            let deck_dict: any = {};
            let deck_promises: any = [];
            let scryfall_promises: any = [];
            let playdata_promises: any = [];
            for (let deck of this.all_decks) {
              deck.hovered = false;
              deck.visible = true;
              deck.legality = "Unknown"
              deck.colors = null;
              let edhrec_name = deck.commander.toLowerCase().replace(/[`~!@#$%^&*()_|+=?;:'",.<>\{\}\[\]\\\/]/gi, '').replace(/\ /g, '-');
              if (deck.partner_commander) {
                edhrec_name += '-' + deck.partner_commander.toLowerCase().replace(/[`~!@#$%^&*()_|+=?;:'",.<>\{\}\[\]\\\/]/gi, '').replace(/\ /g, '-');
              }
              deck.edhrec_url = 'https://edhrec.com/commanders/' + edhrec_name;
              playdata_promises.push(this.deckData.getGameDataForDeck(deck));
              scryfall_promises.push(this.deckData.getDeckScryfallData(deck));
              deck_promises.push(this.deckData.getDeckLegality(deck));
              if (deck_dict[deck.creator] != null) {
                deck_dict[deck.creator].push(deck);
              } else {
                deck_dict[deck.creator] = [];
                deck_dict[deck.creator].push(deck);
              }
            }
            this.all_decks_sorted.push({
              user: this.user_dict[this.tokenStorage.getUser().id],
              decks: deck_dict[this.tokenStorage.getUser().id]
            });
            for (let user of Object.keys(deck_dict)) {
              if (user != this.tokenStorage.getUser().id) {
                this.all_decks_sorted.push({
                  user: this.user_dict[user],
                  decks: deck_dict[user]
                });
              }
            }
            this.sortDecks();
            this.filterDecks();
            this.loading = false;
            Promise.all(playdata_promises).then(() => {
              Promise.all(scryfall_promises).then(() => {
                Promise.all(deck_promises).then(() => {
                });
              });
            });
          });
        })
      });
    }
  }

  public isAdmin(): boolean {
    return this.tokenStorage.getUser().isAdmin;
  }

  getVisible(): any[] {
    let out_users: any[] = [];
    for (let user of this.all_decks_sorted) {
      let outdecks: any = [];
      for (let deck of user.decks) {
        if (deck.visible) {
          outdecks.push(deck);
        }
      }
      out_users.push({
        user: user.user,
        decks: outdecks
      });
    }
    return out_users;
  }

  sortDecks() {
    for (let user of this.all_decks_sorted) {
      switch(this.current_sort) {
        case "id":
          user.decks.sort((a: any, b: any) => (a.id > b.id) ? 1: -1);
          break;
        case "name":
          user.decks.sort((a: any, b: any) => (a.friendly_name > b.friendly_name) ? 1: -1);
          break;
        case "commander":
          user.decks.sort((a: any, b: any) => (a.commander > b.commander) ? 1: -1);
          break;
        case "legal":
          user.decks.sort((a: any, b: any) => (a.legality > b.legality) ? 1: -1);
          break;
        case "rating":
          user.decks.sort((a: any, b: any) => (a.play_rating > b.play_rating) ? 1: -1);
          break;
      }
    }
  }

  filterDecks() {
    for (let user of this.all_decks_sorted) {
      for (let deck of user.decks) {
        deck.visible = true;
        if (!this.filter_active) {
          deck.visible = deck.active ? false: deck.visible;
        }
        if (!this.filter_inactive) {
          deck.visible = !deck.active ? false: deck.visible;
        }
        if (!this.filter_legal) {
          deck.visible = deck.legality === "Legal" ? false: deck.visible;
        }
        if (!this.filter_illegal) {
          deck.visible = deck.legality === "Illegal" ? false: deck.visible;
        }
        if (!this.filter_uklegal) {
          deck.visible = deck.legality === "Unknown" ? false: deck.visible;
        }
        if (!this.filter_partner) {
          deck.visible = deck.partner_commander ? false: deck.visible;
        }
        if (!this.filter_nopartner) {
          deck.visible = !deck.partner_commander ? false: deck.visible;
        }
        if (this.filter_themes.length > 0) {
          let has_theme = false;
          for (let f_theme of this.filter_themes) {
            for (let deck_theme of deck.themes) {
              if (f_theme.id == deck_theme.id) {
                has_theme = true;
                break;
              }
            }
            if (has_theme) {
              break;
            }
          }
          deck.visible = has_theme ? deck.visible: false;
        }
      }
    }
    this.all_decks_sorted_visible = this.getVisible();
  }
}
