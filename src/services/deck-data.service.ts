import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";

import * as Scry from "scryfall-sdk";

import {TokenStorageService} from "./token-storage.service";
import {environment} from "../environments/environment";
@Injectable({
  providedIn: 'root'
})
export class DeckDataService {
  constructor(private http: HttpClient, private token: TokenStorageService) { }

  all_decks: any = null;
  my_decks: any = null;

  public async getDecks(): Promise<any> {
    return new Promise<any>(
      (resolve, reject) => {
        setTimeout(() => {
          if (this.my_decks) {
            resolve(this.my_decks);
          }
          else {
            this.http.get(environment.users_url + '/' + this.token.getUser().id).subscribe((decklist) => {
                let decks: any = decklist;
                for (let deck of decks) {
                  this.http.get(environment.deck_themes_url + deck.id).subscribe(async (themes) => {
                    deck.themes = themes;
                    deck.deleteThemes = [];
                    let scryfall_data = await Scry.Cards.byName(deck.commander);
                    deck.colors = scryfall_data.color_identity;
                    deck.edhrec_rank = scryfall_data.edhrec_rank;
                    if (deck.partner_commander) {
                      let partner_scryfall_data = await Scry.Cards.byName(deck.partner_commander);
                      deck.colors = deck.colors.concat(partner_scryfall_data.color_identity);
                      deck.partner_edhrec_rank = partner_scryfall_data.edhrec_rank;
                    }
                  });
                }
                this.my_decks = decks;
                resolve(this.my_decks);
              });
          }
        }, 5000);
      });
  }

  public async updateDecks(): Promise<any> {
    return new Promise<any>((resolve) => {
      setTimeout(() => {
        this.my_decks = null;
        this.getDecks().then((decks) => {
          this.my_decks = decks;
          resolve(this.my_decks);
        });
      }, 5000);
    });
  }
}
