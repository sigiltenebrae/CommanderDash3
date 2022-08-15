import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";

import {DeckDataService} from "../../services/deck-data.service";
import {TokenStorageService} from "../../services/token-storage.service";
import {debounceTime, distinctUntilChanged, Observable, OperatorFunction, switchMap, tap} from "rxjs";
import * as Scry from "scryfall-sdk";

@Component({
  selector: 'app-deck-bans',
  templateUrl: './deck-bans.component.html',
  styleUrls: ['./deck-bans.component.scss']
})
export class DeckBansComponent implements OnInit {

  public form: any = {
    card: null,
    type: 1
  }

  public loading = false; //display spinner while page is loading
  public searching = false; //searching for autocomplete scryfall
  public ban_type_dict: any = {}; //dictionary of ban types by key of id
  public all_bans_sorted: any = {}; //the ban list
  public cards_to_ban: any = [];
  public cards_to_remove: any = [];


  constructor(private deckData: DeckDataService, private tokenStorage: TokenStorageService, private router: Router) { }

  ngOnInit(): void {
    if (this.tokenStorage.getUser() == null || this.tokenStorage.getUser() == {} ||
      this.tokenStorage.getUser().id == null || this.tokenStorage.getUser().id < 0) {
      this.router.navigate(['login']);
    }
    else {
      this.loadPage().then();
    }
  }

  public async loadPage() {
    this.loading = true;
    this.deckData.getBanDict().then((ban_type_data) => {
      this.ban_type_dict = ban_type_data;
      this.deckData.getBanList().then((ban_data) => {
        let ban_list_data: any = ban_data;
        let ban_list_sorted = [];
        if (ban_list_data[4]) { //Allowed as commander
          ban_list_sorted.push({
            type: this.ban_type_dict[4],
            cards: ban_data[4]
          });
        }
        if (ban_list_data[3]) { //Banned as commander
          ban_list_sorted.push({
            type: this.ban_type_dict[3],
            cards: ban_data[3]
          });
        }
        if (ban_list_data[1]) {
          ban_list_sorted.push({
            type: this.ban_type_dict[1],
            cards: ban_data[1]
          });
        }
        if (ban_list_data[2]) {
          ban_list_sorted.push({
            type: this.ban_type_dict[2],
            cards: ban_data[2]
          });
        }
        this.all_bans_sorted = ban_list_sorted;
        this.loading = false;
      });
    })
  }

  public isAdmin(): boolean {
    return this.tokenStorage.getUser().isAdmin;
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

  public switchImage(card: any) {
    let temp:any = {};
    temp.image = card.image;
    card.image = card.image_back;
    card.image_back = temp.image;
  }

  public getBanIds() {
    return Object.keys(this.ban_type_dict);
  }

  public banCard() {
    if (this.form.card) {
      this.cards_to_ban.push({
        card_name: this.form.card,
        ban_type: this.form.type
      });
    }
    this.form.card = null;
    this.form.type = 1;
  }

  public unBanCard(card: any) {
    if (!this.cards_to_remove.includes(card)) {
      this.cards_to_remove.push(card);
    }
  }

  public submitBans() {

    let ban_promises: any = [];
    if (this.cards_to_ban.length > 0) {
      this.cards_to_ban.forEach((card: any) => {
        ban_promises.push(this.deckData.banCard(card));
      });
    }
    if (this.cards_to_remove.length > 0) {
      this.cards_to_remove.forEach((card: any) => {
        ban_promises.push(this.deckData.removeCardBan(card.name));
      });
    }
    Promise.all(ban_promises).then(() => {
      this.cards_to_remove = [];
      this.cards_to_ban = [];
      this.loadPage().then();
    });
  }
}
