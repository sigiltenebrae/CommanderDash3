import { Component, OnInit } from '@angular/core';
import {BreakpointObserver} from "@angular/cdk/layout";
import {Form, FormArray, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {StepperOrientation} from '@angular/material/stepper';
import {map} from 'rxjs/operators';
import {debounceTime, Observable, OperatorFunction} from "rxjs";
import {DeckDataService} from "../../services/deck-data.service";
import {TokenStorageService} from "../../services/token-storage.service";
import {Router} from "@angular/router";
import {COMMA, ENTER} from "@angular/cdk/keycodes";
import {MatChipInputEvent} from "@angular/material/chips";

@Component({
  selector: 'app-win-stats',
  templateUrl: './win-stats.component.html',
  styleUrls: ['./win-stats.component.scss']
})
export class WinStatsComponent implements OnInit {
  readonly  seperatorKeysCodes = [ENTER, COMMA] as const;

  public user_dict: any = {}; //dictionary of user ids and usernames
  public all_decks: any[] = []; //list of all decks
  public decks_formatted: any = null;
  public current_players: any = [];
  public temp_deck: any = null;
  public current_winner: any = null;



  decksPlayedGroup = this.formBuilder.group({});
  winnerGroup = this.formBuilder.group({winner: ['', Validators.required],});

  stepperOrientation: Observable<StepperOrientation>;

  constructor(private formBuilder: FormBuilder, breakpointObserver: BreakpointObserver,
              private deckData: DeckDataService, private tokenStorage: TokenStorageService, private router: Router) {
    this.stepperOrientation = breakpointObserver
      .observe('(min-width: 800px)')
      .pipe(map(({matches}) => (matches ? 'horizontal' : 'vertical')));
  }

  public player_formatter = (x: {creatorName: string, deckName: string, commander: string}) => x.creatorName + ": " + x.deckName + " (" + x.commander + ")";

  public player_search: OperatorFunction<string, readonly any[]> = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      map(term => term === '' ? this.decks_formatted
        : this.decks_formatted.filter((v: { creatorName: string; deckName: string; commander: string; }) => String(v.creatorName + ': ' + v.deckName + ' (' + v.commander + ')').toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
    );

  ngOnInit(): void {
    if (this.tokenStorage.getUser() == null || this.tokenStorage.getUser() == {} ||
      this.tokenStorage.getUser().id == null || this.tokenStorage.getUser().id < 0) {
      this.router.navigate(['login']);
    }
    else {
      this.deckData.getUserDict().then((userdata) => {
        this.user_dict = userdata;
        this.deckData.getAllDecks().then((deck_data) => {
          this.all_decks = deck_data;
          this.decks_formatted = [];
          this.all_decks.forEach((deck) => {
            this.decks_formatted.push(
              {
                deckId: deck.id,
                creatorName: this.user_dict[deck.creator],
                deckName: deck.friendly_name,
                commander: deck.partner_commander && deck.partner_commander !== '' ? deck.commander + ' & ' + deck.partner_commander: deck.commander
              }
            );
          });
        });
      });
    }
  }

  addPlayer(): void {
    if (this.temp_deck) {
      this.current_players.push(this.temp_deck);
      this.temp_deck = null;
    }
  }

  public removePlayer(idx: number) {
    this.current_players.splice(idx, 1);
  }

  public saveMatch() {
    let game: any = {};
    game.players = [];
    for (let player of this.current_players) {
      game.players.push({
        deckId: player.deckId,
        win: player.deckId == this.current_winner.deckId
      });
    }
    this.deckData.addGame(game).subscribe(() => {
      this.current_players = [];
      this.current_winner = null;
      location.reload();
    });
  }
}

