import { Component } from '@angular/core';

@Component({
  selector: 'app-report-list',
  templateUrl: './report_list.page.html',
  styleUrls: ['./report_list.page.scss'],
})
export class ReportPage {
  reports = [
    { title: 'Ventas', icon: 'stats-chart-outline', route: '/report/sales' },
    { title: 'Loterías Más Jugadas', icon: 'layers-outline', route: '/report/lotteries' },
    { title: 'Clientes Frecuentes', icon: 'people-outline', route: '/report/customers' },
    { title: 'Resultados Frecuentes', icon: 'trophy-outline', route: '/report/results' },
    { title: 'Resumen Financiero', icon: 'cash-outline', route: '/report/financial' }
  ];
}