import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, SimpleChanges, TemplateRef } from '@angular/core';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css'
})
export class ModalComponent {

  @Input() title: string;
  @Input() content: string | string[] | TemplateRef<any>;
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Output() closeModal = new EventEmitter<void>();

  isStringContent: boolean;
  isArrayContent: boolean;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['content']) {
      this.isStringContent = typeof this.content === 'string';
      this.isArrayContent = Array.isArray(this.content);
    
    }
  }

  get contentAsArray(): string[] {
    return Array.isArray(this.content) ? this.content : [];
  }

  close() {
    this.closeModal.emit();
  }

}
