import { InMemoryDbService } from 'angular-in-memory-web-api';
import { IProduct } from '../../models/product';

export class ProductData implements InMemoryDbService {
  createDb(): Record<string, IProduct[]> {
    const products: IProduct[] = [
      {
        id: 1,
        name: 'Product 1',
        slug: 'product-1',
        description: 'Un des meilleurs sur le marché',
        category: 'Cheveux',
        price: 34,
        promo_price: 30,
        images: ['assets/images/services/shave.jpg'],
        models: ['Mod 1', 'Mod 2', 'Mod3'],
        rating: 4,
        reviews: [
          'Lorem ipsum dolor sit', 'amet consectetur adipisicing', ' elit. Atque, accusantium.', 'Fuga rem consequuntur assumenda',
          'Lorem ipsum dolor sit', 'amet consectetur adipisicing', ' elit. Atque, accusantium.', 'Fuga rem consequuntur assumenda',
        ],
        tags : ['Hot', 'New'],
        brand: 'Tensei',
        additional_info: `Lorem ipsum dolor sit amet consectetur adipisicing elit. Atque,
                          accusantium. Fuga rem consequuntur assumenda esse minus eius modi
                          non cumque asperiores, necessitatibus voluptatem. Velit cupiditate
                          odit, consectetur debitis deleniti illum.`,
        colors: ['Red', 'Blue', 'Green'],
        stock: 45,
        status: true,
      },
      {
        id: 2,
        name: 'Produit 2',
        slug: 'Product-2',
        description: 'Description du produit 1',
        price: 29.99,
        promo_price: 19.99,
        images: ['assets/images/services/kids.jpg'],
        tags: ['Promotion'],
        category: 'Electronics',
        stock: 45,
        status: true,
      },
      {
        id: 3,
        name: 'Produit 3',
        slug: 'product-3',
        description: 'Description du produit 2',
        price: 49.99,
        promo_price: null,
        images: ['assets/images/services/wash.jpg'],
        tags: ['Best-seller'],
        category: 'Books',
        status: true,
      },
      {
        id: 4,
        name: 'Produit 4',
        slug: 'product-4',
        description: 'Description du produit 3',
        price: 19.99,
        promo_price: 14.99,
        images: ['assets/images/services/hair-cut.jpg'],
        tags: ['Sale'],
        category: 'Clothing',
        stock: 45,
        status: true,
      },
    ];
    const site_settings: any = 
      {
        logo: 'assets/images/logo.png',
        name: 'YGB Hair Desser',
        slogan : 'Get the most professional haircut for you',
        email: 'ygb.hairdresser@gmail.com',
        email_smtp: '',
        site_url: '',
        address1: '12 street Harry Potter 13344, Stockholm, Sweden',
        address2: '',
        map: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7702.122299518348!2d13.396786616231472!3d52.531268574169616!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47a85180d9075183%3A0xbba8c62c3dc41a7d!2sBarbabella%20Barbershop!5e1!3m2!1sen!2sth!4v1673886261201!5m2!1sen!2sth',
        opening_time: '10:00',
        closing_time: '9:00',
        currency: 'kr',
        phone1: '45454546465786',
        phone2: '',
        facebook: 'https://fb.com',
        instagram: 'https://www.instagram.com',
        twitter: 'https://www.x.com',
        youtube: 'https://www.youtube.com',
        whatsapp: 'https://www.whatsapp.com',
        tiktok: 'https://www.tiktok.com',
        social1: '',
        social2: '',
        delivery_charge: '',
        language: 'en',
        theme: 'light',
        api_url: '',
      };

      const user = {
        id: '1',
        email: 'modroq@gmail.com',
        password: 'azerty',
        address: 'Rue 1, Koumassi, Abj',
        phone: '46454646466',
        name: 'Koné Siriki',
        type: 'user',
        status: 'nactive',
        email_verified: false,
      }

      const services: any = [
        {
          name: 'Shave',
          price: 45,
          image: 'assets/images/services/shave.jpg',
          promo_price: 44,
          description: '',
          status: true,
          type: 1,
        },
        {
          name: 'Kids',
          price: 45,
          image: 'assets/images/services/kids.jpg',
          promo_price: 44,
          description: '',
          status: true,
          type: 1,
        },
        {
          name: 'Wash',
          price: 45,
          image: 'assets/images/services/wash.jpg',
          // promo_price: 44,
          description: '',
          status: true,
          type: 1,
        },
        {
          name: 'Hair Cut',
          price: 35,
          image: 'assets/images/services/hair-cut.jpg',
          promo_price: 34,
          description: '',
          status: true,
          type: 1,
        },
        {
          name: 'Beard Trim',
          price: 20,
          promo_price: 19,
          description: '',
          status: true,
          type: 2,
        },
        {
          name: 'Razor Cut',
          price: 15,
          promo_price: 14,
          description: '',
          status: true,
          type: 2,
        },
        {
          name: 'Styling / Color',
          price: 8,
          image: 'assets/images/services/kids.jpg',
          promo_price: 7,
          description: '',
          status: true,
          type: 2,
        },
      ];

    const sliders: any = [
      'assets/images/hero/hero1.jpg',
      'assets/images/hero/hero2.jpg',
      'assets/images/hero/hero3.jpg',
      'assets/images/hero/hero4.jpg',
    ];

    const barbers: any  = [
      {
        name: 'Jason',
        photo: 'assets/images/team/team1.jpg',
        email: 'ygb.hairdresser@gmail.com',
        facebook: 'https://fb.com',
        instagram: 'https://www.instagram.com',
        twitter: 'https://www.x.com',
        youtube: 'https://www.youtube.com',
        whatsapp: 'https://www.whatsapp.com',
        tiktok: 'https://www.tiktok.com',
        social1: '',
        social2: '',
        phone1: '45454546465786',
        phone2: '',
        type: '',
        status: true,
      },
      {
        name: 'Ricky',
        photo: 'assets/images/team/team2.jpg',
        email: 'ygb.hairdresser@gmail.com',
        facebook: 'https://fb.com',
        instagram: 'https://www.instagram.com',
        twitter: 'https://www.x.com',
        youtube: 'https://www.youtube.com',
        whatsapp: 'https://www.whatsapp.com',
        tiktok: 'https://www.tiktok.com',
        social1: '',
        social2: '',
        phone1: '45454546465786',
        phone2: '',
        type: '',
        status: true,
      }
    ];

    return { products, site_settings, services, sliders, barbers };
  }

  genId(hotels: IProduct[]): number {
    // generate ID for new record
    return hotels.length > 0
      ? Math.max(...hotels.map((hotels) => hotels.id)) + 1
      : 1; //math.max avoir la val la plus grande
  }
}
