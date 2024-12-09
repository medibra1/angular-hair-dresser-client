import { inject, Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import { lastValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  private api = inject(ApiService);

  // createPaymentIntent(amount: number): Observable<any> {
  //   return this.api.post(`create-payment-intent`, { amount });
  // }

  private stripePromise: Promise<Stripe | null>;

  constructor() {
    this.stripePromise = loadStripe(environment.STRIPE_PK);
  }

  getStripe() {
    return this.stripePromise;
  }

  async createPaymentIntent(payload) {
    try {
      return await lastValueFrom(this.api.post('create-payment-intent', payload));
    } catch (error) {
      console.error('Error:', error);
    }
  }


}
