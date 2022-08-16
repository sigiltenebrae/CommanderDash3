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

  public errorMessage = ''; //error to display on form submission failure
  public isSubmitFailed = false; //toggle if the form failed to submit

  public themes: any[] = []; //list of all themes
  public temp_theme: any = null; //temp theme used for adding to list

  public new_deck = false; //is it a create or edit
  public deleting = false; //boolean toggle for the "confirm / cancel" check
  public loading = false; //display the spinner while page is loading
  public has_partner = false; //does the commander have a partner
  public searching = false; //is the typeahead still searching

  private current_user: any = null; //who is currently logged in
  public current_deck: any = null; //the deck that is currently open
  public image_index = -1; //index of image currently being used in the list of all images
  public partner_image_index = -1; //same as above for partner

  public form: any = {
    commander: "",
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
    //prevents the page from saving data when going from edit to create
  }

  ngOnInit(): void {

    //force user to log in to view
    if (this.tokenStorage.getUser() == null || this.tokenStorage.getUser() == {} ||
      this.tokenStorage.getUser().id == null || this.tokenStorage.getUser().id < 0) {
      this.router.navigate(['login']);
    }
    else {
      const routeParams = this.route.snapshot.paramMap;
      const deckId = Number(routeParams.get('deckId')); //get deck id from route

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
        this.form.play_rating = 3;
        this.form.themes = [];
        this.form.active = true;
      }
      else if (deckId < 0) {
        this.router.navigate(['/']); //if deck id is invalid, go back to home
      }
      else {
        this.loading = true;
        this.deckData.getDeck(deckId).then((deck) => {
          this.current_deck = JSON.parse(JSON.stringify(deck));
          this.current_deck.themes = [];
          this.current_deck.colors = null;
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
          this.current_deck.images = [this.form.image_url];
          if (this.form.partner_commander) {
            this.current_deck.partner_images = [this.form.partner_image_url];
          }
          this.loading = false;
          this.deckData.getDeckScryfallData(this.current_deck).then(async () => {
            let cur = await Scry.Cards.byName(this.form.commander);
            let cur_prints = await cur.getPrints();
            cur_prints.forEach((print: any) => {
              if (print.image_uris?.png) {
                this.current_deck.images.push(print.image_uris?.png);
              }
            });
            if (this.form.partner_commander) {

              let cur = await Scry.Cards.byName(this.form.partner_commander);
              let cur_prints = await cur.getPrints();
              cur_prints.forEach((print: any) => {
                if (print.image_uris?.png) {
                  this.current_deck.partner_images.push(print.image_uris?.png);
                }
              });
              this.partner_image_index = 0;
            }
          });
        });
      }
      this.deleting = false;
      this.deckData.getThemeList().then((themes) => {
        this.themes = themes;
      })
    }

  }

  /**
   * OperatorFunction for Scryfall autocomplete on typeahead.
   * @param text$ string to autocomplete
   */
  // @ts-ignore
  public card_search: OperatorFunction<string, readonly string[]> = (text$: Observable<string>) =>
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

  /**
   * OperatorFunction for theme autocomplete on a typeahead
   * @param text$ string to autocomplete
   */
  public theme_search: OperatorFunction<string, readonly {id: number, name: string}[]> = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      map(term => term === '' ? this.themes
        : this.themes.filter(v => v.name.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
    );

  public theme_formatter = (x: {name: string}) => x.name;

  /**
   * Adds theme to the form's theme list
   * @param event detects a chip create event to add it to the list
   */
  public addTheme(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) {
      this.form.themes.push({name: value, id: this.temp_theme.id});
    }
    event.chipInput!.clear();
  }

  /**
   * Removes the theme from the form theme list
   * @param theme theme to remove
   */
  public removeTheme(theme: any): void {
    const index = this.form.themes.indexOf(theme);
    if (index > -1) {
      this.form.themes.splice(index, 1);
    }
  }

  /**
   * Helper function for the slider to change the commander image
   */
  public changeImage(): void {
    if (this.image_index > -1) {
      this.form.image_url = this.current_deck.images[this.image_index];
    }
  }

  /**
   * Helper function for the slider to change the partner image
   */
  public changePartnerImage(): void {
    if (this.partner_image_index > -1) {
      this.form.partner_image_url = this.current_deck.partner_images[this.partner_image_index];
    }
  }

  /**
   * Helper function to update the image array when the commander in the form is changed.
   */
  public async updateCommander() {
    if (this.form.commander && this.form.commander !== "") {
      this.form.image_url = "";
      this.current_deck.images = [];
      let cur = await Scry.Cards.byName(this.form.commander);
      let cur_prints = await cur.getPrints();
      if (cur_prints) {
        cur_prints.forEach((print: any) => {
          if (print.card_faces && print.card_faces.length > 1) {
            print.card_faces.forEach((face: any) => {
              this.current_deck.images.push(face.image_uris?.png);
            });
          }
          else {
            this.current_deck.images.push(print.image_uris?.png);
          }
        });
      }
      this.image_index = 0;
      this.form.image_url = this.current_deck.images.length > 0 ? this.current_deck.images[0]: "";
    }
  }

  /**
   * Turn partner on/off
   */
  public toggle_partner() {
    if (this.has_partner) {
      this.has_partner = false;
    }
    else {
      this.has_partner = true;
      this.current_deck.partner_images = [""];
    }
  }

  /**
   * Helper function to update the image array when the partner in the form is changed
   */
  public async updatePartner() {
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

  /**
   * Swaps the commander and partner
   */
  public swapCommanderPartner() {
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
      this.current_deck.partner_images = temp.images;
      this.partner_image_index = temp.index;
    }
  }


  /**
   * On clicking the submit button, either calls create or update
   */
  public onSubmit() {
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
    if (this.current_deck.themes && this.current_deck.themes.length > 0) {
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
      this.form.themes.forEach((theme: any) => {
        let found = false;
        for (let i = 0; i < this.current_deck.themes.length; i++) {
          if (theme.id == this.current_deck.themes[i].id) {
            found = true;
            break;
          }
        }
        if (!found) {
          out_deck.themes.push(theme);
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


  /**
   * On delete button click, calls delete
   */
  public onDelete() {
    if (this.current_deck) {
      if (this.deleting) {
        console.log('deleting deck ' + this.current_deck.id + '...');
        this.deckData.deleteDeck(this.current_deck).subscribe(
          (response) => {
            this.router.navigate(['decks']).then();
          },
          (error) => {
            console.log(error);
            this.router.navigate(['decks']).then();
          });
      }
    }
  }
}

