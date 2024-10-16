import { Component, inject } from '@angular/core';
import { IProduct } from '../../models/product';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart/cart.service';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SettingsService } from '../../services/settings/settings.service';
import { filter, take } from 'rxjs';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent {

  cartItems: IProduct[] = [];
  totalPrice: number = 0;

  private cartService = inject(CartService);
  deliveryCharge = 0;

  private settingsService = inject(SettingsService);

  constructor() {

  }

  async ngOnInit() {
    await this.settingsService.loadSettings();
    this.getSettings();
    this.loadCart();
    
  }
  
  async loadCart() {
    this.cartItems = this.cartService.getCartItems();
    this.calculateTotalPrice();
  }

  getSettings() {
    this.settingsService.settings$
    .pipe(
      filter(settings => Object.keys(settings).length > 0), // Filtrer les objets non vides
      take(1)
      )
    .subscribe({
      next: settings => {
        this.deliveryCharge = +settings.delivery_charge;
        console.log('cart Settings del char: ', this.deliveryCharge);
        console.log('TYPE OF DELIVERY CHARGE: ', typeof(this.deliveryCharge));
      }
    });
  }
  
  calculateTotalPrice(): void {
    // this.totalPrice = this.cartItems.reduce((total, item) => {
      //   const price = item.promo_price ? item.promo_price : item.price;
      //   return total + (price * item.quantity);
      // }, 0);
      const totalPrice = this.cartItems.reduce((total, item) => {
        const price = item.promo_price ? item.promo_price : item.price;
        return total + (price * item.quantity);
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
    // Logic to proceed to checkout
  }

}
