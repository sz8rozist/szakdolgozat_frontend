import { Component, ViewChild } from '@angular/core';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { NgToastService } from 'ng-angular-popup';
import { BaseChartDirective } from 'ng2-charts';
import { DietResponse } from 'src/app/model/DietResponse';
import { User } from 'src/app/model/User';
import { AuthService } from 'src/app/service/auth.service';
import { DietService } from 'src/app/service/diet.service';
import { GuestService } from 'src/app/service/guest.service';
import { NotificationService } from 'src/app/service/notification.service';
import DatalabelsPlugin from 'chartjs-plugin-datalabels';
import { Guest } from 'src/app/model/Guest';
import { faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-trainer-diary',
  templateUrl: './trainer-diary.component.html',
  styleUrls: ['./trainer-diary.component.css'],
})
export class TrainerDiaryComponent {
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;
  date: string = '';
  diet?: DietResponse;
  giveByTrainer: boolean = false;
  selectedGuest?: number;
  guests: Guest[] = [];
  sum: {
    calorie: number;
    carbonhydrate: number;
    protein: number;
    fat: number;
  } = {
    calorie: 0,
    carbonhydrate: 0,
    protein: 0,
    fat: 0,
  };
  faTrash = faTrash;
  faEdit = faEdit;
  public pieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
        position: 'bottom',
      },
      datalabels: {
        color: 'white',
        anchor: 'end',
        align: 'start',
        offset: 0,
        borderWidth: 2,
        borderColor: '#F44336',
        borderRadius: 4,
        backgroundColor: '#F44336',
        formatter: (value: any, ctx: any) => {
          if (ctx.chart.data.labels) {
            return ctx.chart.data.labels[ctx.dataIndex];
          }
        },
      },
    },
  };
  public pieChartData: ChartData<'pie', number[], string | string[]> = {
    labels: ['Szénhidrát', 'Fehérje', 'Zsír'],
    datasets: [
      {
        data: [1],
        backgroundColor: ['orange'],
      },
    ],
  };
  public pieChartType: ChartType = 'pie';
  constructor(
    private dietService: DietService,
    private authService: AuthService,
    private toast: NgToastService,
    private guestService: GuestService,
    private notificationService: NotificationService
  ) {}
  public pieChartPlugins = [DatalabelsPlugin];
  ngOnInit() {
    this.authService.getAuthData().subscribe((response: User) => {
      this.guestService
        .getTrainerGuests(response.trainer.id as number)
        .subscribe((resp: Guest[]) => {
          this.guests = [...resp];
        });
    });
  }

  loadDietByDate() {
    if (!this.selectedGuest) {
      this.toast.warning({
        detail: 'Figyelmeztetés',
        summary: 'Nincs kiválasztva vendég!',
        duration: 2000,
        type: 'warning',
      });
    }else{
      this.loadDiet(this.date, this.selectedGuest as number);
    }

  }

  changeGuest() {
    if (this.date && this.selectedGuest) {
      this.loadDiet(this.date, this.selectedGuest as number);
    }
  }

  loadDiet(date: string, guestId: number) {
    this.dietService
      .getDietByDateAndGuestId(guestId, date)
      .subscribe((resp: DietResponse) => {
        console.log(resp);
        this.giveByTrainer = (resp.diet &&
          resp.diet.every((workout) => workout.trainerId != 0)) as boolean;
        this.diet = resp;
        this.pieChartData.datasets[0].data = [];
        this.pieChartData.datasets[0].backgroundColor = [];
        this.pieChartData.datasets[0].backgroundColor = [
          'orange',
          'lightgreen',
          'lightblue',
        ];
        this.pieChartData.datasets[0].data.push(
          resp.carbonhydrateSum,
          resp.proteinSum,
          resp.fatSum
        );
        const totalCalories =
          resp.carbonhydrateSum + resp.proteinSum + resp.fatSum;
        const carbPercentage = (resp.carbonhydrateSum / totalCalories) * 100;
        const proteinPercentage = (resp.proteinSum / totalCalories) * 100;
        const fatPercentage = (resp.fatSum / totalCalories) * 100;
        this.pieChartData.labels = [
          `Szénhidrát: ${carbPercentage.toFixed(0)}%`,
          `Fehérje: ${proteinPercentage.toFixed(0)}%`,
          `Zsír: ${fatPercentage.toFixed(0)}%`,
        ];
        this.chart?.update();
      });
  }

  translateType(type: string) {
    switch (type) {
      case 'LUNCH':
        return 'Ebéd';
      case 'BREAKFAST':
        return 'Reggeli';
      case 'DINNER':
        return 'Vacsora';
      case 'SNACK':
        return 'Snack';
      default:
        return '';
    }
  }

  formatDateInput(event: any) {
    const input = event.target;
    const value = input.value.replace(/\D/g, ''); // Csak a számok megtartása
    if (value.length >= 8) {
      const formattedValue = value.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3');
      input.value = formattedValue;
      this.date = formattedValue;
    } else {
      input.value = value;
      this.date = value;
    }
  }

  deleteDiet() {
    this.authService.getAuthData().subscribe((response: User) => {
      if (response.trainer != null) {
        this.dietService
          .deleteDiet(this.selectedGuest as number, this.date)
          .subscribe(() => {
            this.loadDiet(this.date, this.selectedGuest as number);
            this.date = '';
            this.pieChartData.datasets[0].data = [];
            this.pieChartData.datasets[0].backgroundColor = [];
            this.pieChartData.datasets[0].backgroundColor = [
              'orange',
              'lightgreen',
              'lightblue',
            ];
            this.pieChartData.datasets[0].data.push(0, 0, 0);
            this.chart?.update();
            this.toast.success({
              detail: 'Sikeres',
              summary: 'Sikeres törlés!',
              duration: 2000,
              type: 'success',
            });
          });
      }
    });
  }

  removeFood(dietId: any) {
    this.authService.getAuthData().subscribe((response: User) => {
      if (response.trainer != null) {
        this.dietService
          .deleteFood(dietId, this.selectedGuest as number)
          .subscribe(() => {
            this.loadDiet(this.date, this.selectedGuest as number);
            this.pieChartData.datasets[0].data = [];
            this.pieChartData.datasets[0].backgroundColor = [];
            this.pieChartData.datasets[0].backgroundColor = [
              'orange',
              'lightgreen',
              'lightblue',
            ];
            this.pieChartData.datasets[0].data.push(0, 0, 0);
            this.chart?.update();
            this.toast.success({
              detail: 'Sikeres',
              summary: 'Sikeres törlés!',
              duration: 2000,
              type: 'success',
            });
          });
      }
    });
  }
}
