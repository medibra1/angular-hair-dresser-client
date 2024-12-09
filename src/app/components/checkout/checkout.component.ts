import { Component, inject } from '@angular/core';
import { PaymentService } from '../../services/payment/payment.service';
// import { loadStripe, Stripe } from '@stripe/stripe-js';
import { Stripe, StripeElements } from '@stripe/stripe-js';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { filter, take } from 'rxjs';
import { ProfileService } from '../../services/profile/profile.service';
import { User } from '../../models/user.model';
import { EncryptionService } from '../../services/encryption/encryption.service';
import { ToastService } from '../../services/toast/toast.service';

// declare var Stripe;

export interface IPaymentData {
  amount: number;
  description: string;
}

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css',
})


export class CheckoutComponent {
  // stripe: any;
  // card: any;
  // clientSecret: string;

  stripe: Stripe | null = null;
  elements: StripeElements | null = null;
  clientSecret: string | null = null;
  loading = false;
  paymentSuccessful = false;
  errorMessage = '';

  paymentData = {} as IPaymentData;

  private stripeService = inject(PaymentService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private profileService = inject(ProfileService);
  private encryptionService = inject(EncryptionService);
  private toastService = inject(ToastService);
  // private authService = inject(AuthService);
  profile = {} as User;

  constructor() {}

  async ngOnInit() {
    console.log('Front end url: ', environment.clientUrl);

    const data = this.route.snapshot.queryParams;
    console.log('data: ', data);
    if (data['data']) {
      // this.paymentData = JSON.parse(atob(data['data']));
      const decryptedData: IPaymentData = this.encryptionService.decrypt(data['data']);
      if (!decryptedData) {
        this.router.navigateByUrl('/cart', { replaceUrl: true });
        return;
      }
      this.paymentData = decryptedData;
    } 
    else {
      this.router.navigateByUrl('/cart', { replaceUrl: true });
    }

    // this.router.events.pipe(
    //   filter(e => e instanceof NavigationStart),
    //   map(() => this.router.getCurrentNavigation().extras.state)
    // )
    // .subscribe(state => {
    //   console.log('Navigation extras state: ', state); 
    // })
    // const navigation = this.router.getCurrentNavigation();
    // if (navigation?.extras.state) {
    //   const checkoutData = navigation.extras.state;
    //   console.log('Navigation extras state: ', checkoutData); 
    // } else {
    //   console.log('Navigation extras state: NOOOOOO', navigation.extras.state); 
      
    // }

    await this.profileService.getProfile();
    this.profileService.profile
    .pipe(
      filter(profile => Object.keys(profile).length > 0), // Filtrer les objets non vides
      take(1)
    )
    .subscribe({
      next: profile => {
        this.profile = profile;
        console.log('Profile data checkout component: ', this.profile);
      }
    });

    try {
      this.stripe = await this.stripeService.getStripe();
      if (!this.stripe) {
        throw new Error('Stripe failed to initialize.');
      }
      // Fetch the client secret from the backend
      await this.createPaymentIntent();
      if (this.clientSecret) {
        this.initializePaymentElement();
      }
    } catch (error) {
      this.errorMessage =
        error instanceof Error ? error.message : 'Stripe initialization error.';
    }
  }

  // isPaymentData(data: any): data is PaymentData {
  //   return data && typeof data.amount === 'number' && typeof data.description === 'string';
  // }

  private async createPaymentIntent() {
    try {
      const payload = {
        amount: this.paymentData.amount,
        description: this.paymentData.description,
        name: this.profile.name,
        email: this.profile.email,
        phone: this.profile.phone
      };
      console.log('Data to send when paying: ', payload);

      const response: any = await this.stripeService.createPaymentIntent(payload);
      this.clientSecret = response.clientSecret;
    } catch (error) {
      this.errorMessage = 'Error creating payment intent.';
      console.error('Error:', error);
    }
  }

  private initializePaymentElement() {
    this.elements = this.stripe!.elements({ clientSecret: this.clientSecret });
    const paymentElement = this.elements.create('payment');
    paymentElement.mount('#payment-element');
  }

  async handlePayment(event: Event) {
    event.preventDefault();
    this.loading = true;

    if (this.stripe && this.elements) {
      const { error } = await this.stripe.confirmPayment({
        elements: this.elements,
        confirmParams: {
          return_url: environment.clientUrl + 'products',
        },
        redirect: 'if_required' 
      });
 
      if (error) {
        this.showToast(error.message || 'An error occurred during payment', 'error');
        this.errorMessage = error.message || 'An error occurred during payment';
        this.loading = false;
      } else {
        this.showToast('Payment successful!', 'success');
        this.router.navigateByUrl('/products', { replaceUrl: true });
        this.paymentSuccessful = true;
      }
    }

    this.loading = false;
  }

  showToast(msg, type) {
    this.toastService.showToast({
      message: msg,
      type: type,
      duration: 7000,
      position: 'top',
    });
  }

  // ngOnInit() {
  //   this.stripe = Stripe('pk_test_51I6GciHgNn0wXN0bxkezZ2TEWC8fyhO94BUPTn79jNcoGX2I5MJKu5Js2AAsJh7nAgmmWVz642RJpIP7hzGczia000n1b9z61L'); // Votre clé publique
  //   const elements = this.stripe.elements();
  //   this.card = elements.create('card');
  //   this.card.mount('#card-element');

  //   this.paymentService.createPaymentIntent(10).subscribe((data) => {
  //     this.clientSecret = data.clientSecret;
  //   });
  // }

  // async handlePayment() {
  //   const { paymentIntent, error } = await this.stripe.confirmCardPayment(this.clientSecret, {
  //     payment_method: { card: this.card },
  //   });

  //   if (error) {
  //     console.error(error.message);
  //   } else if (paymentIntent.status === 'succeeded') {
  //     console.log('Paiement réussi !');
  //   }
  // }
}
