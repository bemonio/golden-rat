import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LotteryMultiplierService } from '../../../services/lottery_multiplier.service';
import { LotteryService } from '../../../services/lottery.service';
import { LotteryMultiplier } from '../../../interfaces/lottery_multiplier.interface';
import { Lottery } from '../../../interfaces/lottery.interface';

@Component({
  selector: 'app-lottery-multiplier-detail',
  templateUrl: './lottery_multiplier_detail.page.html',
  styleUrls: ['./lottery_multiplier_detail.page.scss'],
})
export class LotteryMultiplierDetailPage implements OnInit {
  mode: 'view' | 'edit' = 'view';
  multiplierId: number = 0;
  multiplier: LotteryMultiplier = {
    id: 0,
    lottery_id: 0,
    type: 'animalito',
    multiplier: 1
  };

  multiplierForm: FormGroup;
  lotteries: Lottery[] = [];
  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private lotteryMultiplierService: LotteryMultiplierService,
    private lotteryService: LotteryService
  ) {
    this.multiplierForm = this.fb.group({
      lottery_id: [null, [Validators.required]],
      type: ['animalito', [Validators.required]],
      multiplier: [1, [Validators.required, Validators.min(1)]],
    });
  }

  async ngOnInit() {
    this.isLoading = true;
    try {
      this.lotteries = await this.lotteryService.getAllLotteries();

      const idParam = this.route.snapshot.paramMap.get('id');
      if (this.route.snapshot.url[0].path === 'add') {
        this.mode = 'edit';
      } else if (idParam) {
        this.multiplierId = Number(idParam);
        this.mode = this.route.snapshot.url[1]?.path as 'view' | 'edit' || 'view';
        await this.loadMultiplierData();
      }
    } catch (error) {
      console.error('Error loading multiplier data:', error);
    } finally {
      this.isLoading = false;
    }
  }

  async loadMultiplierData() {
    try {
      this.isLoading = true;
      const multiplier = await this.lotteryMultiplierService.getLotteryMultiplierById(this.multiplierId);
      if (multiplier) {
        this.multiplier = multiplier;
        this.multiplierForm.patchValue(this.multiplier);
      }
    } catch (error) {
      console.error('Error loading multiplier data:', error);
    } finally {
      this.isLoading = false;
    }
  }

  async saveMultiplier() {
    if (this.multiplierForm.invalid) {
      alert('Por favor, completa todos los campos correctamente.');
      return;
    }

    const multiplierData = this.multiplierForm.value;

    try {
      if (this.multiplierId) {
        await this.lotteryMultiplierService.updateLotteryMultiplier({ id: this.multiplierId, ...multiplierData });
      } else {
        await this.lotteryMultiplierService.addLotteryMultiplier(multiplierData);
      }

      this.router.navigate(['/lottery_multiplier']);
    } catch (error) {
      console.error('Error saving multiplier:', error);
      alert('Hubo un error al guardar el multiplicador.');
    }
  }

  getLotteryName(id: number): string {
    return this.lotteries.find(l => l.id === id)?.name || 'Desconocida';
  }
}
