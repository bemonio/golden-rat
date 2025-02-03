import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-datepicker-modal',
  templateUrl: './datepicker_modal.component.html',
  styleUrls: ['./datepicker_modal.component.scss']
})
export class DatePickerModalComponent {
  @Input() selectedDate: string = '';
  @Input() minDate?: string;
  @Input() maxDate?: string;
  @Input() includeMin?: boolean = true;
  @Input() includeMax?: boolean = true;

  constructor(private modalController: ModalController) {}

  confirmDate(event: any) {
    this.selectedDate = event.detail.value;
  }

  async closeModal(confirm: boolean) {
    await this.modalController.dismiss({
      confirmed: confirm,
      date: confirm ? this.selectedDate : null
    });
  }

  addOneDay(dateString: string): string {
    const date = new Date(dateString);
    date.setDate(date.getDate() + 1);
    return date.toISOString().split('T')[0];
  }

  subtractOneDay(dateString: string): string {
    const date = new Date(dateString);
    date.setDate(date.getDate() - 1);
    return date.toISOString().split('T')[0];
  }
}
