import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LotteryResultService } from '../../../services/lottery_result.service';
import { LotteryService } from '../../../services/lottery.service';
import { LotteryScheduleService } from '../../../services/lottery_schedule.service';
import { LotteryOptionService } from '../../../services/lottery_option.service';
import { LotteryResult } from '../../../interfaces/lottery_result.interface';
import { Lottery } from '../../../interfaces/lottery.interface';
import { LotterySchedule } from '../../../interfaces/lottery_schedule.interface';
import { LotteryOption } from '../../../interfaces/lottery_option.interface';
import { ModalController } from '@ionic/angular';
import { DatePickerModalComponent } from '../../../components/datepicker_modal/datepicker_modal.component';

@Component({
  selector: 'app-lottery-result-detail',
  templateUrl: './lottery_result_detail.page.html',
  styleUrls: ['./lottery_result_detail.page.scss'],
})
export class LotteryResultDetailPage implements OnInit {
  mode: 'view' | 'edit' = 'view';
  lotteryResultId: number = 0;
  lotteryResult: LotteryResult = {
    id: 0,
    lottery_id: 0,
    lottery_schedule_id: 0,
    lottery_option_id: 0,
    date: new Date().toISOString().split('T')[0],
    created_at: new Date().toISOString()
  };

  lotteryResultForm: FormGroup;
  lotteries: Lottery[] = [];
  lotterySchedules: LotterySchedule[] = [];
  lotteryOptions: LotteryOption[] = [];
  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private lotteryResultService: LotteryResultService,
    private lotteryService: LotteryService,
    private scheduleService: LotteryScheduleService,
    private optionService: LotteryOptionService,
    private modalController: ModalController
  ) {
    this.lotteryResultForm = this.fb.group({
      lottery_id: [null, [Validators.required]],
      lottery_schedule_id: [null, [Validators.required]],
      lottery_option_id: [null, [Validators.required]],
      date: [new Date().toISOString().split('T')[0], [Validators.required]]
    });
  }

  async ngOnInit() {
    this.isLoading = true;
    try {
      [this.lotteries, this.lotterySchedules, this.lotteryOptions] = await Promise.all([
        this.lotteryService.getAllLotteries(),
        this.scheduleService.getAllLotterySchedules(),
        this.optionService.getAllLotteryOptions(),
      ]);

      const idParam = this.route.snapshot.paramMap.get('id');
      if (this.route.snapshot.url[0].path === 'add') {
        this.mode = 'edit';
      } else if (idParam) {
        this.lotteryResultId = Number(idParam);
        this.mode = this.route.snapshot.url[1]?.path as 'view' | 'edit' || 'view';
        await this.loadLotteryResultData();
      }
    } catch (error) {
      console.error('Error loading lottery data:', error);
    } finally {
      this.isLoading = false;
    }
  }

  async loadLotteryResultData() {
    try {
      this.isLoading = true;
      const result = await this.lotteryResultService.getLotteryResultById(this.lotteryResultId);
      if (result) {
        this.lotteryResult = result;
        this.lotteryResultForm.patchValue(this.lotteryResult);
      }
    } catch (error) {
      console.error('Error loading lottery result data:', error);
    } finally {
      this.isLoading = false;
    }
  }

  async saveLotteryResult() {
    if (this.lotteryResultForm.invalid) {
      alert('Por favor, completa todos los campos correctamente.');
      return;
    }

    const lotteryResultData = this.lotteryResultForm.value;

    try {
      if (this.lotteryResultId) {
        await this.lotteryResultService.updateLotteryResult({ id: this.lotteryResultId, ...lotteryResultData });
      } else {
        await this.lotteryResultService.addLotteryResult(lotteryResultData);
      }

      this.router.navigate(['/lottery_result']);
    } catch (error) {
      console.error('Error saving lottery result:', error);
      alert('Hubo un error al guardar el resultado de lotería.');
    }
  }

  getLotteryName(id: number): string {
    return this.lotteries.find(l => l.id === id)?.name || 'Desconocida';
  }

  getScheduleTime(id: number): string {
    return this.lotterySchedules.find(s => s.id === id)?.time || 'N/A';
  }

  getOptionName(id: number): string {
    return this.lotteryOptions.find(o => o.id === id)?.name || 'N/A';
  }

  async openDatePicker() {
    const modal = await this.modalController.create({
      component: DatePickerModalComponent,
      componentProps: { selectedDate: this.lotteryResultForm.get('date')?.value }
    });

    await modal.present();
    const { data } = await modal.onWillDismiss();

    if (data?.confirmed) {
      this.lotteryResultForm.patchValue({ date: data.date });
    }
  }
}
