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
            for (let deck of this.all_decks) {
              if (deck.active) {
                deck.hovered = false;
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
            Promise.all(deck_promises).then(() => {
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
            });
          });
        })
      });
    }
  }
}
