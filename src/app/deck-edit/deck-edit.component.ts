import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {debounceTime, distinctUntilChanged, map, Observable, OperatorFunction, switchMap, tap} from "rxjs";

import * as Scry from "scryfall-sdk";

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

  errorMessage = '';
  isSignUpFailed = false;

  themes: any[] = [];
  temp_theme: any = null;

  new_deck = false;
  deleting = false;
  loading = false;
  has_partner = false;
  searching = false;

  current_user: any = null;
  current_deck: any = null;
  image_index = -1;
  partner_image_index = -1;

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
              private deckData: DeckDataService, private tokenStorage: TokenStorageService) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  ngOnInit(): void {

    if (this.tokenStorage.getUser() == null || this.tokenStorage.getUser() == {} ||
      this.tokenStorage.getUser().id == null || this.tokenStorage.getUser().id < 0) {
      this.router.navigate(['login']);
    }
    else {
      const routeParams = this.route.snapshot.paramMap;
      const deckId = Number(routeParams.get('deckId'));

      if (deckId == -1) {
        this.new_deck = true;
        this.has_partner = false;
        this.current_deck = {};
        this.current_deck.images = [];
        this.current_deck.colors = [];
        this.form.friendly_name = "";
        this.form.deck_url = "";
        this.form.image_url = "";
        this.form.partner_image_url = "";
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
          this.has_partner = (this.current_deck.partner_commander != null);

          this.form.commander = this.current_deck.commander;
          this.form.partner_commander = this.current_deck.partner_commander;
          this.form.friendly_name = this.current_deck.friendly_name;
          this.form.url = this.current_deck.url;
          this.form.play_rating = this.current_deck.play_rating;
          this.form.active = this.current_deck.active;
          this.form.themes = [...this.current_deck.themes];
          this.form.image_url = this.current_deck.image_url;
          this.form.partner_image_url = this.current_deck.partner_image_url;
          this.image_index = 0;
          if (this.form.partner_image_url) {
            this.partner_image_index = 0;
          }
          this.loading = false;
        });
      }
      this.deleting = false;
      this.deckData.getThemeList().then((themes) => {
        this.themes = themes;
      })
    }

  }

  // @ts-ignore
  card_search: OperatorFunction<string, readonly string[]> = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => this.searching = true),
      // @ts-ignore
      switchMap(async term => {
        this.searching = true;
        return await Scry.Cards.autoCompleteName(term);
      }),
      tap(() => {
        this.searching = false;
      }));

  theme_search: OperatorFunction<string, readonly {id: number, name: string}[]> = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      map(term => term === '' ? this.themes
        : this.themes.filter(v => v.name.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
    );

  theme_formatter = (x: {name: string}) => x.name;

  addTheme(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) {
      this.form.themes.push({name: value, id: this.temp_theme.id});
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

  changePartnerImage(): void {
    if (this.partner_image_index > -1) {
      this.form.partner_image_url = this.current_deck.partner_images[this.partner_image_index];
    }
  }

  async updateCommander() {
    if (this.form.commander && this.form.commander !== "") {
      this.form.image_url = "";
      this.current_deck.images = [];
      let cur = await Scry.Cards.byName(this.form.commander);
      let cur_prints = await cur.getPrints();
      cur_prints.forEach((print: any) => {
        if (print.image_uris?.png) {
          this.current_deck.images.push(print.image_uris?.png);
        }
      });
      this.image_index = 0;
      this.form.image_url = this.current_deck.images[0];
    }
  }

  async updatePartner() {
    if (this.form.partner_commander && this.form.partner_commander !== "") {
      this.form.partner_image_url = "";
      this.current_deck.partner_images = [];
      let cur = await Scry.Cards.byName(this.form.partner_commander);
      let cur_prints = await cur.getPrints();
      cur_prints.forEach((print: any) => {
        if (print.image_uris?.png) {
          this.current_deck.partner_images.push(print.image_uris?.png);
        }
      });
      this.partner_image_index = 0;
      this.form.partner_image_url = this.current_deck.partner_images[0];
    }
  }

  swapCommanderPartner() {
    if (this.form.commander && this.form.commander !== "" &&
      this.form.partner_commander && this.form.partner_commander !== "") {
      let temp: any = {};
      temp.commander = this.form.commander;
      temp.image_url = this.form.image_url;
      temp.images = this.current_deck.images;
      temp.index = this.image_index;

      this.form.commander = this.form.partner_commander;
      this.form.image_url = this.form.partner_image_url;
      this.current_deck.images = this.current_deck.partner_images;
      this.image_index = this.partner_image_index;

      this.form.partner_commander = temp.commander;
      this.form.partner_image_url = temp.image_url;
      this.current_deck.partner_imager = temp.images;
      this.partner_image_index = temp.index;
    }
  }

  onSubmit() {
    let out_deck: any = {};
    out_deck.friendly_name = this.form.friendly_name;
    out_deck.commander = this.form.commander;
    out_deck.url = this.form.url;
    out_deck.image_url = this.form.image_url;
    out_deck.play_rating = this.form.play_rating;
    out_deck.build_rating = null; //comment this out
    out_deck.win_rating = null; //comment this out
    out_deck.active = this.form.active;
    out_deck.themes = [];
    out_deck.deleteThemes = [];
    if (this.current_deck.themes) {
      this.current_deck.themes.forEach(
        (theme: any) => {
          let found = false;
          for (let i = 0; i < this.form.themes.length; i++) {
            if (theme.id === this.form.themes[i].id) {
              out_deck.themes.push(theme);
              found = true;
              break;
            }
          }
          if (!found) {
            out_deck.deleteThemes.push(theme);
          }
        });
    }
    else {
      out_deck.themes = this.form.themes;
    }

    if (this.has_partner && this.form.partner_commander != null && this.form.partner_commander !== "") {
      out_deck.partner_commander = this.form.partner_commander;
      out_deck.partner_image_url = this.form.partner_image_url;
    }
    else {
      out_deck.partner_commander = null;
      out_deck.partner_image_url = null;
    }
    if (this.new_deck) {
      this.deckData.createDeck(out_deck).subscribe((response) => {
        let new_id: any = response;
        if (new_id && new_id.id) {
          this.deckData.refreshDeck(new_id.id).then( () => {
            this.router.navigate(['decks']).then();
          });
        }
      }, (error) => {
        if (error.status == 201) {
          console.log(error);
        }
      });
    }
    else {
      this.deckData.updateDeck(out_deck, this.current_deck.id).subscribe((response) => {
        this.deckData.refreshDeck(this.current_deck.id).then( () => {
          this.router.navigate(['decks']).then();
        })
      }, (error) => {
        if (error) {
          console.log(error);
        }
      });
    }
  }
}

