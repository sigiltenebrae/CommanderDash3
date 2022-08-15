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
      this.deckData.getBanList().then(() => {
        this.deckData.getDecks().then(
          (temp) => {
            this.decks = temp;
            let deck_promises: any = [];
            for (let deck of this.decks) {
              deck.hovered = false;
              deck_promises.push(this.deckData.getDeckLegality(deck));
            }
            Promise.all(deck_promises).then(() => {
              this.loading = false;
            })
          }
        );
      });
    }
  }
}
