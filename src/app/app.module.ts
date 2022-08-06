import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { OverlayModule} from '@angular/cdk/overlay';
import { FlexLayoutModule } from "@angular/flex-layout";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from "@angular/forms";
import { ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { RouterModule } from "@angular/router";

import { MatSidenavModule } from "@angular/material/sidenav";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatListModule } from "@angular/material/list";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatSliderModule } from "@angular/material/slider";
import { MatGridListModule } from "@angular/material/grid-list";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatCardModule } from "@angular/material/card";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatButtonModule } from "@angular/material/button";
import { MatChipsModule } from "@angular/material/chips";
import { MatRippleModule } from "@angular/material/core";
import {MatInputModule} from "@angular/material/input";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";

import { AppComponent } from './app.component';
import { DeckListComponent } from './deck-list/deck-list.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ProfileComponent } from './profile/profile.component';
import { DeckEditComponent } from './deck-edit/deck-edit.component';
import { DeckStatsComponent } from './deck-stats/deck-stats.component';




@NgModule({
  declarations: [
    AppComponent,
    DeckListComponent,
    LoginComponent,
    RegisterComponent,
    ProfileComponent,
    DeckEditComponent,
    DeckStatsComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    OverlayModule,
    FlexLayoutModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule.forRoot([
      {path: '', redirectTo: 'decks', pathMatch: 'full'},

      {path: 'register', component: RegisterComponent},
      {path: 'login', component: LoginComponent},
      {path: 'profile', component: ProfileComponent},

      {path: 'decks', component: DeckListComponent},
      {path: 'decks/:deckId', component: DeckEditComponent},

    ], {useHash: true}),
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatIconModule,
    MatButtonToggleModule,
    MatSliderModule,
    MatGridListModule,
    MatSlideToggleModule,
    MatCardModule,
    MatExpansionModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatButtonModule,
    MatChipsModule,
    MatRippleModule,
    MatInputModule,
    MatProgressSpinnerModule
  ],
  exports: [RouterModule],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
