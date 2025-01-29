import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  {
    path: 'login',
    loadChildren: () =>
      import('./pages/login/login.module').then((m) => m.LoginModule),
  },
  {
    path: 'pos',
    loadChildren: () =>
      import('./pages/pos/pos.module').then((m) => m.PosModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'bet',
    loadChildren: () =>
      import('./pages/bet/bet.module').then((m) => m.BetModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'settings',
    loadChildren: () =>
      import('./pages/settings/settings.module').then((m) => m.SettingsModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'ticket',
    loadChildren: () =>
      import('./pages/ticket/ticket.module').then((m) => m.TicketModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'client',
    loadChildren: () =>
      import('./pages/client/client.module').then((m) => m.ClientModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'lottery',
    loadChildren: () =>
      import('./pages/lottery/lottery.module').then((m) => m.LotteryModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'lottery_schedule',
    loadChildren: () =>
      import('./pages/lottery_schedule/lottery_schedule.module').then((m) => m.LotteryScheduleModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'lottery_result',
    loadChildren: () =>
      import('./pages/lottery_result/lottery_result.module').then((m) => m.LotteryResultModule),
    canActivate: [AuthGuard],
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule],
})
export class AppRoutingModule {}