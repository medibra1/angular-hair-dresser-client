import { Component, inject } from '@angular/core';
import { IProduct } from '../../models/product';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/product/product.service';
import { CommonModule } from '@angular/common';
import { ModalComponent } from '../../components/modal/modal.component';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../services/cart/cart.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, ModalComponent, FormsModule],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css'
})
export class ProductDetailComponent {

  product: IProduct =  {} as IProduct;

  private route = inject(ActivatedRoute);
  private productService = inject(ProductService);
  private cartService = inject(CartService);
  private router = inject(Router);

  displayModal = false;
  modalTitle = '';
  modalContent: string | string[];
  modalSize: 'sm' | 'md' | 'lg' = 'md';

  selected_model: string;
  selected_color: string;
  quantity: number = 1; // Par défaut, ajoute 1 article

  async ngOnInit() {
    const slug = this.route.snapshot.paramMap.get('slug'); 
    console.log('ID: ', slug);
    this.product = await this.productService.getProductById(slug);
    console.log('Product detail: ', this.product);
    this.selected_model = this.product.models ? this.product.models[0] : null;
    this.selected_color = this.product.colors ? this.product.colors[0] : null;
  }

  addToCart() {
    const productToAdd: IProduct = { ...this.product, selected_model: this.selected_model, selected_color: this.selected_color, quantity: this.quantity };
    console.log('product to add: ', productToAdd);
    this.cartService.addToCart(productToAdd);
    this.router.navigateByUrl('/cart');
  }

  incrementQuantity() {
    if (this.quantity < this.product.stock) {
      this.quantity++;
    }
  }

  decrementQuantity() {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  selectModel(model: string) {
    this.selected_model = model;
    console.log(this.selected_model);
  }

  selectColor(color: string) {
    this.selected_color = color;
    console.log(this.selected_color);
  }


  proceedToPayment(product: IProduct) {
    // Logic to proceed to payment
  }

  openReviews(): void {
    this.modalTitle = 'User reviews';
    this.modalContent = this.product?.reviews;
    this.modalSize = 'lg'; // Grande taille pour les avis
    this.displayModal = true;
  }

  closeModal(): void {
    this.displayModal = false;
  }


}
