import { Component, inject } from '@angular/core';
import { ProductItemComponent } from '../../components/product-item/product-item.component';
import { CommonModule } from '@angular/common';
import { IProduct } from '../../models/product';
import { ProductService } from '../../services/product/product.service';
import { Subscription } from 'rxjs';
import { CartService } from '../../services/cart/cart.service';
import { Router } from '@angular/router';
import { GlobalService } from '../../services/global/global.service';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [ProductItemComponent, CommonModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent {

  products: IProduct[] = [];
  private productService = inject(ProductService);

  filteredList: any[] = [];
  categories: string[] = [];
  selectedCategory: string = '';
  searchQuery: string = '';

  productSub: Subscription;

  private cartService = inject(CartService);
  private router = inject(Router);
  private global = inject(GlobalService);

  constructor() {}

  async ngOnInit() {
    console.log('CURENNT ROUTE: ', this.router);
    this.productSub = this.productService.products.subscribe({
      next: products => {
        // products.forEach( p => {
        //   p.images[0] = this.imageUrl(p.images[0]);
        // });
        this.products = products;
        console.log('Products list: ', this.products);
        this.categories = [...new Set(this.products.map(item => item.category))];
        this.filteredList = this.products;
      },
      error: (err) => console.error('Error fetching products', err)
    });
    await this.productService.getProducts();
  }

  // imageUrl(img) {
  //   return this.global.downloadImage('products', img);
  // }

  filterByCategory(event): void {
    const category = event.target.value;
    this.selectedCategory = category;
    this.applyFilters();
  }

  searchProducts(event): void {
    const query = event.target.value;
    this.searchQuery = query;
    this.applyFilters();
  }

  applyFilters(): void {
    this.filteredList = this.products.filter(item => {
      return ((!this.selectedCategory || item.category === this.selectedCategory) && (!this.searchQuery || item.name.toLowerCase().includes(this.searchQuery.toLowerCase()))
      );
    });
  }

  addToCart(product) {
    console.log('add to cart product list', product);
    this.cartService.addToCart(product);
    this.router.navigateByUrl('/cart');
  }

  //images = [62, 83, 466, 965, 982, 1043, 738].map((n) => `https://picsum.photos/id/${n}/1930/800`);
  //images = [1,2].map((n) => `assets/img/hero-carousel/${n}.jpg`);

  // ngOnInit(): void {
  //   this.list = [
  //     { id: 1, name: 'Produit 1', description: 'Description du produit 1', price: 29.99, promoPrice: 19.99, image: 'https://picsum.photos/id/90/1930/1000', tags: ['Nouveau', 'Promotion'], category: 'Electronics' },
  //     { id: 2, name: 'Produit 2', description: 'Description du produit 2', price: 49.99, promoPrice: null, image: 'https://picsum.photos/id/190/1930/1000', tags: ['Best-seller'], category: 'Books' },
  //     { id: 3, name: 'Produit 3', description: 'Description du produit 3', price: 19.99, promoPrice: 14.99, image: 'https://picsum.photos/id/900/1930/1000', tags: ['En solde'], category: 'Clothing' },
  //   ];

  //   this.categories = [...new Set(this.list.map(item => item.category))];
  //   this.filteredList = this.list;
  // }


  // getTagClass(tag: string): string {
  //   switch (tag.toLowerCase()) {
  //     case 'new':
  //       return 'bg-success';
  //     case 'promotion':
  //       return 'bg-danger';
  //     case 'best-seller':
  //       return 'bg-warning';
  //     case 'sale':
  //       return 'bg-info';
  //     case 'hot':
  //       return 'bg-dark';
  //     default:
  //       return 'bg-secondary';
  //   }
  // }

  // addToCart(product) {

  // }

  ngOnDestroy() {
    if(this.productSub) this.productSub.unsubscribe();
  }


}
