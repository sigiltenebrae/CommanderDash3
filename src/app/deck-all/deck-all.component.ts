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
  public user_dict: any = {}; //dictionary of user ids and usernames
  public loading = false; //display spinner while page is loading

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
            let deck_dict: any = {};
            let deck_promises: any = [];
            let scryfall_promises: any = [];
            let playdata_promises: any = [];
            for (let deck of this.all_decks) {
              if (deck.active) {
                deck.hovered = false;
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
                }
                else {
                  deck_dict[deck.creator] = [];
                  deck_dict[deck.creator].push(deck);
                }
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

}
