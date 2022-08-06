import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";

import {MatChipInputEvent} from '@angular/material/chips';

import {DeckDataService} from "../../services/deck-data.service";
import {TokenStorageService} from "../../services/token-storage.service";

@Component({
  selector: 'app-deck-edit',
  templateUrl: './deck-edit.component.html',
  styleUrls: ['./deck-edit.component.scss']
})
export class DeckEditComponent implements OnInit {
  readonly  seperatorKeysCodes = [ENTER, COMMA] as const;

  new_deck = false;
  deleting = false;
  loading = false;

  current_user: any = null;
  current_deck: any = null;
  image_index = -1;
  decks: any = [];

  form: any = {
    commander: null,
    partner_commander: null,
    friendly_name: null,
    deck_url: null,
    image_url: null,
    partner_image_url: null,
    play_rating: null,
    active: null,
    themes: null
  }

  constructor(private router: Router, private route: ActivatedRoute,
              private deckData: DeckDataService, private token: TokenStorageService) {}

  ngOnInit(): void {

    const routeParams = this.route.snapshot.paramMap;
    const deckId = Number(routeParams.get('deckId'));

    if (deckId == -1) {
      this.new_deck = true;
      this.current_deck = null;
      this.form.friendly_name = "";
      this.form.deck_url = "";
      this.form.image_url = "";
      this.form.play_rating = 1;
      this.form.themes = [];
      this.form.active = true;
    }
    else if (deckId < 0) {
      this.router.navigate(['/']);
    }
    else {
      this.loading = true;
      this.deckData.getDeck(deckId).then((deck) => {
      this.current_deck = deck;

      this.form.commander = this.current_deck.commander;
      this.form.partner_commander = this.current_deck.partner_commander;
      this.form.friendly_name = this.current_deck.friendly_name;
      this.form.deck_url = this.current_deck.deck_url;
      this.form.play_rating = this.current_deck.play_rating;
      this.form.active = this.current_deck.active;
      this.form.themes = this.current_deck.themes;
      this.form.image_url = this.current_deck.image_url;
      this.image_index = 0;
      this.loading = false;
      });
    }
    this.deleting = false;
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
      this.form.image_url = this.current_deck.images[this.image_index];
    }
  }

  onSubmit() {}
}
