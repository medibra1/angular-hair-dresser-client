import { inject, Injectable } from '@angular/core';
import { IProduct } from '../../models/product';
import { BehaviorSubject, filter, take } from 'rxjs';
import { ProductService } from '../product/product.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private cartItemsCount = new BehaviorSubject<number>(0);

  private productService = inject(ProductService);

  constructor() {
    this.updateCartItemsCount(true);
  }

  // getCartItems(): IProduct[] {
  //   const cart = localStorage.getItem('cart');
  //   console.log('Cart local storage: ', JSON.parse(cart));
  //   return cart ? JSON.parse(cart) : [];
  // }

  getCartItems(): IProduct[] {
    const cart = localStorage.getItem('cart');
    let cartItems: IProduct[] = cart ? JSON.parse(cart) : [];
  
    console.log('Cart local storage:', cartItems);
  
    if(cartItems.length > 0) {
      this.productService.getProducts();
      this.productService.products
      .pipe(
        filter(products => Object.keys(products).length > 0), // Filtrer les objets non vides
        take(1)
      )
      .subscribe({
        next: (products: IProduct[]) => {
          let updatedCartItems: IProduct[] = [];
    
          cartItems.forEach((cartItem) => {
            const matchedProduct = products.find(
              (p) => p.id === cartItem.id && (p.price === cartItem.price && p.promo_price === cartItem.promo_price)
            );
            
            if (matchedProduct) { 
              updatedCartItems.push(cartItem); // Product matches, keep it
            } else {
              const updatedProduct = products.find((p) => p.id === cartItem.id);
              if (updatedProduct) {
                updatedCartItems.push({ ...cartItem, price: updatedProduct.price, promo_price: updatedProduct.promo_price }); // Update the price
              }
            }
          });

          // Update localStorage with the new cart
          localStorage.setItem('cart', JSON.stringify(updatedCartItems));
          this.updateCartItemsCount(false, updatedCartItems);
          console.log('updated cart items: ', updatedCartItems);
          // this.updateCart(updatedCartItems);
        },
        error: (err) => console.error('Error fetching products:', err),
      });
    }
    
    return cartItems;

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
    this.updateCartItemsCount(false, cart);
  }

  updateCart(cart: IProduct[]): void {
    localStorage.setItem('cart', JSON.stringify(cart));
    this.updateCartItemsCount(false, cart);
  }

  removeFromCart(product: IProduct): void {
    if (window.confirm('Do you want to remove this item from the cart?')) {
      let cart = this.getCartItems();
      cart = cart.filter(item => item.id !== product.id || item.selected_color !== product.selected_color || item.selected_model !== product.selected_model);
      localStorage.setItem('cart', JSON.stringify(cart));
      this.updateCartItemsCount(false, cart);
    }
  }

  clearCart(): void {
    if (window.confirm('Do you really want to clear the cart?')) {
      localStorage.removeItem('cart');
      // this.updateCartItemsCount();
      this.cartItemsCount.next(0);
    }
  }

  getCartItemsCount() {
    return this.cartItemsCount.asObservable();
  }

  private updateCartItemsCount(loadCartITems = false, cartItems?: IProduct[]): void {
    let cart: IProduct[] = [];
    if(loadCartITems) cart = this.getCartItems();
    else cart = cartItems;
    const count = cart.reduce((acc, item) => acc + item.quantity, 0);
    this.cartItemsCount.next(count);
  }

  hasCartItems(): boolean {
    const cart = localStorage.getItem('cart');
    return cart && JSON.parse(cart).length > 0;
  }

  // private updateCartItemsCount(): void {
  //   const cart = this.getCartItems();
  //   const count = cart.reduce((acc, item) => acc + item.quantity, 0);
  //   this.cartItemsCount.next(count);
  // }

}
