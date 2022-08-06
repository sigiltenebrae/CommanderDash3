import { Component, OnInit } from '@angular/core';
import { DeckDataService } from "../../services/deck-data.service";

@Component({
  selector: 'app-deck-list',
  templateUrl: './deck-list.component.html',
  styleUrls: ['./deck-list.component.scss']
})
export class DeckListComponent implements OnInit {
  decks: any = null;

  constructor(private deckData: DeckDataService) { }

  ngOnInit(): void {
    this.deckData.getDecks().then(
      (temp) => {
        this.decks = temp;
      }
    );
    for (let deck of this.decks) {
      deck.hovered = false;
    }
  }
}
