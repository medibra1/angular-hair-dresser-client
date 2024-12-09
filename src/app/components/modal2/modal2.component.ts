import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, TemplateRef } from '@angular/core';

@Component({
  selector: 'app-modal2',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal2.component.html',
  styleUrl: './modal2.component.css'
})
export class Modal2Component {

  @Input() title: string;
  // @Input() content: string | string[] | TemplateRef<any>;
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() displaySaveBtn = false;
  @Input() saveBtnTitle = 'Save';
  @Output() closeModal = new EventEmitter<void>();
  @Output() saveData = new EventEmitter<void>();
  @Input() template: TemplateRef<any>;
  @Input() disabled: boolean = false;
  @Input() showFooter = true;

  close() {
    this.closeModal.emit();
  }
  save() {
    this.saveData.emit();
  }

  // ngOnDestroy() { }

}
