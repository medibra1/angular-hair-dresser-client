import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CountdownService {

  timeRemaining: number =  0; // Temps restant
  cooldownPeriod: number = 5 * 60 * 1000; // 5 minutes in milliseconds

  constructor() { }

    // Check cooldown on initialization
    checkCooldown(): void {
      const lastSent = localStorage.getItem('lastOtpTimestamp');
      if (lastSent) {
        const elapsed = Date.now() - +lastSent;
        if (elapsed < this.cooldownPeriod) {
          this.startCountdown(this.cooldownPeriod - elapsed);
        }
      }
    }

      // Start countdown
  startCountdown(duration: number): void {
    this.timeRemaining = duration;
    const interval = setInterval(() => {
      this.timeRemaining -= 1000;
      if (this.timeRemaining <= 0) {
        clearInterval(interval);
        this.timeRemaining = 0;
      }
    }, 1000);
  }

     // Format time as mm:ss
     formatTime(ms: number): string {
      const totalSeconds = Math.floor(ms / 1000);
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = totalSeconds % 60;
  
      const formattedMinutes = minutes.toString().padStart(2, '0');
      const formattedSeconds = seconds.toString().padStart(2, '0');
  
      return `${formattedMinutes}:${formattedSeconds}`;
    }
  
    //   //   // Format time as hh:mm:ss
    //   // formatTime(ms: number): string {
    //   //   const totalSeconds = Math.floor(ms / 1000);
    //   //   const hours = Math.floor(totalSeconds / 3600);
    //   //   const minutes = Math.floor((totalSeconds % 3600) / 60);
    //   //   const seconds = totalSeconds % 60;
  
    //   //   const formattedHours = hours.toString().padStart(2, '0');
    //   //   const formattedMinutes = minutes.toString().padStart(2, '0');
    //   //   const formattedSeconds = seconds.toString().padStart(2, '0');
  
    //   //   return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
    //   // }

}
