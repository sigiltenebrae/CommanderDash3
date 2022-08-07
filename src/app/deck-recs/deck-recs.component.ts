import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";

import {Subject, takeUntil, timer} from "rxjs";

import {TokenStorageService} from "../../services/token-storage.service";
import {DeckDataService} from "../../services/deck-data.service";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-deck-recs',
  templateUrl: './deck-recs.component.html',
  styleUrls: ['./deck-recs.component.scss']
})
export class DeckRecsComponent implements OnInit {

  loading = false;
  calculating = false;
  calculated = false;

  calc_clock: any;
  calc_clock_subscribe: any;
  subject: any;
  commander_position = 0;
  commander_total = 0;

  decks: any[] = [];

  user_randomness = 50;
  color_randomness = 25;
  theme_randomness = 50;

  toggle_colors = false;
  toggle_w = false;
  toggle_u = false;
  toggle_b = false;
  toggle_r = false;
  toggle_g = false;
  toggle_c = false;
  toggle_tribal = true;
  toggle_top = false;
  toggle_partner = false;

  recommendation_data: any = {};

  constructor(private deckData: DeckDataService, private tokenStorage: TokenStorageService,
              private router: Router, private http: HttpClient) { }

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

  calculateRecommendations(): void {
    this.calculating = true;
    this.calculated = false;
    this.subject = new Subject();
    this.calc_clock_subscribe = timer(1000, 1000);
    timer(1000, 1000).pipe(
      takeUntil(this.subject),
    ).subscribe(val => {
      this.calc_clock = val;
    });

    this.commander_total = this.decks.length;
    this.commander_position = 0;

    let commander_promises: any[] = [];
    this.decks.forEach((deck) => { commander_promises.push(this.calculateRecommendationsForCommander(deck)); });
    Promise.all(commander_promises).then(() => {

    });
  }

  async calculateRecommendationsForCommander(deck: any) {
    return new Promise<void>((resolve_commander) => {
      let creator_promises: any[] = [];

      this.http.get('/archidekt/api/decks/cards/?deckFormat=3&commanders="' + deck.commander + '"&orderBy=-viewCount&pageSize=100').subscribe((archidekt_decks) => {
        let linked_decks: any = archidekt_decks;
        if (deck.partner_commander) {
          linked_decks.results.forEach((linked_deck: any) => { creator_promises.push(this.getDecksForCreator(linked_deck.owner.username, deck.play_rating / 2)); });
          this.http.get('/archidekt/api/decks/cards/?deckFormat=3&commanders="' + deck.commander + '"&orderBy=-viewCount&pageSize=100').subscribe((archidekt_partner_decks) => {
            let linked_partner_decks: any = archidekt_partner_decks;
            linked_partner_decks.results.forEach((linked_partner_deck: any) => { creator_promises.push(this.getDecksForCreator(linked_partner_deck.owner.username, deck.play_rating / 2)) });
            Promise.all(creator_promises).then(() => { this.commander_position++; resolve_commander(); }).catch((err) => { console.log(err); resolve_commander(); });
          }); //Partner commanders have their rating halved to account for mandatory partners.
        }
        else {
          linked_decks.results.forEach((linked_deck: any) => { creator_promises.push(this.getDecksForCreator(linked_deck.owner.username, deck.play_rating)); });
          Promise.all(creator_promises).then(() => { this.commander_position++; resolve_commander(); }).catch((err) => { console.log(err); resolve_commander(); });
        }
      });
    });
  }

  async getDecksForCreator(username: string, playRating: number) {
    return new Promise<void>((resolve_user) => {
      let recommended_promises: any[] = [];

      this.http.get('/archidekt/api/decks/cards/?owner=' + username + '&orderBy=-viewCount').subscribe((recommend_decks) => {
        let recommended_decks: any = recommend_decks;

        recommended_decks.results.forEach((recommended_deck: any) => { recommended_promises.push(this.getDeckFromServer(recommended_deck.id, playRating)); });
        Promise.all(recommended_promises).then(() => { resolve_user(); }).catch((err) => { console.log(err); resolve_user(); });
      });
    });
  }

  async getDeckFromServer(deckId: number, playRating: number) {
    return new Promise<void>((resolve_deck) => {
      this.http.get('/archidekt/api/decks/' + deckId + '/').subscribe((archidektDeckInfo) => {
        let deckInfo: any = archidektDeckInfo;
        deckInfo.cards.forEach((card: any) => {
          if (card.categories.includes("Commander")) {
            if (this.recommendation_data[card.card.oracleCard.name] != null) {
              this.recommendation_data[card.card.oracleCard.name] += (playRating / 5);
            }
            else {
              this.recommendation_data[card.card.oracleCard.name] = (playRating / 5);
            }
          }
        });
        resolve_deck();
      }, (err) => {
        console.log(err);
        resolve_deck();
      });
    });
  }

  getColorRatings() {

  }
}
