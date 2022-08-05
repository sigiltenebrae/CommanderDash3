import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { OverlayModule} from '@angular/cdk/overlay';
import { FlexLayoutModule } from "@angular/flex-layout";

import { AppComponent } from './app.component';
import { RouterModule } from "@angular/router";
import { DeckListComponent } from './deck-list/deck-list.component';
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatListModule} from "@angular/material/list";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonToggleModule} from "@angular/material/button-toggle";
import {MatSliderModule} from "@angular/material/slider";
import {MatGridListModule} from "@angular/material/grid-list";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {ReactiveFormsModule} from "@angular/forms";
import {MatCardModule} from "@angular/material/card";
import {MatExpansionModule} from "@angular/material/expansion";
import {MatCheckboxModule} from "@angular/material/checkbox";
import { MatFormFieldModule } from "@angular/material/form-field";
import {MatButtonModule} from "@angular/material/button";
import {MatChipsModule} from "@angular/material/chips";
import {MatRippleModule} from "@angular/material/core";


@NgModule({
  declarations: [
    AppComponent,
    DeckListComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    OverlayModule,
    FlexLayoutModule,
    RouterModule.forRoot([
      {path: '', redirectTo: 'decks', pathMatch: 'full'},
      {path: 'decks', component: DeckListComponent}
    ]),
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatIconModule,
    MatButtonToggleModule,
    MatSliderModule,
    MatGridListModule,
    NgbModule,
    MatSlideToggleModule,
    ReactiveFormsModule,
    MatCardModule,
    MatExpansionModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatButtonModule,
    MatChipsModule,
    MatRippleModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
