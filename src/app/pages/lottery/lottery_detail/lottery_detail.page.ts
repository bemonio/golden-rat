import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { LotteryService } from '../../../services/lottery.service';
import { LotteryOptionService } from '../../../services/lottery_option.service';
import { LotteryOption } from '../../../interfaces/lottery_option.interface';

@Component({
  selector: 'app-lottery-detail',
  templateUrl: './lottery_detail.page.html',
  styleUrls: ['./lottery_detail.page.scss'],
})
export class LotteryDetailPage implements OnInit {
  mode: 'view' | 'edit' = 'view';
  lotteryId: number = 0;
  lotteryForm: FormGroup;
  options: LotteryOption[] = [];
  newOption: LotteryOption = { lotteryId: 0, name: '', type: ''};

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private alertController: AlertController,
    private lotteryService: LotteryService,
    private lotteryOptionService: LotteryOptionService
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
          this.options = await this.lotteryOptionService.getLotteryOptionsByLotteryId(this.lotteryId);
        }
      }
    }
  }

  async saveLottery() {
    if (this.lotteryForm.invalid) {
      alert('Por favor, completa todos los campos correctamente.');
      return;
    }
  
    const lotteryData = this.lotteryForm.value;
  
    if (this.lotteryId) {
      await this.lotteryService.updateLottery({ id: this.lotteryId, ...lotteryData });
    } else {
      const createdLottery = await this.lotteryService.addLottery(lotteryData);
  
      if (createdLottery.id !== undefined) {
        this.lotteryId = createdLottery.id;
  
        const optionsWithLotteryId = this.options.map(option => ({
          ...option,
          lotteryId: this.lotteryId,
        }));
  
        await this.lotteryOptionService.addMultipleOptions(this.lotteryId, optionsWithLotteryId);
      } else {
        console.error('El objeto creado no contiene un ID.');
        alert('Hubo un problema al crear la lotería. Por favor, intenta de nuevo.');
        return;
      }
    }
  
    this.router.navigate(['/lottery']);
  }  
  
  async addLotteryOption() {
    if (!this.newOption.name) {
      alert('Por favor, completa todos los campos de la nueva opción.');
      return;
    }
    this.newOption.lotteryId = this.lotteryId;
    await this.lotteryOptionService.addLotteryOption(this.newOption);
    this.options = await this.lotteryOptionService.getLotteryOptionsByLotteryId(this.lotteryId);
    this.newOption = { lotteryId: 0, name: '', type: ''};
  }

  async updateLotteryOption(option: LotteryOption) {
    await this.lotteryOptionService.updateLotteryOption(option);
    this.options = await this.lotteryOptionService.getLotteryOptionsByLotteryId(this.lotteryId);
  }

  async deleteLotteryOption(id: number) {
    const alert = await this.alertController.create({
      header: 'Confirmar eliminación',
      message: '¿Estás seguro de que deseas eliminar?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: async () => {
            await this.lotteryOptionService.deleteLotteryOption(id);
            this.options = await this.lotteryOptionService.getLotteryOptionsByLotteryId(this.lotteryId);
          },
        },
      ],
    });
  
    await alert.present();
  }

  onTypeChange(type: '2 digits' | '3 digits' | 'animal') {
    if (this.mode === 'edit' && !this.lotteryId) {
      this.options = this.lotteryOptionService.generateOptions(type, this.lotteryId);
    }
  }  
}
