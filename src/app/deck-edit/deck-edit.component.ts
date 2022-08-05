import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { Component, OnInit } from '@angular/core';
import {MatChipInputEvent} from '@angular/material/chips';

@Component({
  selector: 'app-deck-edit',
  templateUrl: './deck-edit.component.html',
  styleUrls: ['./deck-edit.component.scss']
})
export class DeckEditComponent implements OnInit {
  readonly  seperatorKeysCodes = [ENTER, COMMA] as const;

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
  deck_images: any = [
    "https://c1.scryfall.com/file/scryfall-cards/png/front/e/f/ef55cb9e-27ab-4a85-9246-873f699be0f3.png?1651796695",
    "https://c1.scryfall.com/file/scryfall-cards/png/front/b/e/be667162-cd28-403c-b65f-dadc5459e757.png?1562622151",
    "https://c1.scryfall.com/file/scryfall-cards/png/front/e/5/e5f336d8-12a4-482d-8ffd-c205858c72ba.png?1562941160",
    "https://c1.scryfall.com/file/scryfall-cards/png/front/e/f/ef55cb9e-27ab-4a85-9246-873f699be0f3.png?1651796695",
    "https://c1.scryfall.com/file/scryfall-cards/png/front/3/4/349e598a-aa12-44b7-b9de-067c9b85fcec.png?1562905628",
    "https://c1.scryfall.com/file/scryfall-cards/png/front/b/e/be667162-cd28-403c-b65f-dadc5459e757.png?1562622151",
    "https://c1.scryfall.com/file/scryfall-cards/png/front/e/5/e5f336d8-12a4-482d-8ffd-c205858c72ba.png?1562941160",
    "https://c1.scryfall.com/file/scryfall-cards/png/front/e/f/ef55cb9e-27ab-4a85-9246-873f699be0f3.png?1651796695",
    "https://c1.scryfall.com/file/scryfall-cards/png/front/3/4/349e598a-aa12-44b7-b9de-067c9b85fcec.png?1562905628",
    "https://c1.scryfall.com/file/scryfall-cards/png/front/b/e/be667162-cd28-403c-b65f-dadc5459e757.png?1562622151",
    "https://c1.scryfall.com/file/scryfall-cards/png/front/e/5/e5f336d8-12a4-482d-8ffd-c205858c72ba.png?1562941160",
    "https://c1.scryfall.com/file/scryfall-cards/png/front/e/f/ef55cb9e-27ab-4a85-9246-873f699be0f3.png?1651796695",
    "https://c1.scryfall.com/file/scryfall-cards/png/front/3/4/349e598a-aa12-44b7-b9de-067c9b85fcec.png?1562905628"
  ]
  image_index = -1;

  form: any = {
    commander: null,
    partner_commander: null,
    friendly_name: null,
    deck_url: null,
    play_rating: null,
    active: null,
    themes: null
  }

  constructor() { }

  ngOnInit(): void {
    this.form.commander = this.current_deck.commander;
    this.form.partner_commander = this.current_deck.partner_commander;
    this.form.friendly_name = this.current_deck.friendly_name;
    this.form.deck_url = this.current_deck.deck_url;
    this.form.play_rating = this.current_deck.play_rating;
    this.form.active = this.current_deck.active;
    this.form.themes = this.current_deck.themes;
    this.form.image_url = this.current_deck.image_url;

    this.deck_images.unshift(this.current_deck.image_url);
    this.image_index = 0;
  }

  addTheme(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) {
      this.form.themes.push({name: value, id: -1});
    }
    event.chipInput!.clear();
  }

  removeTheme(theme: any): void {
    const index = this.form.themes.indexOf(theme);
    if (index > -1) {
      this.form.themes.splice(index, 1);
    }
  }

  changeImage(): void {
    if (this.image_index > -1) {
      this.form.image_url = this.deck_images[this.image_index];
    }
  }

  onSubmit() {}
}
