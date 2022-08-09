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

  public isDark = false; //Theme to use
  public loggedIn = false; //Is a user logged in

  constructor(public overlayContainer: OverlayContainer, private tokenStorage: TokenStorageService, private router: Router) {}

  ngOnInit(): void {
    this.loggedIn = !(this.tokenStorage.getUser() == null || this.tokenStorage.getUser() == {} ||
      this.tokenStorage.getUser().id == null || this.tokenStorage.getUser().id < 0);
    if (this.tokenStorage.getUser().theme === "light") {
      this.onSetTheme('light-theme');
    }
    else {
      this.onSetTheme('dark-theme');
      this.isDark = true;
    }
  }

  /**
   * Signs the current user out
   */
  public signOut():void {
    this.tokenStorage.signOut();
    this.loggedIn = false;
    this.router.navigate(['login']);
  }

  /**
   * Switches the theme between light and dark
   */
  public toggleDarkTheme() {
    if (this.isDark) {
      this.onSetTheme('light-theme');
      this.isDark = false;
      let tempUser: any = this.tokenStorage.getUser();
      tempUser.theme = "light";
      this.tokenStorage.saveUser(tempUser);
    }
    else {
      this.onSetTheme('dark-theme');
      this.isDark = true;
      let tempUser: any = this.tokenStorage.getUser();
      tempUser.theme = "dark";
      this.tokenStorage.saveUser(tempUser);
    }
  }

  @HostBinding('class') componentCssClass: any;

  /**
   * Applies the given theme to the page, used to switch between light and dark
   * @param theme theme to apply
   */
  private onSetTheme(theme: any) {
    this.overlayContainer.getContainerElement().classList.add(theme);
    this.componentCssClass = theme;
  }
}
