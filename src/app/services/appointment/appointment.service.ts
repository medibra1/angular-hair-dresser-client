import { HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../api/api.service';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {

 /*  private timeSlots: { [date: string]: string[] } = {};
  private bookedSlots: { [date: string]: string[] } = {};

  constructor() {
    this.generateTimeSlots('2024-05-26', 10, 20, 30);
  }

  private generateTimeSlots(date: string, startHour: number, endHour: number, duration: number) {
    const slots = [];
    let currentTime = new Date(date);
    currentTime.setHours(startHour, 0, 0, 0);

    while (currentTime.getHours() < endHour) {
      slots.push(currentTime.toTimeString().substring(0, 5));
      currentTime.setMinutes(currentTime.getMinutes() + duration);
    }

    this.timeSlots[date] = slots;
    this.bookedSlots[date] = [];
  }

  getAvailableTimeSlots(date: string): Observable<string[]> {
    const slots = this.timeSlots[date] || [];
    const booked = this.bookedSlots[date] || [];
    return new BehaviorSubject(slots.filter(slot => !booked.includes(slot)));
  }

  bookTimeSlot(date: string, slot: string): boolean {
    if (!this.bookedSlots[date]) {
      this.bookedSlots[date] = [];
    }

    const booked = this.bookedSlots[date];
    if (!booked.includes(slot) && (this.timeSlots[date] || []).includes(slot)) {
      this.bookedSlots[date].push(slot);
      console.log('BookedSlot: ', this.bookedSlots);
      return true;
    }
    return false;
  }

  isSlotBooked(date: string, slot: string): boolean {
    return (this.bookedSlots[date] || []).includes(slot);
  } */


  private apiUrl = 'http://127.0.0.1:8000/api'; // Remplacez par votre URL d'API
  private api = inject(ApiService);
  constructor() {}

  getAvailableSlots(date, start_time, end_time, intervalMinutes): Observable<string[]> {
    const params = new HttpParams()
      .set('date', date)
      .set('start_time', start_time)
      .set('end_time', end_time)
      .set('interval_minute', intervalMinutes.toString());
    return this.api.get('available-slots', params);
  }

  bookTimeSlot(appointmentData: any): Observable<any> {
    appointmentData.type = 2; // send by user
    return this.api.post('book-time-slot', appointmentData);
  }

}
