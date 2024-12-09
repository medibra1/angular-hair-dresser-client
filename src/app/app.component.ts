import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { NavComponent } from './components/nav/nav.component';
import { FooterComponent } from './components/footer/footer.component';
import { GlobalService } from './services/global/global.service';
import { Subscription, take } from 'rxjs';
import { HeroComponent } from './components/hero/hero.component';
import { ISetting } from './models/seeting';
import { SettingsService } from './services/settings/settings.service';
import { LoaderComponent } from './components/loader/loader.component';
import { CommonModule } from '@angular/common';
import { ToastComponent } from './components/toast/toast.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavComponent, FooterComponent, HeroComponent, LoaderComponent, ToastComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {

  settingsLoaded = false;
  settings: ISetting  = {} as ISetting;

  private settingsService = inject(SettingsService);
  private global = inject(GlobalService);
  private router = inject(Router);
  private routerSub: Subscription;

  showHero: boolean = true; 

  async ngOnInit() {

    // this.router.events.subscribe((event) => { // define data showHero in app routes
    //   if (event instanceof NavigationEnd) {
    //     const currentRoute = this.router.routerState.root.firstChild;
    //     this.showHero = currentRoute?.snapshot.data['showHero'] ?? true;
    //   }
    // });

     // Update `showHero` based on current route
    this.routerSub = this.router.events.subscribe(() => {
      const showRoutes = ['/home']; // Routes to show hero
      this.showHero = showRoutes.includes(this.router.url.split('?')[0]);
    });

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

  ngOnDestroy() {
    if(this.routerSub) this.routerSub.unsubscribe();
  }

}
