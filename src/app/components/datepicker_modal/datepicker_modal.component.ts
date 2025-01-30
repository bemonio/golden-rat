import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-datepicker-modal',
  templateUrl: './datepicker_modal.component.html',
  styleUrls: ['./datepicker_modal.component.scss']
})
export class DatePickerModalComponent {
  @Input() selectedDate: string = '';

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
}
