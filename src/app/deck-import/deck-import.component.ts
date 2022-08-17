import { Component, OnInit } from '@angular/core';
import {delay} from "rxjs";
import {DeckDataService} from "../../services/deck-data.service";
import {TokenStorageService} from "../../services/token-storage.service";
import {Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import * as Scry from "scryfall-sdk";

@Component({
  selector: 'app-deck-import',
  templateUrl: './deck-import.component.html',
  styleUrls: ['./deck-import.component.scss']
})
export class DeckImportComponent implements OnInit {

  username = "";
  deckList: any = null;
  errors: any = [];
  total_decks = 0;
  current_deck = 0;
  loading_imports = false;
  done_imports = false;

  constructor(private deckData: DeckDataService, private tokenStorage: TokenStorageService,
              private router: Router, private http: HttpClient) { }

  ngOnInit(): void {
    if (this.tokenStorage.getUser() == null || this.tokenStorage.getUser() == {} ||
      this.tokenStorage.getUser().id == null || this.tokenStorage.getUser().id < 0) {
      this.router.navigate(['login']);
    }
  }

  getDeckList() {
    if (this.username !== "") {
      this.http.get('/archidekt/api/decks/cards/?formats=3&owner=' + this.username).subscribe(async (deck_data: any) => {
        this.deckList = deck_data.results;
        let data = deck_data;
        let page = 2;
        while (data.next) {
          data = await this.http.get('/archidekt/api/decks/cards/?formats=3&owner=' + this.username + '&page=' + page).toPromise();
          this.deckList = this.deckList.concat(data.results);
          page++;
        }
        this.deckList.forEach((deck: any) => {
          deck.play_rating = 3;
          deck.checked = false;
        })
      });
    }
  }

  async importDeck(deck: any): Promise<void> {
    return new Promise<void> ((resolve_deck) => {
      this.http.get('/archidekt/api/decks/' + deck.id + '/').pipe(delay(1000)).subscribe(async (archidektDeckInfo) => {
        let commanders: string[] = [];
        let deckInfo: any = archidektDeckInfo;
        deckInfo.cards.forEach((card: any) => {
          if (card.categories.includes("Commander")) {
            commanders.push(card.card.oracleCard.name);
          }
        });
        if (commanders.length == 0 || commanders.length > 2) {
          this.errors.push("Bad commander count: " + commanders.length + " on deck: " + deck.name);
          this.current_deck++;
          resolve_deck();
        } else {
          let deck_url = 'https://archidekt.com/decks/' + deck.id;
          let deck_creator = this.tokenStorage.getUser().id;
          let commander_image = "";
          let partner_image = "";
          let cur = await Scry.Cards.byName(commanders[0]);
          let cur_prints = await cur.getPrints();
          if (cur_prints) {
            let print = cur_prints[0]
            if (print.card_faces && print.card_faces.length > 1) {
              commander_image = print.card_faces[0].image_uris ? print.card_faces[0].image_uris.png : "";
            }
            else {
              commander_image = print.image_uris ? print.image_uris.png : "";
            }
          }
          if (commanders.length == 2) {
            let cur = await Scry.Cards.byName(commanders[1]);
            let cur_prints = await cur.getPrints();
            if (cur_prints) {
              let print = cur_prints[0]
              if (print.card_faces && print.card_faces.length > 1) {
                partner_image = print.card_faces[0].image_uris ? print.card_faces[0].image_uris.png : "";
              }
              else {
                partner_image = print.image_uris ? print.image_uris.png : "";
              }
            }
          }
          let out_deck: any = {};
          out_deck.friendly_name = deck.name;
          out_deck.commander = commanders[0];
          out_deck.url = deck_url;
          out_deck.image_url = commander_image;
          out_deck.play_rating = deck.play_rating;
          out_deck.build_rating = null; //comment this out
          out_deck.win_rating = null; //comment this out
          out_deck.active = true;
          out_deck.themes = [];
          out_deck.deleteThemes = [];
          out_deck.creator = deck_creator;
          if (commanders.length == 2) {
            out_deck.partner_commander = commanders[1];
            out_deck.partner_image_url = partner_image;
          }
          else {
            out_deck.partner_commander = null;
            out_deck.partner_image_url = null;
            this.deckData.createDeck(out_deck).subscribe(() => {
              this.current_deck++;
              resolve_deck();
            }, (error) => {
              this.current_deck++;
              resolve_deck();
            })
          }
        }
      }, (error) => {
        this.current_deck++;
        resolve_deck();
      })
    });
  }

  importDecks() {
    let import_promises: any = []
    this.deckList.forEach((deck: any) => {
      if (deck.checked) {
        import_promises.push(this.importDeck(deck));
      }
    });
    this.current_deck = 0;
    this.total_decks = import_promises.length;
    this.loading_imports = true;
    Promise.all(import_promises).then(() => {
      this.loading_imports = false;
      this.done_imports = true;
    })
  }

  setAll(checked: boolean) {
    this.deckList.forEach((deck: any) => {
      deck.checked = checked;
    })
  }

}
