import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";

import {DeckDataService} from "../../services/deck-data.service";
import {TokenStorageService} from "../../services/token-storage.service";

@Component({
  selector: 'app-deck-bans',
  templateUrl: './deck-bans.component.html',
  styleUrls: ['./deck-bans.component.scss']
})
export class DeckBansComponent implements OnInit {

  public loading = false; //display spinner while page is loading
  public ban_type_dict: any = {}; //dictionary of ban types by key of id
  public all_bans_sorted: any = {}; //the ban list

  constructor(private deckData: DeckDataService, private tokenStorage: TokenStorageService, private router: Router) { }

  ngOnInit(): void {
    if (this.tokenStorage.getUser() == null || this.tokenStorage.getUser() == {} ||
      this.tokenStorage.getUser().id == null || this.tokenStorage.getUser().id < 0) {
      this.router.navigate(['login']);
    }
    else {
      this.loading = true;
      this.deckData.getBanDict().then((ban_type_data) => {
        this.ban_type_dict = ban_type_data;
        this.deckData.getBanList().then((ban_data) => {
          let ban_list_data: any = ban_data;
          console.log(ban_list_data);
          let ban_list_sorted = [];
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
          console.log(this.all_bans_sorted);
          this.loading = false;
        });
      })
    }
  }

}
