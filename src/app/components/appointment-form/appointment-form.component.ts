import { Component, ElementRef, ViewChild } from '@angular/core';
import { GlobalService } from '../../services/global/global.service';
import { Subscription, filter, take } from 'rxjs';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AppointmentService } from '../../services/appointment/appointment.service';
import { CommonModule, DatePipe } from '@angular/common';
import { FormErrorMsgComponent } from '../form-error-msg/form-error-msg.component';
import { SettingsService } from '../../services/settings/settings.service';
import { IAppointmentSetting } from '../../models/appointment-setting';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';


@Component({
  selector: 'app-appointment-form',
  standalone: true,
  imports: [FormErrorMsgComponent, ReactiveFormsModule, CommonModule, BsDatepickerModule],
  providers: [DatePipe],
  templateUrl: './appointment-form.component.html',
  styleUrl: './appointment-form.component.css'
})
export class AppointmentFormComponent {

  appointmentForm: FormGroup;
  availableSlots: string[] = [];
  selectedDate: string;
  servicesSub: Subscription;
  services: any[]  = [];
  // minDate: string = '';
  minDate: Date = new Date();
  settings: IAppointmentSetting = {} as IAppointmentSetting;
  // slotActive = false;
  selectedSlot: string | null = null;
  // minDate: string = new Date().toISOString().split('T')[0];
  isDateUnavailable = false;
  dateModel: string | null = null;

  loading = false;
  submitted = false;
  success = '';
  error = '';

  excludedDates: string[] = [];
  excludedDays: string[] = [];


  // @ViewChild('dateInput') dateInput!: ElementRef;
  constructor(
    private formBuilder: FormBuilder,
    private appointmentService: AppointmentService,
    private datePipe: DatePipe,
    private global: GlobalService,
    private settingsService: SettingsService
  ) {
    this.appointmentForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(50)]],
      phone: ['', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.minLength(9), Validators.maxLength(10)]],
      date: ['', Validators.required],
      time: ['', Validators.required],
      service_id: ['', Validators.required],
      message: ['', Validators.nullValidator],
    });
  }

  ngOnInit(): void {
    // this.dateInput.nativeElement.value = '';
    // Initialize minDate with today's date
    // const today = new Date();
    // this.minDate = this.datePipe.transform(today, 'yyyy-MM-dd');
    this.settingsService.loadAppointmentSettings();
    this.getSettings();
    this.getServices();
  }

  disableTyping(event: KeyboardEvent): void {
    event.preventDefault(); // Disable typing
  }

  // checkIfSafari(): boolean {
  //   const ua = window.navigator.userAgent;
  //   return /Safari/.test(ua) && !/Chrome/.test(ua);
  // }

  getSettings() {
    this.settingsService.appointementSettings$
    .pipe(
      filter(settings => Object.keys(settings).length > 0), // Filtrer les objets non vides
      take(1)
    )
    .subscribe({
      next: settings => {
        this.settings = settings;
        console.log('Appointment Settings: ', this.settings);
      }
    });
  }

  openDatePicker(event: MouseEvent): void {
      //@ViewChild('dateInput') dateInput: ElementRef; // declare before
      // this.dateInput.nativeElement.style.display = 'block'; // Show the hidden input
      // this.dateInput.nativeElement.focus(); // Trigger a click event to open the date picker
      event.preventDefault();
      const dateInput = document.getElementById('date-input') as HTMLInputElement;
      const dateInputBtn = document.getElementById('date-input-btn') as HTMLInputElement;
      dateInputBtn.style.display = 'none'; 
      dateInput.style.display = 'block'; 
      dateInput.focus(); 
  }

  getServices() {
    this.servicesSub =  this.global.services$
    .pipe(
      filter(services => Object.keys(services).length > 0), // Filtrer les objets non vides
      take(1))
    .subscribe( services => {
      this.services = services;
      console.log('Appointement services: ', this.services);
    });
  }

   //Vérifie si une date est exclue
  //  isExcludedDate(date: any): boolean {
  //   const [year, month, day] = date.split('-').map(Number);
  //   const parseToDate = new Date();
  //   parseToDate.setFullYear(year, month, day);
  //   const dayOfWeek = parseToDate.getDay() === 0 ? 7 : parseToDate.getDay();
  //   return this.excludedDates.includes(date) || this.excludedDays.includes(dayOfWeek);
  // }
   isExcludedDate(date: string): boolean {
    const [year, month, day] = date.split('-').map(Number);
    const parseToDate = new Date(year, month - 1, day); // Ajustement du mois (0-11 pour JS Date)
    const dayOfWeek = parseToDate.getDay() === 0 ? 7 : parseToDate.getDay(); // Ajuster dimanche (0) à 7
    return this.excludedDates.includes(date) || this.excludedDays.includes(dayOfWeek.toString());
  }

  onDateChange(event: any): void {
    // console.log('ON DATE CHANGE: ', this.settings);
    // this.selectedDate = event.target.value;

    if(!event) {
      return;
    }

    const year = event.getFullYear();
    const month = (event.getMonth() + 1).toString().padStart(2, '0'); // Adjust for 0-indexed month
    const day = event.getDate().toString().padStart(2, '0');
    // Format the date as a string to match the format in your excludedDates array (yyyy-mm-dd)
    const formattedDate = `${year}-${month}-${day}`;
    
    this.selectedDate = formattedDate;

    const start_time = this.settings.start_time ;
    const end_time = this.settings.end_time;
    // const start_time = '10:00';
    // const end_time = '20:00';
    // this.excludedDates = ['2024-05-31', '2024-06-03']; // Dates spécifiques à exclure;
    // this.excludedDays = [7]; // 6 = Samedi, 7 = Dimanche
    const interval_minute = this.settings.interval;
    this.excludedDates = this.settings.off_dates || []; 
    this.excludedDays = this.settings.off_days || ['']; 
    this.isDateUnavailable = false;
    if (this.isExcludedDate(this.selectedDate)) {
      this.appointmentForm.controls['date'].setValue(null);
      this.availableSlots = [];
      this.isDateUnavailable = true;
      // alert('The selected date is unavailable. Please choose another date.');
      return;
    }

    console.log('Selected date: ', this.selectedDate);
    console.log('Type of pause_start_time: ', typeof(this.selectedDate));
    this.appointmentService.getAvailableSlots(this.selectedDate, start_time, end_time, interval_minute, this.settings.pause_start_time, this.settings.pause_end_time).subscribe({
        next: slots => {
          this.availableSlots = slots.map(slot => this.formatTime(slot));
          console.log('Available slots: ', this.availableSlots);
          this.selectedSlot = null; // Reset selected slot when date changes
        },
        error: error => console.error('Error fetching available slots:', error)
      });
  }

  formatTime(time: string): string {
    // Convert "10:00:00" to a Date object assuming it's today
    const [hours, minutes, seconds] = time.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, seconds);
    return this.datePipe.transform(date, 'h:mm a')!;
  }

  bookAppointment(): void {
    console.log('Selected appointement: ', this.appointmentForm.get('time').value);
    console.log('Appointement Form: ', this.appointmentForm.value);
    if (this.appointmentForm.valid) {
      this.appointmentForm.controls['date'].setValue(this.selectedDate); // input date retrun string, ngx bootstrap date return date
      this.appointmentService.bookTimeSlot(this.appointmentForm.value).subscribe({
       next: response => {
          console.log('Appointment booked successfully:', response);
          this.appointmentForm.reset();
          this.availableSlots = [];
          if(response.status && response.code == 200) this.success = 'Appointment booked successfully';
          // alert('Appointment booked successfully');
        },
        error: error => {
          console.error('Error booking appointment:', error);
          alert('Error booking appointment');
        }
      });
    } else {
      this.validateAllFormFields(this.appointmentForm);
    }
  }

  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      } else {
        control.markAsTouched({ onlySelf: true });
      }
    });
  }

  selectSlot(slot: string): void {
    this.selectedSlot = slot;
    this.appointmentForm.controls['time'].setValue(this.convertTo24HourFormat(slot));
  }

  convertTo24HourFormat(time: string): string {
    const [timePart, meridian] = time.split(' ');
    let [hours, minutes] = timePart.split(':').map(Number);

    if (meridian === 'PM' && hours < 12) {
      hours += 12;
    } else if (meridian === 'AM' && hours === 12) {
      hours = 0;
    }

    return `${this.padZero(hours)}:${this.padZero(minutes)}:00`;
  }

  padZero(number: number): string {
    return number < 10 ? `0${number}` : number.toString(); // ajouter un zéro au début si le chiffre est inférieur à 10
  }

}
