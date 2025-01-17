import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LotteryScheduleService } from '../../../services/lottery_schedule.service';
import { LotteryService } from '../../../services/lottery.service';
import { Lottery } from '../../../interfaces/lottery.interface';

@Component({
  selector: 'app-lottery-schedule-detail',
  templateUrl: './lottery_schedule_detail.page.html',
  styleUrls: ['./lottery_schedule_detail.page.scss'],
})
export class LotteryScheduleDetailPage implements OnInit {
  mode: 'view' | 'edit' = 'view';
  lotteryScheduleId: number = 0;
  lotteryScheduleForm: FormGroup;
  lotteries: Lottery[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private lotteryScheduleService: LotteryScheduleService,
    private lotteryService: LotteryService
  ) {
    this.lotteryScheduleForm = this.fb.group({
      lotteryId: [null, [Validators.required]],
      dayOfWeek: ['', [Validators.required]],
      time: ['', Validators.required],
    });
  }

  async ngOnInit() {
    // Cargar loterías disponibles
    this.lotteries = await this.lotteryService.getAllLotteries();

    if (this.lotteries.length === 0) {
      return;
    }

    const idParam = this.route.snapshot.paramMap.get('id');
    if (this.route.snapshot.url[0].path === 'add') {
      this.mode = 'edit';
    } else if (idParam) {
      this.lotteryScheduleId = Number(idParam);
      this.mode = this.route.snapshot.url[1].path as 'view' | 'edit';

      if (this.lotteryScheduleId) {
        const lotterySchedule = await this.lotteryScheduleService.getLotteryScheduleById(this.lotteryScheduleId);
        if (lotterySchedule) {
          this.lotteryScheduleForm.patchValue(lotterySchedule);
        }
      }
    }
  }

  async saveLotterySchedule() {
    if (this.lotteryScheduleForm.invalid) {
      alert('Por favor, completa todos los campos correctamente.');
      return;
    }

    let lotteryScheduleData = this.lotteryScheduleForm.value;

    if (lotteryScheduleData.time) {
      const selectedTime = new Date(lotteryScheduleData.time);
      const hours = selectedTime.getHours().toString().padStart(2, '0');
      const minutes = selectedTime.getMinutes().toString().padStart(2, '0');
      lotteryScheduleData.time = `${hours}:${minutes}`;
    }

    if (this.lotteryScheduleId) {
      await this.lotteryScheduleService.updateLotterySchedule({ id: this.lotteryScheduleId, ...lotteryScheduleData });
    } else {
      const createdLotterySchedule = await this.lotteryScheduleService.addLotterySchedule(lotteryScheduleData);
      if (createdLotterySchedule.id !== undefined) {
        this.lotteryScheduleId = createdLotterySchedule.id;
      } else {
        console.error('El objeto creado no contiene un ID.');
        alert('Hubo un problema al crear el horario de la lotería. Por favor, intenta de nuevo.');
        return;
      }
    }

    this.router.navigate(['/lottery_schedule']);
  }

  getLotteryName(): string {
    const lotteryId = this.lotteryScheduleForm.get('lotteryId')?.value;
    const lottery = this.lotteries.find((lottery) => lottery.id === lotteryId);
    return lottery ? lottery.name : 'No definida';
  }
}