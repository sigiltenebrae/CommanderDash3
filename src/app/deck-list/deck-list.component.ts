import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-deck-list',
  templateUrl: './deck-list.component.html',
  styleUrls: ['./deck-list.component.scss']
})
export class DeckListComponent implements OnInit {

  hovered = false;
  edit_hovered = false;

  constructor() { }

  ngOnInit(): void {
  }

}
