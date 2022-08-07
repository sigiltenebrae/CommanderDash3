import { Component, OnInit } from '@angular/core';
import { DeckDataService } from "../../services/deck-data.service";
import {TokenStorageService} from "../../services/token-storage.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-deck-list',
  templateUrl: './deck-list.component.html',
  styleUrls: ['./deck-list.component.scss']
})
export class DeckListComponent implements OnInit {
  decks: any[] = [];
  loading = false;

  constructor(private deckData: DeckDataService, private tokenStorage: TokenStorageService, private router: Router) { }

  ngOnInit(): void {
    if (this.tokenStorage.getUser() == null || this.tokenStorage.getUser() == {} ||
      this.tokenStorage.getUser().id == null || this.tokenStorage.getUser().id < 0) {
      this.router.navigate(['login']);
    }
    else {
      this.loading = true;
      this.deckData.getDecks().then(
        (temp) => {
          this.decks = temp;
          this.loading = false;
        }
      );
      for (let deck of this.decks) {
        deck.hovered = false;
      }
    }

  }
}
