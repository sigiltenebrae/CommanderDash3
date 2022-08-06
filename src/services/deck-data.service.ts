import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";

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
    return new Promise<any>((resolve_decks, reject) => {
      if (this.my_decks) {
        resolve_decks(this.my_decks);
      }
      else {
        this.http.get(environment.users_url + '/' + this.token.getUser().id).subscribe(async (decklist) => {
          let decks: any = decklist;
          for (let deck of decks) {
            await this.getDeckScryfallData(deck);
          }
          this.my_decks = decks;
          resolve_decks(this.my_decks);
        });
      }
    });
  }

  public async refreshDecks(): Promise<any> {
    return new Promise<any>((resolve) => {
      this.my_decks = null;
      this.getDecks().then((decks) => {
        this.my_decks = decks;
        resolve(this.my_decks);
      });
    });
  }

  public async getDeck(deckId: number): Promise<any> {
    return new Promise<any>((resolve) => {
      console.log('getting deck');
      this.getDecks().then((decks) => {
        decks.forEach((deck: any) => {
          if(deck.id == deckId) { resolve(deck) }
        });
        resolve(null);
      });
    });
  }

  public async updateDeck(deckId: number): Promise<any> {
    return new Promise<any>((resolve) => {
      this.getDecks().then((decks) => {
        let deck_index = -1;
        decks.forEach((deck: any) => {
          if (deck.id == deckId) {
            deck_index = decks.indexOf(deck);
          }
        });
        this.http.get(environment.decks_url + deckId).subscribe(async (deck) => {
          if (deck) {
            await this.getDeckScryfallData(deck);
            if (deck_index > -1) {
              this.my_decks[deck_index] = deck;
            } else {
              this.my_decks.push(deck);
            }
          }
          resolve(deck);
        });
      });
    });
  }

  public async getDeckScryfallData(deck: any): Promise<any> {
    return new Promise<void>((resolve_scryfall) => {
      this.http.get(environment.deck_themes_url + deck.id).subscribe(async (themes) => {
        deck.themes = themes;
        deck.deleteThemes = [];
        let scryfall_data = await Scry.Cards.byName(deck.commander);
        deck.colors = scryfall_data.color_identity;
        deck.images = [deck.image_url];
        let cur_prints = await scryfall_data.getPrints();
        cur_prints.forEach((print: any) => {
          if (print.image_uris?.png) {
            deck.images.push(print.image_uris?.png);
          }
        });
        if (deck.partner_commander != null) {
          let partner_scryfall_data = await Scry.Cards.byName(deck.partner_commander);
          deck.colors = deck.colors.concat(partner_scryfall_data.color_identity);
          deck.partner_images = [deck.partner_image_url];
          let cur_partner_prints = await partner_scryfall_data.getPrints();
          cur_partner_prints.forEach((print: any) => {
            if (print.image_uris?.png) {
              deck.partner_images.push(print.image_uris.png);
            }
          })
        }
        resolve_scryfall();
      });
    });
  }
}