import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavComponent } from './components/nav/nav.component';
import { FooterComponent } from './components/footer/footer.component';
import { GlobalService } from './services/global/global.service';
import { take } from 'rxjs';
import { HeroComponent } from './components/hero/hero.component';
import { ISetting } from './models/seeting';
import { SettingsService } from './services/settings/settings.service';
import { LoaderComponent } from './components/loader/loader.component';
import { IResponse } from './models/Response';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavComponent, FooterComponent, HeroComponent, LoaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {

  settingsLoaded = false;
  settings: ISetting  = {} as ISetting;

  private settingsService = inject(SettingsService);
  private global = inject(GlobalService);

  async ngOnInit() {

    await this.settingsService.loadSettings();
    this.settingsService.settings$
    .pipe(take(1))
    .subscribe({
      next: settings => {
        this.settings = settings;
        this.settings = {...this.settings, logo: this.imageUrl(this.settings.logo)}
        console.log('App Comp Settings: ', this.settings);
        this.settingsLoaded = true;
      }
    });

    this.global.loadServices();

  }

  imageUrl(img) {
    return this.global.downloadImage('image-container', img);
  }

}
