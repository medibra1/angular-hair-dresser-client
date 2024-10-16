import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { ApiService } from '../api/api.service';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  private readonly settings_api_url = 'api/site_settings';
  private api = inject(ApiService);

  private settingsSubject: BehaviorSubject<any> = new BehaviorSubject<any>({});
  get settings$() {
    return this.settingsSubject.asObservable();
  }

  private appointmentSettingsSubject: BehaviorSubject<any> = new BehaviorSubject<any>({});
  get appointementSettings$() {
    return this.appointmentSettingsSubject.asObservable();
  }
  
  constructor() { }


  async loadSettings() {
    try {
      // const data = await firstValueFrom(this.api.get(this.settings_api_url));
      const data = await firstValueFrom(this.api.get('settings'));
      console.log('++++ Site settings +++++: ', data.result);
      this.settingsSubject.next(data.result);
    } catch (error) {
      console.log(error);
    }
  }

  async loadAppointmentSettings() {
    try {
      // const data = await firstValueFrom(this.api.get(this.settings_api_url));
      const data = await firstValueFrom(this.api.get('appointment-settings'));
      console.log('++++ appointement settings +++++: ', data);
      this.appointmentSettingsSubject.next(data);
    } catch (error) {
      console.log(error);
    }
  }



}
