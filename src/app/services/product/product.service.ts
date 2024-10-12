import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, firstValueFrom, lastValueFrom } from 'rxjs';
import { IProduct } from '../../models/product';
import { ApiService } from '../api/api.service';
import { GlobalService } from '../global/global.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private products$ = new BehaviorSubject<IProduct[]>([]);
  get products() {
    return this.products$.asObservable();
  }

  private api = inject(ApiService);
  private global = inject(GlobalService);
  // private http = inject(HttpClient);
  private readonly products_api_url = 'api/products';
  
  constructor() { }

  // getProducts(): Observable<IProduct[]> {
  //   console.log(this.products_api_url);
  //   return this.api.get(this.products_api_url);
  // }

  async getProducts(): Promise<any> {
    try {
      if(this.products$.getValue().length <= 0) {
      const data: IProduct[] = await lastValueFrom(this.api.get('products'));
      console.log('Products from product service: ', data);
      data.map((p) => {
        p.images.map((img, key) => {
          p.images[key] = img ? this.global.downloadImage('products', img) : '';
        });
      });
      console.log('products: ',  this.products$.getValue());
      this.products$.next(data);
    }
    } catch (error) {
      console.log(error);
    }
  }

  async getProductById(slug) {
    try {
      // const data = await firstValueFrom(this.api.get(`${this.products_api_url}/${1}`));
      const data: any = await firstValueFrom(this.api.get('products/' + slug));
      // if (data.images && data.images.length > 0) {
      data.images.map((img, key) => {
        data.images[key] = this.global.downloadImage('products', img)
        console.log('product by slug: ', data);
        });
      // }
      return data;
    } catch (error) {
      console.log(error);
    }
  }

}
