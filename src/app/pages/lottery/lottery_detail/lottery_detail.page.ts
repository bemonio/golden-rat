import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LotteryService } from '../../../services/lottery.service';

@Component({
  selector: 'app-lottery-detail',
  templateUrl: './lottery_detail.page.html',
  styleUrls: ['./lottery_detail.page.scss'],
})
export class LotteryDetailPage implements OnInit {
  mode: 'view' | 'edit' = 'view';
  lotteryId: number = 0;
  lotteryForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private lotteryService: LotteryService
  ) {
    this.lotteryForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      type: ['', Validators.required],
    });
  }

  async ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (this.route.snapshot.url[0].path === 'add') {
      this.mode = 'edit';
    } else if (idParam) {
      this.lotteryId = Number(idParam);
      this.mode = this.route.snapshot.url[1].path as 'view' | 'edit';

      if (this.lotteryId) {
        const lottery = await this.lotteryService.getLotteryById(this.lotteryId);
        if (lottery) {
          this.lotteryForm.patchValue(lottery);
        }
      }
    }
  }

  async save() {
    if (this.lotteryForm.invalid) {
      alert('Por favor, completa todos los campos correctamente.');
      return;
    }

    if (this.lotteryId) {
      await this.lotteryService.updateLottery({ id: this.lotteryId, ...this.lotteryForm.value });
    } else {
      await this.lotteryService.addLottery(this.lotteryForm.value);
    }
    this.router.navigate(['/lottery']);
  }
}
