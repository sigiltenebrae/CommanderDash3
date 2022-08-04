import {Component, HostBinding} from '@angular/core';
import {OverlayContainer} from "@angular/cdk/overlay";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'CommanderDash3';

  isDark = false;

  constructor(public overlayContainer: OverlayContainer) {}

  toggleDarkTheme() {
    this.isDark = ! this.isDark;
  }

  @HostBinding('class') componentCssClass: any;

  onSetTheme(theme: any) {
    this.overlayContainer.getContainerElement().classList.add(theme);
    this.componentCssClass = theme;
    if (theme === 'dark-theme') {
      this.isDark = true;
    }
    else if (theme === 'light-theme') {
      this.isDark = false;
    }
  }
}
