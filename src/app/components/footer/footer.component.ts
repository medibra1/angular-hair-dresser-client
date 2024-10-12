import { Component, Input, inject } from '@angular/core';
import { GlobalService } from '../../services/global/global.service';
import { ISetting } from '../../models/seeting';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { SocialMediaComponent } from '../social-media/social-media.component';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, SocialMediaComponent],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css',
})
export class FooterComponent {
  
  @Input() settings: ISetting = {} as ISetting;

  currentYear = new Date().getFullYear();

  private global = inject(GlobalService);
  services: any = [];
  servicesSub: Subscription;

  ngOnInit() {
    console.log('Footer:');
    this.getServices();
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  getServices() {
    this.servicesSub =  this.global.services$
    .subscribe( services => {
      this.services = services;
      console.log('Footer services: ', this.services);
    });
    // this.global.loadServices();
  }

  getServiceNames(): string {
    return this.services
      // .filter(service => service.type == 1)
      .map(service => service.name)
      .join(', ');
  }

  
  ngOnDestroy(): void {
    if (this.servicesSub) this.servicesSub.unsubscribe(); 
  }


}
