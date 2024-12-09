import { Component, inject } from '@angular/core';
import { IProduct } from '../../models/product';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart/cart.service';
import { NavigationExtras, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SettingsService } from '../../services/settings/settings.service';
import { filter, Subscription, take } from 'rxjs';
import { EncryptionService } from '../../services/encryption/encryption.service';
import { VerifyEmailComponent } from '../../components/verify-email/verify-email.component';
import { AlertComponent } from "../../components/alert/alert.component";
import { User } from '../../models/user.model';
import { ProfileService } from '../../services/profile/profile.service';
import { ToastService } from '../../services/toast/toast.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, VerifyEmailComponent, AlertComponent],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
})
export class CartComponent {
  cartItems: IProduct[] = [];
  totalPrice: number = 0;

  private cartService = inject(CartService);
  deliveryCharge = 0;

  private settingsService = inject(SettingsService);
  private router = inject(Router);
  private encryptionService = inject(EncryptionService);
  private profileService = inject(ProfileService);
  private toastService = inject(ToastService);

  successMessage = '';
  errorMessage: string[] = [];

  profileSub: Subscription;
  profile: User;
  displayVerifyEmailModal = false;
  navFromSignup = false;

  constructor() {
    const navigation = this.router.getCurrentNavigation();
    console.log('Navigation form : ', navigation?.extras?.state?.['from']);
    if (navigation?.extras?.state?.['from'] === 'signup') {
      // this.displayVerifyEmailModal = true;
      this.navFromSignup = true;
    }

  }

  async ngOnInit() {
    await this.settingsService.loadSettings();
    this.getSettings();
    this.loadCart();
    this.getrofile();
    if(this.navFromSignup) this.displayVerifyEmailModal = true;
  }

  loadCart() {
    this.cartItems = this.cartService.getCartItems();
    this.calculateTotalPrice();
  }

  getrofile() {
    // await this.profileService.getProfile();
    this.profileSub = this.profileService.profile.subscribe({
      next: (profile) => {
        this.profile = profile;
        console.log('profile data cart - component: ', this.profile);
        if(this.profile && !this.profile?.email_verified) {
          this.errorMessage = ['Your email address is not verified.'];
        }
      },
    });
  }

  closeVerifyEmailModal() {
    this.displayVerifyEmailModal = false;
  }

  getSettings() {
    this.settingsService.settings$
      .pipe(
        filter((settings) => Object.keys(settings).length > 0), // Filtrer les objets non vides
        take(1)
      )
      .subscribe({
        next: (settings) => {
          this.deliveryCharge = +settings.delivery_charge;
          console.log('cart Settings del char: ', this.deliveryCharge);
          console.log('TYPE OF DELIVERY CHARGE: ', typeof this.deliveryCharge);
        },
      });
  }

  calculateTotalPrice(): void {
    // this.totalPrice = this.cartItems.reduce((total, item) => {
    //   const price = item.promo_price ? item.promo_price : item.price;
    //   return total + (price * item.quantity);
    // }, 0);
    const totalPrice = this.cartItems.reduce((total, item) => {
      const price = item.promo_price ? item.promo_price : item.price;
      return total + price * item.quantity;
    }, 0);
    console.log('DElivery charge before calculate: ', this.deliveryCharge);
    this.totalPrice = totalPrice + this.deliveryCharge;
  }

  incrementQuantity(item: IProduct): void {
    if (item.quantity < item.stock) {
      item.quantity++;
      this.updateCart();
    }
  }

  decrementQuantity(item: IProduct): void {
    if (item.quantity > 1) {
      item.quantity--;
      this.updateCart();
    }
  }

  removeItem(product: IProduct): void {
    this.cartService.removeFromCart(product);
    this.loadCart();
  }

  updateCart(): void {
    this.cartService.updateCart(this.cartItems);
    this.calculateTotalPrice();
  }

  clearCart(): void {
    this.cartService.clearCart();
    this.loadCart();
  }

  proceedToCheckout(): void {

    if(this.profile && !this.profile?.email_verified) {
      this.showToast('Please verify your email address before continuing.', 'error');
      return;
    }

    let navData: NavigationExtras;
    let description = '';
    this.cartItems.forEach((item) => {
      description += `${item.name}`;
      // Conditionally add selected_model if it exists
      if (item.selected_model) {
        description += ` ${item.selected_model}`;
      }
      // Conditionally add selected_color if it exists
      if (item.selected_color) {
        description += `, ${item.selected_color}`;
      }
      // Add a separator if there are multiple items
      description += ' | ';
    });
    // Remove the last separator
    description = description.trim().slice(0, -1);

    const data = {
      amount: this.totalPrice,
      description: description,
    };
    const encryptedData = this.encryptionService.encrypt(data);
    navData = {
      queryParams: {
        data: encryptedData,
        // data: btoa(JSON.stringify(data)),
      },
    };
    this.router.navigate(['/checkout'], navData);
    // this.router.navigateByUrl('/checkout', { state: data });
  }

  showToast(msg, type, duration = 5000) {
    this.toastService.showToast({
      message: msg,
      type: type,
      duration: duration,
      position: 'top',
    });
  }

  ngOnDestroy() {
    if (this.profileSub) this.profileSub.unsubscribe();
  }

}
