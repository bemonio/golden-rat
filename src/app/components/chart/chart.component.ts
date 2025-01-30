import { Component, Input, OnInit } from '@angular/core';
import { Chart, ChartConfiguration, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnInit {
  @Input() chartType: string = 'bar'; // 'bar' | 'line' | 'pie'
  @Input() chartData: any;
  @Input() chartLabels: any[] = [];

  chart: any;

  ngOnInit() {
    this.loadChart();
  }

  loadChart() {
    this.chart = new Chart('chartCanvas', {
      type: this.chartType as any,
      data: {
        labels: this.chartLabels,
        datasets: [{
          label: 'Gráfico',
          data: this.chartData,
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4CAF50', '#E91E63']
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { display: true } }
      }
    });
  }
}
