import { Injectable } from '@angular/core';
import { IProduct } from '../../models/product';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private cartItemsCount = new BehaviorSubject<number>(0);

  constructor() {
    this.updateCartItemsCount();
  }

  getCartItems(): IProduct[] {
    const cart = localStorage.getItem('cart');
    console.log('Cart local storage: ', JSON.parse(cart));
    return cart ? JSON.parse(cart) : [];
  }

  addToCart(product: IProduct): void {
    const cart = this.getCartItems();
    const existingProduct = cart.find(item => item.id === product.id && item.selected_color === product.selected_color && item.selected_model === product.selected_model);
    if (existingProduct) {
      existingProduct.quantity += product.quantity;
    } else {
      cart.push({ ...product });
    }
    console.log('product to add local storage: ', cart);
    localStorage.setItem('cart', JSON.stringify(cart));
    this.updateCartItemsCount();
  }

  updateCart(cart: IProduct[]): void {
    localStorage.setItem('cart', JSON.stringify(cart));
    this.updateCartItemsCount();
  }

  removeFromCart(product: IProduct): void {
    if (window.confirm('Do you want to remove this item from the cart?')) {
      let cart = this.getCartItems();
      cart = cart.filter(item => item.id !== product.id || item.selected_color !== product.selected_color || item.selected_model !== product.selected_model);
      localStorage.setItem('cart', JSON.stringify(cart));
      this.updateCartItemsCount();
    }
  }

  clearCart(): void {
    if (window.confirm('Do you really want to clear the cart?')) {
      localStorage.removeItem('cart');
      this.updateCartItemsCount();
    }
  }
  

  getCartItemsCount() {
    return this.cartItemsCount.asObservable();
  }

  private updateCartItemsCount(): void {
    const cart = this.getCartItems();
    const count = cart.reduce((acc, item) => acc + item.quantity, 0);
    this.cartItemsCount.next(count);
  }

}
