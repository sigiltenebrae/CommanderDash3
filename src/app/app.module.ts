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

import { NgChartsModule } from 'ng2-charts';

import { AppComponent } from './app.component';
import { DeckListComponent } from './deck-list/deck-list.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ProfileComponent } from './profile/profile.component';
import { DeckEditComponent } from './deck-edit/deck-edit.component';
import { DeckStatsComponent } from './deck-stats/deck-stats.component';
import { DeckRecsComponent } from './deck-recs/deck-recs.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { DeckAllComponent } from './deck-all/deck-all.component';
import { DeckBansComponent } from './deck-bans/deck-bans.component';





@NgModule({
  declarations: [
    AppComponent,
    DeckListComponent,
    LoginComponent,
    RegisterComponent,
    ProfileComponent,
    DeckEditComponent,
    DeckStatsComponent,
    DeckRecsComponent,
    ChangePasswordComponent,
    DeckAllComponent,
    DeckBansComponent,
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
      {path: 'change_password', component: ChangePasswordComponent},
      {path: 'profile', component: ProfileComponent},

      {path: 'decks/all', component: DeckAllComponent},
      {path: 'decks', component: DeckListComponent},
      {path: 'decks/:deckId', component: DeckEditComponent},

      {path: 'bans', component: DeckBansComponent},
      {path: 'stats', component: DeckStatsComponent},
      {path: 'recs', component: DeckRecsComponent}

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
    MatProgressSpinnerModule,
    NgChartsModule
  ],
  exports: [RouterModule],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
