import { Component, Input, inject } from '@angular/core';
import { GlobalService } from '../../services/global/global.service';
import { Subscription, filter, skip, take } from 'rxjs';
import { CommonModule } from '@angular/common';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { ISetting } from '../../models/seeting';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.css',
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('600ms ease-in', 
        style({ opacity: 1 })
        ),
      ]),
      // transition(':leave', [
      //   animate('200ms ease-in', style({opacity: 0}))
      // ])
    ]),
  ],

  // animations: [
  //   trigger('slideInOut', [
  //     state('in', style({ transform: 'translateX(0)' })),
  //     transition(':enter', [
  //       style({ transform: 'translateX(100%)', opacity: 0 }),
  //         animate('600ms ease-out', style({ transform: 'translateX(0)', opacity: 1 }))
  //     ]),
  //     transition(':leave', [
  //       animate('600ms ease-in', style({ transform: 'translateX(-100%)' }))
  //     ])
  //   ])
  // ]
})
export class HeroComponent {

  @Input() settings: ISetting = {} as ISetting;

  imagesMob: any[] = [];
  images: any[] = [];
  imagsSub: Subscription;
  currentIndex: number = 0;
  currentIndexMob: number = 0;
  intervalId: any;

private global = inject(GlobalService);

  async ngOnInit() {
    this.imagesMob = [
      {
        image: 'assets/images/hero/hero-mob-1.jpg',
        type: 2
      },
      {
        image: 'assets/images/hero/hero-mob-2.jpg',
        type: 2
      },
      {
        image: 'assets/images/hero/hero-mob-3.jpg',
        type: 2
      },
    ];

    this.images = [
      {
        image: 'assets/images/hero/hero1.webp',
        type: 1
      },
      {
        image: 'assets/images/hero/hero5.webp',
        type: 1
      },
    ];

    // this.global.settings$
    // .pipe(
    //   filter(settings => Object.keys(settings).length > 0), // Filtrer les objets non vides
    //   take(1))
    // .subscribe((settings) => {
    //   console.log('Hero setting: ', settings);
    //   this.settings = settings;
    // });

    // await this.global.loadSlidersImages();
    // this.imagsSub = this.global.sliders$.subscribe({
    //   next: sliders => {
    //     // this.images = sliders;
    //     sliders.map(
    //       img => {
    //         img.image = this.imageUrl(img.image);
    //         if(img.type == 1) this.images.push(img);
    //         else this.imagesMob.push(img)
    //       }
    //     );
    //     console.log('Sliders: ', this.images);
    //   },
    //   error: err => {
    //     this.stopAutoSlide();
    //   }
    // });

    if(!this.imagesMob && this.images.length) this.imagesMob = this.images;
    
    if(this.images && this.images.length > 0)this.startAutoSlide();
 
  }


  imageUrl(img) {
    return this.global.downloadImage('sliders', img);
  }
  
  startAutoSlide(): void {
    this.intervalId = setInterval(() => {
      this.nextSlide();
    }, 4000); // Change l'image toutes les 4 secondes
  }
  
  stopAutoSlide(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
  
  nextSlide(): void {
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
    this.currentIndexMob = (this.currentIndexMob + 1) % this.imagesMob.length;
  }
  
  // prevSlide(): void {
  //   this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
  // }

  ngOnDestroy(): void {
    this.stopAutoSlide();
    if(this.imagsSub) this.imagsSub.unsubscribe();
  }

}
