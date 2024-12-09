import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { OutletContext } from '@angular/router';

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.css'
})
export class AlertComponent {

  @Input() successMessage: string | null = '';
  @Input() errorMessage: string[] = [];
  @Input() duration: number | null = 5000;
  @Input() actionTitle: string = '';
  @Output() btnClicked = new EventEmitter<void>();

  private clearTimeoutId: any;

  ngOnChanges(changes: SimpleChanges) {
    // Clear any existing timeout if messages change
    if (changes['successMessage'] || changes['errorMessage']) {
      clearTimeout(this.clearTimeoutId);

      // Reset the timeout for clearing messages
      if(this.duration) {
        this.clearTimeoutId = setTimeout(() => {
          this.successMessage = null;
          this.errorMessage = [];
        }, this.duration);
      }
    }
  }

  handle() {
    this.btnClicked.emit();
  }

}
