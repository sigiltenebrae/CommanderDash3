import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";

import {ChartConfiguration} from "chart.js";
import * as Scry from "scryfall-sdk";

import {TokenStorageService} from "../../services/token-storage.service";
import {DeckDataService} from "../../services/deck-data.service";

@Component({
  selector: 'app-deck-stats',
  templateUrl: './deck-stats.component.html',
  styleUrls: ['./deck-stats.component.scss']
})


export class DeckStatsComponent implements OnInit {

  loading = false; //display the spinner while the page is loading
  private decks: any[] = []; //list of all decks for user
  theme = "light"; //theme type for chart fonts

  //Data for "Average Rating by Color" chart
  public ratingChartData: ChartConfiguration<'bar'>['data'] | undefined;
  public ratingChartLegend = false;
  public ratingChartPlugins = [];
  public ratingChartOptions: ChartConfiguration<'bar'>['options'];

  //Data for "Average Rating by Theme" chart
  public themeChartData: ChartConfiguration<'bar'>['data'] | undefined;
  public themeChartLegend = false;
  public themeChartPlugins = [];
  public themeChartOptions: ChartConfiguration<'bar'>['options'];

  //Data for "Deck Color Percentages" chart
  public colorCountChartLabels: string[] = [ 'W', 'U', 'B', 'R', 'G' ];
  public colorCountChartDatasets: ChartConfiguration<'doughnut'>['data']['datasets'] | undefined;
  public colorCountChartOptions: ChartConfiguration<'doughnut'>['options'];

  public counting_cards = false;
  public card_counts: any = {};
  public sorted_card_counts: any[] = [];
  public counted_decks = 0;
  public top_cards: any[] = [];

  constructor(private deckData: DeckDataService, private tokenStorage: TokenStorageService, private router: Router) { }

  async ngOnInit() {
    if (this.tokenStorage.getUser() == null || this.tokenStorage.getUser() == {} ||
      this.tokenStorage.getUser().id == null || this.tokenStorage.getUser().id < 0) {
      this.router.navigate(['login']);
    } else {
      this.theme = this.tokenStorage.getUser().theme;
      this.loading = true;
      this.deckData.getDecks().then((temp_decks: any) => {
        this.decks = temp_decks;
        this.loadRatingData();
        this.loadColorCountData();
        this.loadThemeData();
        this.loadCardData();
        this.loading = false;
      });

    }
  }

  /**
   * Load data for "Average Rating by Color" chart
   */
  public loadRatingData() {
    let w = 0; let u = 0; let b = 0; let r = 0; let g = 0;
    let w_play = 0; let u_play = 0; let b_play = 0; let r_play = 0; let g_play = 0;
    this.decks.forEach((deck) => {
      if (deck.active) {
        if (deck.colors) {
          if (deck.colors.includes('W')) { w_play += deck.play_rating; w++}
          if (deck.colors.includes('U')) { u_play += deck.play_rating; u++}
          if (deck.colors.includes('B')) { b_play += deck.play_rating; b++}
          if (deck.colors.includes('R')) { r_play += deck.play_rating; r++}
          if (deck.colors.includes('G')) { g_play += deck.play_rating; g++}
        }
      }
    });

    let w_play_data = w > 0 ? w_play / w : 0;
    let u_play_data = u > 0 ? u_play / u : 0;
    let b_play_data = b > 0 ? b_play / b : 0;
    let r_play_data = r > 0 ? r_play / r : 0;
    let g_play_data = g > 0 ? g_play / g : 0;

    let play_data = [ w_play_data, u_play_data, b_play_data, r_play_data, g_play_data ];
    this.ratingChartData = {
      labels: [ 'W', 'U', 'B', 'R', 'G' ],
      datasets: [
        {
          data: play_data,
          backgroundColor: [ //300
            '#eeeeeebb',
            '#64b5f6bb',
            '#9e9e9ebb',
            '#e57373bb',
            '#81c784bb'
          ],
          borderColor: [ //400
            '#e0e0e0bb',
            '#42a5f5bb',
            '#757575bb',
            '#ef5350bb',
            '#66bb6abb'
          ],
          hoverBackgroundColor: [ //500
            '#bdbdbdbb',
            '#2196f3bb',
            '#616161bb',
            '#f44336bb',
            '#4caf50bb'
          ],
          hoverBorderColor: [ //600
            '#9e9e9ebb',
            '#1e88e5bb',
            '#424242bb',
            '#e53935bb',
            '#43a047bb'
          ],
          borderWidth: 1,
          label: 'Fun to Play' }
      ]
    };
    this.ratingChartOptions = {
      responsive: false,
      plugins: {
        title: {
          display: true,
          text: 'Average Rating By Color',
          color: this.theme === "light" ? 'rgb(100, 100, 100)':  'rgb(198, 198, 198)'
        },
        legend: {
          labels: {
            color: this.theme === "light" ? 'rgb(100, 100, 100)': 'rgb(198, 198, 198)'
          }
        },

      },
      scales: {
        y: {
          ticks: {
            color: this.theme === "light" ? 'rgb(100, 100, 100)': 'rgb(198, 198, 198)'
          }
        },
        x: {
          ticks: {
            color: this.theme === "light" ? 'rgb(100, 100, 100)': 'rgb(198, 198, 198)'
          }
        }
      }
    };

  }

  /**
   * Load data for "Deck Color Percentages" chart
   */
  public loadColorCountData() {
    let w = 0; let u = 0; let b = 0; let r = 0; let g = 0; let total = 0;
    this.decks.forEach((deck) => {
      if (deck.active) {
        if (deck.colors) {
          if (deck.colors.includes('W')) { w++; }
          if (deck.colors.includes('U')) { u++; }
          if (deck.colors.includes('B')) { b++; }
          if (deck.colors.includes('R')) { r++; }
          if (deck.colors.includes('G')) { g++; }
          total++;
        }
      }
    });
    this.colorCountChartOptions = {
      responsive: false,
      plugins: {
        title: {
          display: true,
          text: 'Deck Color Percentages',
          color: this.theme === "light" ? 'rgb(100, 100, 100)':  'rgb(198, 198, 198)'
        }
      }
    };
    this.colorCountChartDatasets = [{
      data: [ w/total, u/total, b/total, r/total, g/total ],
      backgroundColor: [ //300
        '#eeeeeebb',
        '#64b5f6bb',
        '#9e9e9ebb',
        '#e57373bb',
        '#81c784bb'
      ],
      borderColor: [ //400
        '#e0e0e0bb',
        '#42a5f5bb',
        '#757575bb',
        '#ef5350bb',
        '#66bb6abb'
      ],
      hoverBackgroundColor: [ //500
        '#bdbdbdbb',
        '#2196f3bb',
        '#616161bb',
        '#f44336bb',
        '#4caf50bb'
      ],
      hoverBorderColor: [ //600
        '#9e9e9ebb',
        '#1e88e5bb',
        '#424242bb',
        '#e53935bb',
        '#43a047bb'
      ],
      borderWidth: 1,
      label: 'Series A'
    }];
  }
  /**
   * Load data for "Average Rating by Theme" chart
   */
  public loadThemeData() {
    let themeDict: any = {};
    this.decks.forEach((deck) => {
      if (deck.active) {
        if (deck.themes) {
          deck.themes.forEach((theme: any) => {
            if (themeDict[theme.name] != null) {
              themeDict[theme.name].rating += (deck.play_rating / 5);
              themeDict[theme.name].count ++;
            }
            else {
              themeDict[theme.name] = { rating: (deck.play_rating / 5), count: 1 };
            }
          });
        }
      }
    });
    let theme_data: any[] = [];
    let theme_labels: any[] = [];
    Object.keys(themeDict).forEach((theme_name) => {
      theme_labels.push(theme_name);
      theme_data.push(themeDict[theme_name].rating / themeDict[theme_name].count);
    });
    this.themeChartData = {
      labels: theme_labels,
      datasets: [
        {
          data: theme_data,
          backgroundColor: [ //300
            '#eeeeeebb',
            '#64b5f6bb',
            '#9e9e9ebb',
            '#e57373bb',
            '#81c784bb'
          ],
          borderColor: [ //400
            '#e0e0e0bb',
            '#42a5f5bb',
            '#757575bb',
            '#ef5350bb',
            '#66bb6abb'
          ],
          hoverBackgroundColor: [ //500
            '#bdbdbdbb',
            '#2196f3bb',
            '#616161bb',
            '#f44336bb',
            '#4caf50bb'
          ],
          hoverBorderColor: [ //600
            '#9e9e9ebb',
            '#1e88e5bb',
            '#424242bb',
            '#e53935bb',
            '#43a047bb'
          ],
          borderWidth: 1,
          label: 'Average Rating' }
      ]
    };
    this.themeChartOptions = {
      responsive: false,
      plugins: {
        title: {
          display: true,
          text: 'Average Rating by Theme',
          color: this.theme === "light" ? 'rgb(100, 100, 100)':  'rgb(198, 198, 198)'
        },
        legend: {
          labels: {
            color: this.theme === "light" ? 'rgb(100, 100, 100)': 'rgb(198, 198, 198)'
          }
        },

      },
      scales: {
        y: {
          ticks: {
            color: this.theme === "light" ? 'rgb(100, 100, 100)': 'rgb(198, 198, 198)'
          }
        },
        x: {
          ticks: {
            color: this.theme === "light" ? 'rgb(100, 100, 100)': 'rgb(198, 198, 198)'
          }
        }
      }
    };
  }

  public loadCardData() {
    this.counting_cards = true;
    let card_promises: any[] = [];
    this.decks.forEach((deck: any) => {
      card_promises.push(this.deckData.getDeckCardCount(deck));
    });
    Promise.all(card_promises).then(async () => {
      this.decks.forEach((deck: any) => {
        if (deck.cards.length > 0) {
          this.counted_decks++;
          deck.cards.forEach((card: any) => {
            if (this.card_counts[card]) {
              this.card_counts[card]++;
            } else {
              this.card_counts[card] = 1;
            }
          });
        }
      });
      for (let card of Object.keys(this.card_counts)) {
        this.sorted_card_counts.push({
          card: card,
          count: this.card_counts[card]
        });
      }
      this.sorted_card_counts.sort((a: any, b: any) => (a.count > b.count) ? -1 : 1);
      this.counting_cards = false;
      for (let i = 0; i < 10; i++) {
        if (i == this.sorted_card_counts.length) {
          break;
        }
        let cur = await Scry.Cards.byName(this.sorted_card_counts[i].card);
        let cur_prints = await cur.getPrints();
        let image: string | undefined = '';
        let image_back: string | undefined = '';
        if (cur_prints) {
          if (cur_prints[0].card_faces && cur_prints[0].card_faces.length > 1) {
            image = cur_prints[0].card_faces[0].image_uris?.png;
            image_back = cur_prints[0].card_faces[1].image_uris?.png;
          } else {
            image = cur_prints[0].image_uris?.png;
          }
        }
        this.top_cards.push({
            card: this.sorted_card_counts[i].card,
            percent: this.sorted_card_counts[i].count / this.counted_decks,
            image: image,
            image_back: image_back
          });
      }
    });
  }
}
