import { Component, OnInit } from '@angular/core';
import {TokenStorageService} from "../../services/token-storage.service";
import {Router} from "@angular/router";
import {DeckDataService} from "../../services/deck-data.service";

@Component({
  selector: 'app-deck-recs',
  templateUrl: './deck-recs.component.html',
  styleUrls: ['./deck-recs.component.scss']
})
export class DeckRecsComponent implements OnInit {

  loading = false;
  decks: any[] = [];

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
        });
    }
  }

}
