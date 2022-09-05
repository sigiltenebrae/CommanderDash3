import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";

import {TokenStorageService} from "../../services/token-storage.service";
import { DeckDataService } from "../../services/deck-data.service";
@Component({
  selector: 'app-deck-list',
  templateUrl: './deck-list.component.html',
  styleUrls: ['./deck-list.component.scss']
})
export class DeckListComponent implements OnInit {
  public decks: any[] = []; //list of all decks for user
  public decks_visible: any[] = []; //list of all decks for user
  public loading = false; //display spinner while page is loading

  public current_sort = "name";
  public filter_active = true;
  public filter_inactive = true;
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
      this.deckData.getBanList().then(() => {
        this.deckData.getDecks().then(
          (temp) => {
            this.deckData.getThemeList().then((themes) => {
              this.themes = themes;
              this.filter_themes = [];
            });
            this.decks = temp;
            let deck_promises: any = [];
            let scryfall_promises: any = [];
            let playdata_promises: any = [];
            for (let deck of this.decks) {
              deck.hovered = false;
              deck.visible = true;
              deck.legality = "Unknown";
              deck.play_data = null;
              let edhrec_name = deck.commander.toLowerCase().replace(/[`~!@#$%^&*()_|+=?;:'",.<>\{\}\[\]\\\/]/gi, '').replace(/\ /g, '-');
              if (deck.partner_commander) {
                edhrec_name += '-' + deck.partner_commander.toLowerCase().replace(/[`~!@#$%^&*()_|+=?;:'",.<>\{\}\[\]\\\/]/gi, '').replace(/\ /g, '-');
              }
              deck.edhrec_url = 'https://edhrec.com/commanders/' + edhrec_name;
              playdata_promises.push(this.deckData.getGameDataForDeck(deck));
              scryfall_promises.push(this.deckData.getDeckScryfallData(deck));
              deck_promises.push(this.deckData.getDeckLegality(deck));
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
          }
        );
      });
    }
  }

  getVisible(): any[] {
    let outdecks: any = [];
    for (let deck of this.decks) {
      if (deck.visible) {
        outdecks.push(deck);
      }
    }
    return outdecks;
  }

  sortDecks() {
    switch(this.current_sort) {
      case "id":
        this.decks.sort((a: any, b: any) => (a.id > b.id) ? 1: -1);
        break;
      case "name":
        this.decks.sort((a: any, b: any) => (a.friendly_name > b.friendly_name) ? 1: -1);
        break;
      case "commander":
        this.decks.sort((a: any, b: any) => (a.commander > b.commander) ? 1: -1);
        break;
      case "legal":
        this.decks.sort((a: any, b: any) => (a.legality > b.legality) ? 1: -1);
        break;
      case "rating":
        this.decks.sort((a: any, b: any) => (a.play_rating > b.play_rating) ? 1: -1);
        break;
    }

  }

  filterDecks() {
    for (let deck of this.decks) {
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
    this.decks_visible = this.getVisible();
  }
}
