import { Component } from '@angular/core';
import { AppointmentFormComponent } from '../../components/appointment-form/appointment-form.component';

@Component({
  selector: 'app-appointment',
  standalone: true,
  imports: [AppointmentFormComponent],
  templateUrl: './appointment.component.html',
  styleUrl: './appointment.component.css'
})
export class AppointmentComponent {

/*   appointmentForm: FormGroup;
  timeSlots: string[] = [];
  loading = false;
  submitted = false;
  success = '';
  error = '';

  constructor(
    private formBuilder: FormBuilder,
    private appointmentService: AppointmentService
  ) { }

  ngOnInit() {
    this.appointmentForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]*$'), Validators.minLength(9), Validators.maxLength(10)]],
      date: ['', Validators.required],
      time: ['', Validators.required]
    });

    this.appointmentForm.get('date')?.valueChanges.subscribe(date => {
      if (date) {
        this.appointmentService.getAvailableTimeSlots(date).subscribe(slots => {
          this.timeSlots = slots;
        });
      } else {
        this.timeSlots = [];
      }
    });
  }

  get af() { return this.appointmentForm.controls; }

  isSlotBooked(slot: string): boolean {
    const date = this.appointmentForm.get('date')?.value;
    return this.appointmentService.isSlotBooked(date, slot);
  }

  onSubmit() {



    this.submitted = true;

    if (this.appointmentForm.invalid) {
      return;
    }

    const { date, time } = this.appointmentForm.value;
    if (this.isSlotBooked(time)) {
      this.error = 'Selected time slot is already booked.';
      return;
    }

    this.loading = true;

    setTimeout(() => {
      if (this.appointmentService.bookTimeSlot(date, time)) {
        console.log('Book appointement: ', this.appointmentService.bookTimeSlot(date, time));
        this.success = 'Appointment booked successfully!';
      } else {
        this.error = 'Failed to book the appointment. Please try again.';
      }
      this.loading = false;
    }, 1000);
  } */




}
