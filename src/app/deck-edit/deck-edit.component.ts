import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-deck-edit',
  templateUrl: './deck-edit.component.html',
  styleUrls: ['./deck-edit.component.scss']
})
export class DeckEditComponent implements OnInit {

  current_deck: any = {
    "id": 54,
    "friendly_name": "Discard Upgraded",
    "commander": "Crosis, the Purger",
    "url": "https://www.archidekt.com/decks/2822705#Crosis_-_Grixis_-_Discard_Upgraded",
    "build_rating": 5,
    "play_rating": 3,
    "win_rating": 5,
    "active": true,
    "image_url": "https://c1.scryfall.com/file/scryfall-cards/png/front/e/f/ef55cb9e-27ab-4a85-9246-873f699be0f3.png?1651796695",
    "creator": 1,
    "partner_commander": null,
    "partner_image_url": null,
    "themes": [
      {
        "id": 42,
        "name": "Wheels"
      },
      {
        "id": 53,
        "name": "Discard"
      },
      {
        "id": 121,
        "name": "Card Draw"
      }
    ],
    "deleteThemes": []
  }

  constructor() { }

  ngOnInit(): void {
  }

  form: any = {
    commander: null,
    friendly_name: null,
    deck_url: null,
    fun_to_build: null,
    active: null,
    themes: null
  }

}
