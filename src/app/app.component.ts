import {Component, HostBinding, OnInit} from '@angular/core';
import {OverlayContainer} from "@angular/cdk/overlay";
import { TokenStorageService } from "../services/token-storage.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'CommanderDash3';

  isDark = true;

  constructor(public overlayContainer: OverlayContainer, private tokenStorage: TokenStorageService, private router: Router) {}

  ngOnInit(): void {
    this.onSetTheme('dark-theme');
  }

  signOut():void {
    this.tokenStorage.signOut();
    this.router.navigate(['login']);
  }

  toggleDarkTheme() {
    if (this.isDark) {
      this.onSetTheme('light-theme');
      this.isDark = false;
    }
    else {
      this.onSetTheme('dark-theme');
      this.isDark = true;
    }
  }

  @HostBinding('class') componentCssClass: any;

  onSetTheme(theme: any) {
    this.overlayContainer.getContainerElement().classList.add(theme);
    this.componentCssClass = theme;
  }
}
