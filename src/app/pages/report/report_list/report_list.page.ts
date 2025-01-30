import { Component } from '@angular/core';

@Component({
  selector: 'app-report-list',
  templateUrl: './report_list.page.html',
  styleUrls: ['./report_list.page.scss'],
})
export class ReportPage {
  reports = [
    { title: 'Sales', icon: 'stats-chart-outline', route: '/report/sales' },
    { title: 'Most Played Lotteries', icon: 'layers-outline', route: '/report/lotteries' },
    { title: 'Frequent Customers', icon: 'people-outline', route: '/report/customers' },
    { title: 'Frequent Results', icon: 'trophy-outline', route: '/report/results' }
  ];
}
