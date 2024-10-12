import { Component, inject } from '@angular/core';
import { GlobalService } from '../../services/global/global.service';
import { Subscription, filter, take } from 'rxjs';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ISetting } from '../../models/seeting';
import { CommonModule, DatePipe } from '@angular/common';
import { SettingsService } from '../../services/settings/settings.service';
import { SocialMediaComponent } from '../../components/social-media/social-media.component';
import { Router } from '@angular/router';
import { AppointmentFormComponent } from '../../components/appointment-form/appointment-form.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, SocialMediaComponent, AppointmentFormComponent],
  providers: [DatePipe],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  activeSection: string;
  private observer: IntersectionObserver;
  private global = inject(GlobalService);
  private settingsService = inject(SettingsService);
  private sanitizer = inject(DomSanitizer);
  private router = inject(Router);
  settings: ISetting = {} as ISetting;
  // settingsSub: Subscription;
  servicesSub: Subscription;
  services: any = [];
  lowestPrice: number | null = null;

  safeMapUrl: SafeResourceUrl | null = null;

  // socialMedia: any = {}

  barbers: any = [];
  barberSub: Subscription;
  private datePipe = inject(DatePipe);

  ngOnInit() {
    console.log('CURENNT ROUTE: ', this.router.url);

    this.getSettings();
    this.getServices();
    this.getBarbers();
  
    window.scrollTo(0,0);
    
    const sections = document.querySelectorAll('section');

    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.5 // 50% of the section is visible
    };

    this.observer = new IntersectionObserver(this.observerCallback.bind(this), observerOptions);

    sections.forEach(section => this.observer.observe(section));

  }

  isObjectExist(obj: any): boolean {
    console.log('Is Object Empty: ', obj);
    return Object.keys(obj).length > 0;
  }

    getSettings() {
    // this.settingsSub = this.settingsService.settings$
    this.settingsService.settings$
    .pipe(
      filter(settings => Object.keys(settings).length > 0), // Filtrer les objets non vides
      take(1))
    .subscribe({
      next: settings => {
        this.settings = settings;
        console.log('Home Settings: ', this.settings);
        if (this.settings.map || !this.safeMapUrl) {
          this.safeMapUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.settings.map);
          console.log('Safe map Url: ', this.safeMapUrl);
          console.log('Type of opening time: '+ this.settings.opening_time+' '+ typeof(this.settings.opening_time));
        }
      }
    });

    // this.socialMedia = {
    //   fabebook: this.settings.facebook,
    //   whatsapp: this.settings.whatsapp,
    //   tiktok: this.settings.tiktok,
    //   youtube: this.settings.youtube,
    //   instagram: this.settings.instagram,
    // }
    // console.log('Social media: ', this.settings);

  }

  formatTime(time: string): string {
    // Convert "10:00:00" to a Date object assuming it's today
    const [hours, minutes, seconds] = time.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, seconds);
    return this.datePipe.transform(date, 'h a')!;
  }

  getServices() {
    this.servicesSub = this.global.services$
     // .pipe(
    //   filter(services => Object.keys(services).length > 0), // Filtrer les objets non vides
    //   take(1))
    .subscribe( services => {
      this.services = services;
      // this.services = services.map(service => {
      //   service.image = service.image ? this.imageUrl(service.image): '';
      //   return service;
      // });
      console.log('Home services: ', this.services);
      this.lowestPrice = this.findLowestPrice(this.services);
      console.log('LowestPrice: ', this.lowestPrice);
    });
    // this.global.loadServices();
  }

  // imageUrl(img) {
  //   return this.global.downloadImage('services', img);
  // }

  getBarbers() {
    this.global.loadBarbers();
    this.barberSub =  this.global.barbers$
    .subscribe( barbers => {
      this.barbers = barbers;
      console.log('Barbers: ', this.barbers);
    });
  }

  findLowestPrice(services: any[]): number {
    return services.reduce((lowestPrice, service) => {
      const minPrice = Math.min(service.price || Infinity, service.promo_price || Infinity);
      return Math.min(lowestPrice, minPrice);
    }, Infinity);
  }
  

  observerCallback(entries: IntersectionObserverEntry[], observer: IntersectionObserver) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        this.activeSection = entry.target.id;
        this.global.setActiveSection(entry.target.id); 
      } else if (this.activeSection === entry.target.id) {
        this.activeSection = '';
      }
    });
  }

  ngOnDestroy(): void {
    if (this.observer) this.observer.disconnect(); 
    // if (this.settingsSub) this.settingsSub.unsubscribe(); 
    if (this.servicesSub) this.servicesSub.unsubscribe(); 
    if (this.barberSub) this.barberSub.unsubscribe(); 
  }

}
