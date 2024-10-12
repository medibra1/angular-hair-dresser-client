import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, firstValueFrom} from 'rxjs';
import { ApiService } from '../api/api.service';

@Injectable({
  providedIn: 'root',
})
export class GlobalService {

  private activeSectionSource = new BehaviorSubject<string>('section_1');
  // private activeSectionSource = new BehaviorSubject<string>('');
  activeSection$ = this.activeSectionSource.asObservable();
  private loading: boolean = false;

  private readonly products_api_url = 'api/site_settings';
  private readonly services_api_url = 'api/services';
  private api = inject(ApiService);

  private servicesSubject: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  get services$() {
    return this.servicesSubject.asObservable();
  }

  private sliderSubject: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  get sliders$() {
    return this.sliderSubject.asObservable();
  }

  private barberSubject: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  get barbers$() {
    return this.barberSubject.asObservable();
  }
  
  // Section 
  setActiveSection(sectionId: string) {
    this.activeSectionSource.next(sectionId);
  }
  setLoading(loading: boolean) {
    this.loading = loading;
  }
  getLoading(): boolean {
    return this.loading;
  }
  
  // Service
  async loadServices() {
    try {
      const data = await firstValueFrom(this.api.get('services'));
      console.log('-- Load services --- : ', data);
      data.map(service => {
        service.image = service.image ? this.downloadImage('services', service.image): '';
        return service;
      });
      this.servicesSubject.next(data);
    } catch (error) {
      console.log(error);
    }
  }
  
  // Sliders
  async loadSlidersImages() {
    try {
      const data = await firstValueFrom(this.api.get('sliders'));
      // data = data.map( img => {
      //   return this.downloadImage('sliders', img);
      // });
      console.log('SLIDERS IMG: ', data);
      this.sliderSubject.next(data);
    } catch (error) {
      console.log(error);
    }
  }

  // imageUrl(img) {
  //   return this.downloadImage('sliders', img);
  // }

  // Team - Barber
  async loadBarbers() {
    try {
      // const data = await firstValueFrom(this.api.get('api/barbers'));
      const data = [];
      this.barberSubject.next(data);
    } catch (error) {
      console.log(error);
    }
  }

  // async downloadImage(imageDirectory: string,imageName: string) {
  //   return await firstValueFrom(this.api.get(`${imageDirectory}/${imageName}`, { responseType: 'blob' }));
  // }

  
  downloadImage(imageDirectory: string,imageName: string) {
     const data =  this.api.downloadImage(imageDirectory, imageName);
     console.log('Image URL: ', data);
     return data;
  }

}
