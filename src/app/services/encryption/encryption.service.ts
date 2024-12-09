import { Injectable } from '@angular/core';

import * as CryptoJS from 'crypto-js';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EncryptionService {
  private secretKey = environment.cryptoJsSecretKey; // Remplacez par votre clé secrète

  constructor() { }

  encrypt(data: any): string {
    return CryptoJS.AES.encrypt(JSON.stringify(data), this.secretKey).toString();
  }

  decrypt(encryptedData: string): any {
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedData, this.secretKey);
      const data = JSON.parse(bytes.toString(CryptoJS.enc.Utf8)); 
      return data;
    } catch (e) {
      console.log('Decrypting error: ');
      // throw(e);
      return null;
    }
  }

}
