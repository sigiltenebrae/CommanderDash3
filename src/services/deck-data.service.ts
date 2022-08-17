import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";

import * as Scry from "scryfall-sdk";

import {TokenStorageService} from "./token-storage.service";
import {environment} from "../environments/environment";
import {delay} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class DeckDataService {
  constructor(private http: HttpClient, private token: TokenStorageService) { }

  private my_decks: any = null; //list of all decks for user
  private themes: any = null; //list of all themes
  private user_dict: any = null; //dictionary of user ids and usernames
  private ban_dict: any = null; //dictionary of ban types by key of id
  private dict_ban: any = null; //reverse dictionary of ban types by key of type
  private ban_list: any = null;
  private ban_list_images = null;

  /**
   * Returns a dictionary of usernames by key of user id
   */
  public getUserDict(): Promise<any> {
    return new Promise<any>( (resolve_users, reject) => {
      if (this.user_dict) {
        resolve_users(this.user_dict);
      }
      else {
        this.http.get(environment.users_url).subscribe( async (userlist) => {
          let all_users: any = userlist;
          this.user_dict = {};
          for (let user of all_users) {
            this.user_dict[user.id] = user.username;
          }
          resolve_users(this.user_dict);
        });
      }
    });
  }

  /**
   * Returns dictionary of ban types by key of id
   */
  public getBanDict(): Promise<any> {
    return new Promise<any>( (resolve_bans, reject) => {
      if (this.ban_dict) {
        resolve_bans(this.ban_dict);
      }
      else {
        this.http.get(environment.bans_url + '/types').subscribe(async (banlist) => {
          let all_ban_types: any = banlist;
          this.ban_dict = {};
          this.dict_ban = {};
          for (let ban of all_ban_types) {
            this.ban_dict[ban.id] = ban.type;
            this.dict_ban[ban.type] = ban.id;
          }
          resolve_bans(this.ban_dict);
        });
      }
    })
  }

  public getDictBan(): Promise<any> {
    return new Promise<any> ((resolve_bans) => {
      if (this.dict_ban) {
        resolve_bans(this.dict_ban);
      }
      else {
        this.getBanDict().then(() => {
          resolve_bans(this.dict_ban);
        })
      }
    });
  }

  /**
   * Returns the ban list in the form of a dictionary of keys of ban_type and arrays of cards.
   */
  public getBanList(): Promise<any> {
    return new Promise<any>((resolve_bans, reject) => {
      if (this.ban_list) {
        resolve_bans(this.ban_list)
      }
      this.http.get(environment.bans_url).subscribe(async (banlist) => {
        let bans: any = banlist;
        let ban_dict: any = {};
        for (let ban of bans) {
          if (ban_dict[ban.ban_type] != null) {
            ban_dict[ban.ban_type].push({
              name: ban.card_name,
            });
          }
          else {
            ban_dict[ban.ban_type] = [];
            ban_dict[ban.ban_type].push({
              name: ban.card_name,
            });
          }
        }
        this.ban_list = ban_dict;
        resolve_bans(ban_dict);
      }, (error) => {
        resolve_bans({});
      });
    });
  }


  /**
   * Returns the ban list in the form of a dictionary of keys of ban_type and arrays of cards as well as Scryfall image data.
   */
  public getBanListWithImages(): Promise<any> {
    return new Promise<any>((resolve_bans, reject) => {
      if (this.ban_list_images) {
        resolve_bans(this.ban_list_images)
      }
      this.http.get(environment.bans_url).subscribe(async (banlist) => {
        let bans: any = banlist;
        let ban_dict: any = {};
        for (let ban of bans) {
          let commander = ban.card_name;
          let cur = await Scry.Cards.byName(commander.indexOf('//') > -1 ? commander.substring(0, commander.indexOf('//') - 1): commander);
          let cur_prints = await cur.getPrints();
          let image: string | undefined = '';
          let image_back: string | undefined = '';
          if (cur_prints) {
            if (cur_prints[0].card_faces && cur_prints[0].card_faces.length > 1) {
              image = cur_prints[0].card_faces[0].image_uris?.png;
              image_back = cur_prints[0].card_faces[1].image_uris?.png;
            }
            else {
              image = cur_prints[0].image_uris?.png;
            }
          }
          if (ban_dict[ban.ban_type] != null) {
            ban_dict[ban.ban_type].push({
              name: ban.card_name,
              image: image,
              image_back: image_back !== '' ? image_back: null
            });
          }
          else {
            ban_dict[ban.ban_type] = [];
            ban_dict[ban.ban_type].push({
              name: ban.card_name,
              image: image,
              image_back: image_back !== '' ? image_back: null
            });
          }
        }
        this.ban_list = ban_dict;
        this.ban_list_images = ban_dict;
        resolve_bans(ban_dict);
      }, (error) => {
        resolve_bans({});
      });
    });
  }

  /**
   * Adds the given card object to the ban list.
   * @param card_to_ban Card object, needs to include card_name and type.
   */
  public banCard(card_to_ban: any): Promise<void> {
    return new Promise<void>((resolve_ban, reject) => {
      this.http.post(environment.bans_url + '/add', JSON.stringify(card_to_ban), {headers : new HttpHeaders({'Content-Type': 'application/json'})}).subscribe(() => {
        resolve_ban();
      }, (error) => {
        resolve_ban();
      });
    })
  }

  /**
   * Remove the given card from the ban list
   * @param card_name string name of card to remove
   */
  public removeCardBan(card_name: string): Promise<void> {
    return new Promise<void>((resolve) => {
      this.http.post(environment.bans_url + '/remove', JSON.stringify({card_name: card_name}), {headers: new HttpHeaders({'Content-Type': 'application/json'})}).subscribe(() => {
        resolve();
      }, (error) => {
        resolve();
      });
    });
  }

  /**
   * Returns all decks from the db, sorted by user.
   */
  public async getAllDecks(): Promise<any> {
    return new Promise<any>( (resolve_decks, reject) => {
      this.http.get(environment.decks_url).subscribe(async (decklist) => {
        let all_decks: any = decklist;
        resolve_decks(all_decks);
      }, (error) => {
        resolve_decks([]);
      });
    });
  }

  /**
   * Returns the contents of 'my_decks' or grabs from the db if 'my_decks' is empty.
   */
  public async getDecks(): Promise<any> {
    return new Promise<any>((resolve_decks, reject) => {
      if (this.my_decks) {
        resolve_decks(this.my_decks);
      }
      else {
        this.http.get(environment.decks_url + 'byuser/' + this.token.getUser().id).subscribe(async (decklist) => {
          this.my_decks = decklist;
          resolve_decks(this.my_decks);
        }, (error) => {
          resolve_decks([]);
        });
      }
    });
  }

  /**
   * Forces an update of 'my_decks' from the database
   */
  public async refreshDecks(): Promise<any> {
    return new Promise<any>((resolve) => {
      this.my_decks = null;
      this.getDecks().then((decks) => {
        this.my_decks = decks;
        resolve(this.my_decks);
      });
    });
  }

  /**
   * Returns a deck with the matching id from 'my_decks', or null if not found
   * @param deckId id of deck to get data for
   */
  public async getDeck(deckId: number): Promise<any> {
    return new Promise<any>((resolve) => {
      this.getDecks().then((decks) => {
        decks.forEach((deck: any) => {
          if(deck.id == deckId) {
            resolve(deck);
          }
        }); //See if it belongs to the user
        this.http.get(environment.decks_url + deckId).subscribe((deck) => { //in this case it does not
          resolve(deck);
        }, (error) => {
          resolve(null);
        });
      });
    });
  }

  /**
   * Forces an update of a deck with the given id from the db
   * @param deckId id of deck to get data for
   */
  public async refreshDeck(deckId: number): Promise<any> {
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
        }, (error) => {
          resolve({});
        });
      });
    });
  }

  public removeDeckFromUserDecks(deckId: number) {
    this.getDecks().then((decks) => {
      let deck_index = -1;
      decks.forEach((deck: any) => {
        if (deck.id == deckId) {
          deck_index = decks.indexOf(deck);
        }
      });
      if (deck_index > -1) {
        this.my_decks.splice(deck_index, 1);
      }
    })
  }

  /**
   * Loads in images and themes for a deck and adds them to the object
   * @param deck deck to get data for
   */
  public async getDeckScryfallData(deck: any): Promise<any> {
    return new Promise<void>((resolve_scryfall) => {
      this.http.get(environment.deck_themes_url + deck.id).subscribe(async (themes) => {
        deck.themes = themes;
        deck.deleteThemes = [];
        let scryfall_data = await Scry.Cards.byName(deck.commander);
        deck.colors = scryfall_data.color_identity;
        if (deck.partner_commander != null) {
          let partner_scryfall_data = await Scry.Cards.byName(deck.partner_commander);
          deck.colors = deck.colors.concat(partner_scryfall_data.color_identity);
        }
        resolve_scryfall();
      }, (error) => {
        resolve_scryfall();
      });
    });
  }

  /**
   * Returns the contents of 'themes' or grabs from the db if 'themes' is empty
   */
  public async getThemeList(): Promise<any> {
    return new Promise<any>((resolve) => {
      if (this.themes) {
        resolve(this.themes);
      }
      else {
        this.http.get(environment.themes_url).subscribe((theme_data) => {
          this.themes = theme_data;
          this.themes.sort((a: any, b: any) => (a.name > b.name) ? 1: -1);
          resolve(this.themes);
        }, (error) => {
          resolve([]);
        });
      }
    });
  }

  /**
   * Update information for deck in the database. Does not update the deck in 'my_decks'
   * @param deck deck to update in db
   * @param id id for deck to update
   */
  public updateDeck(deck: any, id: number) {
    return this.http.put<any>(environment.decks_url + id, JSON.stringify(deck), {headers : new HttpHeaders({'Content-Type': 'application/json'})})
  }

  /**
   * Creates a deck in the database and returns its new id. Does not add the deck to 'my_decks'
   * @param deck deck to create
   */
  public createDeck(deck: any) {
    return this.http.post(environment.decks_url, JSON.stringify(deck), {headers : new HttpHeaders({'Content-Type': 'application/json'})})
  }

  public addGame(game: any) {
    return this.http.post(environment.games_url, JSON.stringify(game), {headers : new HttpHeaders({'Content-Type': 'application/json'})})
  }

  public async getGameDataForDeck(deck: any): Promise<void> {
    return new Promise<void> ((resolve) => {
      let gameData: any = { wins: 0, losses: 0 }
      this.http.get(environment.games_url + '/deck/' + deck.id).subscribe((gameList: any) => {
        gameList.forEach((game: any) => {
          if(game.win) {
            gameData.wins ++;
          }
          else {
            gameData.losses ++;
          }
        });
        deck.play_data = gameData;
        resolve();
      }, (error) => {
        resolve();
      })
    });
  }

  /**
   * Deletes a deck from the database and removes it from 'my_decks'
   * @param deck deck to delete
   */
  public deleteDeck(deck: any) {
    for (let i = 0; i < this.my_decks.length; i++) {
      if (this.my_decks[i].id == deck.id) {
        this.my_decks.splice(i, 1);
      }
    }
    return this.http.delete(environment.decks_url + deck.id);
  }

  public async getDeckLegality(deck: any): Promise<void> {
    return new Promise<void>((resolve_legality) => {
      if (deck.url == null || deck.url === "") {
        deck.legality = "Unknown";
        deck.issues = [];
        resolve_legality();
      }
      else {
        this.getBanDict().then(() => {
          this.getBanList().then((banlist) => {
            let ban_list = banlist;
            let deckId = deck.url.substring(0, deck.url.indexOf('#')).substring(deck.url.indexOf('/decks/') + 7);
            this.http.get('/archidekt/api/decks/' + deckId + '/').pipe(delay(1000)).subscribe((archidektDeckInfo) => {
              let archidekt_deck: any = archidektDeckInfo;
              let banned_cards: any = [];
              archidekt_deck.cards.forEach((card: any) => {
                for (let i = 0; i < ban_list[this.dict_ban["banned"]].length; i++) {
                  if (card.card.oracleCard.name === ban_list[this.dict_ban["banned"]][i].name) {
                    banned_cards.push(card.card.oracleCard.name);
                    break;
                  }
                }
              });
              deck.legality = banned_cards.length > 0 ? "Illegal": "Legal";
              deck.issues = banned_cards;
              resolve_legality();
            }, (error) => {
              deck.legality = "Unknown";
              deck.issues = [];
              resolve_legality();
            });
          });
        });
      }
    });
  }
}
