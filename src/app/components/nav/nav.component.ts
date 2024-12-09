import { Component, HostListener, Input, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { GlobalService } from '../../services/global/global.service';
import { CommonModule } from '@angular/common';
import { animate, style, transition, trigger } from '@angular/animations';
import { CartService } from '../../services/cart/cart.service';
import { ISetting } from '../../models/seeting';
import { ProfileService } from '../../services/profile/profile.service';
import { AuthService } from '../../services/auth/auth.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css',
  animations: [
    trigger('slideDownUp', [
      transition(':enter', [
        style({ 'max-height': '0', opacity: 0 }),
        animate('200ms ease-in', style({ 'max-height': '200px', opacity: 1 })),
      ]),
      transition(':leave', [
        style({ 'max-height': '200px', opacity: 1 }),
        animate('200ms ease-in', style({ 'max-height': 0, opacity: 0 })),
      ]),
    ]),
  ],
})
export class NavComponent {
  isActive = false;

  @Input() settings: ISetting;

  private global = inject(GlobalService);
  private cartService = inject(CartService);
  private router = inject(Router);
  private profileService = inject(ProfileService);
  private authService = inject(AuthService);

  activeSection: string;
  displaySubNav = false;
  navigationSub: Subscription;
  cartItemCount: number = 0;
  
  profile = {} as User;
  profileSub: Subscription;

  async ngOnInit() {
    console.log('NAV: ');

    document.addEventListener('click', this.onDocumentClick);

    this.navigationSub = this.global.activeSection$.subscribe({
      next: (sectionId) => {
        console.log('Section ID ', sectionId);
        this.activeSection = sectionId;
      },
    });

    this.cartService.getCartItemsCount().subscribe((count) => {
      this.cartItemCount = count;
    });


    // if(this.authService.isAuthenticated()) {
      this.getProfile();
      this.profileSub = this.profileService.profile.subscribe({
        next: profile => {
          this.profile = profile;
          console.log('Profile data nav component: ', this.profile);
        }
      });
    // }

  }

  async getProfile() {
    await this.profileService.getProfile()
  }

  isCheckoutOrCart(): boolean {
    // return this.router.url === '/cart' || this.router.url === '/checkout';
    const baseUrl = this.router.url.split('?')[0]; // Ignore query parameters
    return baseUrl === '/cart' || baseUrl === '/checkout';
  }

  toggleMenu() {
    this.isActive = !this.isActive;
    console.log('Toggle: ', this.isActive);
  }

  toggleDisplaySubNav(event: MouseEvent): void {
    this.displaySubNav = !this.displaySubNav;
    event.stopPropagation(); // Empêche le clic de se propager au document
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const targetElement = event.target as HTMLElement;
    if (!targetElement.closest('.relative')) {
      this.displaySubNav = false;
    }
  }

  scrollToSection(section: string) {
    // this.router.navigate(['home'], {
    //   fragment: section,
    // });
    document.getElementById(section)?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
      inline: 'nearest',
    });
  }

  ngOnDestroy() {
    if(this.profileSub) this.profileSub.unsubscribe();
    if (this.navigationSub) {
      this.navigationSub.unsubscribe();
    }
    document.removeEventListener('click', this.onDocumentClick);
  }

}
