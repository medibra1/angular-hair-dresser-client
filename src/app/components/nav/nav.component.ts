import { Component, HostListener, Input, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { GlobalService } from '../../services/global/global.service';
import { CommonModule } from '@angular/common';
import { animate, style, transition, trigger } from '@angular/animations';
import { CartService } from '../../services/cart/cart.service';
import { ISetting } from '../../models/seeting';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [RouterModule,CommonModule],
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

  activeSection: string;
  displaySubNav = false;
  navigationSub: Subscription;
  cartItemCount: number = 0;
  settingsSub: Subscription;

  async ngOnInit() {
    console.log('NAV: ');
  
    document.addEventListener('click', this.onDocumentClick);

    this.navigationSub = this.global.activeSection$.subscribe({
      next: sectionId => {
        console.log('Section ID ', sectionId);
        this.activeSection = sectionId;
      }
    });

    this.cartService.getCartItemsCount().subscribe(count => {
      this.cartItemCount = count;
    });
    
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
    
    ngOnDestroy(): void {
      if (this.navigationSub) {
        this.navigationSub.unsubscribe();
      }
      document.removeEventListener('click', this.onDocumentClick);
    }
    
}
