import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private http = inject(HttpClient);

  constructor() { 
    // console.log(environment.production); // Logs false for development environment
  }

  // get(url: string, data?: any) {
  //   return this.http.get<any>(environment.serverBaseUrl + url, {params: data});
  // }

  downloadImage(directory, imageName) {
    return environment.serverBaseUrl + 'images/' + directory + '/' + imageName;
  }

  get(url: string, data?: any) {
    return this.http.get<any>(environment.serverBaseUrl + url, {params: data});
  }

  post(url: string, data: any, formData = false) {
    if(!formData) {
       data = new HttpParams({fromObject: data})
    }
    return this.http.post<any>(environment.serverBaseUrl + url, data);
  }

  put(url: string, data: any, formData = false) {
    if(!formData) {
       data = new HttpParams({fromObject: data})
    }
    return this.http.put<any>(environment.serverBaseUrl + url, data);
  }

  patch(url: string, data: any, formData = false) {
    if(!formData) {
      data = new HttpParams({fromObject: data})
   }
    return this.http.patch<any>(environment.serverBaseUrl + url, data);
  }

  delete(url: any) {
    return this.http.delete<any>(environment.serverBaseUrl + url);
  }
  
}
