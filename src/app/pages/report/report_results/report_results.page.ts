import { Component, OnInit } from '@angular/core';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import { LotteryResultService } from '../../../services/lottery_result.service';
import { LotteryOptionService } from '../../../services/lottery_option.service';

Chart.register(...registerables);

@Component({
  selector: 'app-report-results',
  templateUrl: './report_results.page.html',
  styleUrls: ['./report_results.page.scss']
})
export class ReportResultsPage implements OnInit {
  resultData: number[] = [];
  resultLabels: string[] = [];

  constructor(
    private lotteryResultService: LotteryResultService,
    private lotteryOptionService: LotteryOptionService
  ) {}

  async ngOnInit() {
    await this.loadResultData();
    this.loadChart();
  }

  async loadResultData() {
    const results = await this.lotteryResultService.getAllLotteryResults();
    const options = await this.lotteryOptionService.getAllLotteryOptions();

    const resultCount: { [key: number]: number } = {};

    results.forEach(result => {
      if (!resultCount[result.lottery_option_id]) {
        resultCount[result.lottery_option_id] = 0;
      }
      resultCount[result.lottery_option_id] += 1;
    });

    // 🔹 Mapear IDs a nombres de opciones
    this.resultLabels = Object.keys(resultCount).map(id => {
      const option = options.find(o => o.id === Number(id));
      return option ? option.name : `Opción ${id}`;
    });

    this.resultData = Object.values(resultCount);
  }

  loadChart() {
    new Chart('resultsChartCanvas', {
      type: 'bar',
      data: {
        labels: this.resultLabels,
        datasets: [{
          label: 'Resultados Frecuentes',
          data: this.resultData,
          backgroundColor: ['#36A2EB', '#FF6384', '#FFCE56', '#4CAF50', '#E91E63']
        }]
      },
      options: { responsive: true }
    });
  }
}
