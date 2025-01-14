import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-lottery-detail',
  templateUrl: './lottery_detail.page.html',
  styleUrls: ['./lottery_detail.page.scss'],
})
export class LotteryDetailPage implements OnInit {
  mode: 'view' | 'edit' = 'view';
  lotteryId: number = 0;
  lotteryData = { name: '', type: '' }; // Inicialización de la propiedad lotteryData

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');
    this.lotteryId = idParam ? Number(idParam) : 0;
    this.mode = this.route.snapshot.url[1].path as 'view' | 'edit';

    // Simulación de carga de datos para edición o visualización
    if (this.mode === 'edit' || this.mode === 'view') {
      this.lotteryData = this.getLotteryById(this.lotteryId);
    }
  }

  getLotteryById(id: number) {
    // Simulación de obtención de datos, en el futuro será reemplazado por el servicio
    const mockLotteries = [
      { id: 1, name: 'Lotería 1', type: 'number' },
      { id: 2, name: 'Lotería 2', type: 'animal' },
    ];
    return mockLotteries.find((lottery) => lottery.id === id) || { name: '', type: '' };
  }

  save() {
    // Lógica para guardar la lotería
    console.log('Guardando lotería:', this.lotteryData);
    this.router.navigate(['/lottery']);
  }
}