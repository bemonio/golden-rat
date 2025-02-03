import { Injectable } from '@angular/core';
import { ClientService } from './client.service';
import { LotteryService } from './lottery.service';
import { LotteryScheduleService } from './lottery_schedule.service';
import { LotteryMultiplierService } from './lottery_multiplier.service';
import { LotteryOptionService } from './lottery_option.service';
import { TicketService } from './ticket.service';
import { BetService } from './bet.service';
import { LotteryResultService } from './lottery_result.service';
import { Client } from '../interfaces/client.interface';
import { Lottery } from '../interfaces/lottery.interface';
import { LotterySchedule } from '../interfaces/lottery_schedule.interface';
import { LotteryMultiplier } from '../interfaces/lottery_multiplier.interface';
import { LotteryOption } from '../interfaces/lottery_option.interface';
import { Ticket } from '../interfaces/ticket.interface';
import { Bet } from '../interfaces/bet.interface';
import { LotteryResult } from '../interfaces/lottery_result.interface';

@Injectable({
  providedIn: 'root',
})
export class DemoService {
  constructor(
    private clientService: ClientService,
    private lotteryService: LotteryService,
    private lotteryScheduleService: LotteryScheduleService,
    private lotteryMultiplierService: LotteryMultiplierService,
    private lotteryOptionService: LotteryOptionService,
    private ticketService: TicketService,
    private betService: BetService,
    private lotteryResultService: LotteryResultService
  ) {}

  async generateDemoData() {
    try {
      const clients: Client[] = [
        { name: 'Juan Pérez', alias: 'JP', phone: '123-456-7890' },
        { name: 'María Gómez', alias: 'MG', phone: '987-654-3210' },
        { name: 'Carlos Rodríguez', alias: 'CR', phone: '555-555-5555' },
        { name: 'Ana Torres', alias: 'AT', phone: '222-333-4444' },
        { name: 'Luis Martínez', alias: 'LM', phone: '777-888-9999' }
      ];
      for (const client of clients) {
        await this.clientService.addClient(client);
      }

      const lotteries: Lottery[] = [
        { name: 'Lotería Nacional', type: 'triple' },
        { name: 'Animalitos', type: 'animal' },
        { name: 'Mega Chance', type: 'terminal' }
      ];
      for (let i = 0; i < lotteries.length; i++) {
        const createdLottery = await this.lotteryService.addLottery(lotteries[i]);
        lotteries[i].id = createdLottery.id;

        const options = this.lotteryOptionService.generateOptions(createdLottery.type, createdLottery.id!);
        await this.lotteryOptionService.addMultipleOptions(createdLottery.id!, options);
      }

      const multipliers: LotteryMultiplier[] = [
        { lottery_id: 1, type: 'triple', multiplier: 10 },
        { lottery_id: 2, type: 'animal', multiplier: 5 },
        { lottery_id: 3, type: 'terminal', multiplier: 8 }
      ];
      for (const multiplier of multipliers) {
        await this.lotteryMultiplierService.addLotteryMultiplier(multiplier);
      }

      const schedules: LotterySchedule[] = [];
      const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      for (const day of days) {
        const drawsPerDay = day === 'Saturday' ? 1 : 2;
        for (let i = 0; i < drawsPerDay; i++) {
          schedules.push({ dayOfWeek: day, time: ['12:00', '15:00', '18:00', '21:00'][i], lotteryId: 1, isActive: true });
        }
      }
      for (let i = 0; i < schedules.length; i++) {
        const createdSchedule = await this.lotteryScheduleService.addLotterySchedule(schedules[i]);
        schedules[i].id = createdSchedule.id;
      }

      for (let day = 0; day < 3; day++) {
        for (let ticketNum = 0; ticketNum < 20; ticketNum++) {
          const ticket: Ticket = {
            client_id: Math.floor(Math.random() * 5) + 1,
            total_amount: Math.floor(Math.random() * 100) + 10,
            status: 'pending',
            payout_amount: 0,
            is_paid: false
          };
          const createdTicket = await this.ticketService.addTicket(ticket, []);

          const betsCount = Math.floor(Math.random() * 5) + 1;
          for (let betNum = 0; betNum < betsCount; betNum++) {
            const bet: Bet = {
              ticket_id: createdTicket.id!,
              lottery_id: Math.floor(Math.random() * 3) + 1,
              schedule_id: Math.floor(Math.random() * schedules.length) + 1,
              option_id: Math.floor(Math.random() * 10) + 1,
              amount: Math.floor(Math.random() * 50) + 5,
              date: new Date().toISOString().split('T')[0],
              status: 'pending',
              type: Math.random() < 0.33 ? 'animal' : Math.random() < 0.66 ? 'triple' : 'terminal',
              multiplier: 1,
              payout_amount: 0,
              is_paid: false
            };
            await this.betService.addBet(bet);
          }
        }
      }

      const results: LotteryResult[] = [];
      for (let day = 0; day < 3; day++) {
        for (const schedule of schedules) {
          for (const lottery of lotteries) {
            results.push({
              lottery_id: lottery.id ?? 1,
              lottery_schedule_id: schedule.id ?? 1,
              lottery_option_id: Math.floor(Math.random() * 10) + 1,
              date: new Date(new Date().setDate(new Date().getDate() - day)).toISOString().split('T')[0]
            });
          }
        }
      }
      
      for (const result of results) {
        await this.lotteryResultService.addLotteryResult(result);
      }

      console.log('Datos de demostración generados exitosamente.');
    } catch (error) {
      console.error('Error al generar datos de demostración:', error);
    }
  }
}