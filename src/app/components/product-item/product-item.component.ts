import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { IProduct } from '../../models/product';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-product-item',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './product-item.component.html',
  styleUrl: './product-item.component.css',
})
export class ProductItemComponent {

  @Input() item: IProduct;
  @Output() addToCart: EventEmitter<any> = new EventEmitter();
  // private global = inject(GlobalService);
  
  getTagClass(tag: string): string {
    switch (tag.toLowerCase()) {
      case 'new':
        return 'bg-success';
      case 'promotion':
        return 'bg-danger';
      case 'best-sale':
        return 'bg-warning';
      case 'sale':
        return 'bg-info';
      case 'hot':
        return 'bg-dark';
      default:
        return 'bg-secondary';
    }
  }

  addCart() {
    this.item.quantity = 1;
    this.addToCart.emit(this.item);
  }

  makePayment(product) {

  }

  // imageUrl(img) {
  //   return this.global.downloadImage('products', img);
  // }

}
