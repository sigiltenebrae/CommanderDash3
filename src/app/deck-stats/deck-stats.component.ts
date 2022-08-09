import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";

import {ChartConfiguration} from "chart.js";

import {TokenStorageService} from "../../services/token-storage.service";
import {DeckDataService} from "../../services/deck-data.service";

@Component({
  selector: 'app-deck-stats',
  templateUrl: './deck-stats.component.html',
  styleUrls: ['./deck-stats.component.scss']
})


export class DeckStatsComponent implements OnInit {

  loading = false;
  decks: any[] = [];
  theme = "light";

  public ratingChartData: ChartConfiguration<'bar'>['data'] | undefined;
  public ratingChartLegend = false;
  public ratingChartPlugins = [];
  public ratingChartOptions: ChartConfiguration<'bar'>['options'];

  public themeChartData: ChartConfiguration<'bar'>['data'] | undefined;
  public themeChartLegend = false;
  public themeChartPlugins = [];
  public themeChartOptions: ChartConfiguration<'bar'>['options'];

  public colorCountChartLabels: string[] = [ 'W', 'U', 'B', 'R', 'G' ];
  public colorCountChartDatasets: ChartConfiguration<'doughnut'>['data']['datasets'] | undefined;
  public colorCountChartOptions: ChartConfiguration<'doughnut'>['options'];

  constructor(private deckData: DeckDataService, private tokenStorage: TokenStorageService, private router: Router) { }

  ngOnInit(): void {
    if (this.tokenStorage.getUser() == null || this.tokenStorage.getUser() == {} ||
      this.tokenStorage.getUser().id == null || this.tokenStorage.getUser().id < 0) {
      this.router.navigate(['login']);
    }
    else {
      this.theme = this.tokenStorage.getUser().theme;
      this.loading = true;
      this.deckData.getDecks().then(
        (temp) => {
          this.decks = temp;
          this.loadRatingData();
          this.loadColorCountData();
          this.loadThemeData();
          this.loading = false;
        });
    }
  }

  loadRatingData() {
    let w = 0; let u = 0; let b = 0; let r = 0; let g = 0;
    let w_play = 0; let u_play = 0; let b_play = 0; let r_play = 0; let g_play = 0;
    this.decks.forEach((deck) => {
      if (deck.active) {
        if (deck.colors.includes('W')) { w_play += deck.play_rating; w++}
        if (deck.colors.includes('U')) { u_play += deck.play_rating; u++}
        if (deck.colors.includes('B')) { b_play += deck.play_rating; b++}
        if (deck.colors.includes('R')) { r_play += deck.play_rating; r++}
        if (deck.colors.includes('G')) { g_play += deck.play_rating; g++}
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
  loadColorCountData() {
    let w = 0; let u = 0; let b = 0; let r = 0; let g = 0; let total = 0;
    this.decks.forEach((deck) => {
      if (deck.active) {
        if (deck.colors.includes('W')) { w++; }
        if (deck.colors.includes('U')) { u++; }
        if (deck.colors.includes('B')) { b++; }
        if (deck.colors.includes('R')) { r++; }
        if (deck.colors.includes('G')) { g++; }
        total++;
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
  loadThemeData() {
    let themeDict: any = {};
    this.decks.forEach((deck) => {
      if (deck.active) {
        deck.themes.forEach((theme: any) => {
          console.log(theme);
          if (themeDict[theme.name] != null) {
            themeDict[theme.name].rating += (deck.play_rating / 5);
            themeDict[theme.name].count ++;
          }
          else {
            themeDict[theme.name] = { rating: (deck.play_rating / 5), count: 1 };
          }
        });
      }
      console.log(JSON.stringify(themeDict));
    });
    let theme_data: any[] = [];
    let theme_labels: any[] = [];
    Object.keys(themeDict).forEach((theme_name) => {
      theme_labels.push(theme_name);
      theme_data.push(themeDict[theme_name].rating / themeDict[theme_name].count);
    });
    console.log(theme_labels);
    console.log(theme_data);
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
}
