
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule, Routes } from '@angular/router';
import { ReportPage } from './report_list/report_list.page';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ChartComponentModule } from '../../components/chart/chart_component.module';
import { ReportSalesPage } from './report_sales/report_sales.page';
import { ReportLotteriesPage } from './report_lotteries/report_lotteries.page';
import { ReportCustomersPage } from './report_customers/report_customers.page';
import { ReportResultsPage } from './report_results/report_results.page';
import { ReportFinancialPage } from './report_financial/report_financial.page';
import { ReportPendingPaymentsPage } from './report_pending_payments/report_pending_payments.page';

const routes: Routes = [
  { path: '', component: ReportPage },
  { path: 'pending_payments', component: ReportPendingPaymentsPage },
  { path: 'sales', component: ReportSalesPage },
  { path: 'lotteries', component: ReportLotteriesPage },
  { path: 'customers', component: ReportCustomersPage },
  { path: 'results', component: ReportResultsPage },
  { path: 'financial', component: ReportFinancialPage }
];

@NgModule({
  declarations: [
    ReportPage,
    ReportSalesPage,
    ReportLotteriesPage,
    ReportCustomersPage,
    ReportResultsPage,
    ReportFinancialPage,
    ReportPendingPaymentsPage
  ],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    ChartComponentModule
  ]
})
export class ReportModule { }
