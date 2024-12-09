import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { IProduct } from '../../models/product';
import { Router, RouterModule } from '@angular/router';
import { EncryptionService } from '../../services/encryption/encryption.service';

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
  private router = inject(Router);
  private encryptionService = inject(EncryptionService);
  
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

  makePayment(product: IProduct) {
    const data = {
      amount: product.promo_price ? +product.promo_price : +product.price,
      description: product.name
    };
    console.log('Product to by form product component: ', data);
    const encryptedData = this.encryptionService.encrypt(data);
    const navData = {
      queryParams: {
        data: encryptedData,
        // data: btoa(JSON.stringify(data)),
      },
    };
    this.router.navigate(['/checkout'], navData);

  }

  // imageUrl(img) {
  //   return this.global.downloadImage('products', img);
  // }

}
