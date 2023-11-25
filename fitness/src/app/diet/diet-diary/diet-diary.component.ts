import { Component, ViewChild } from '@angular/core';
import { DietService } from '../../service/diet.service';
import { AuthService } from '../../service/auth.service';
import { DietResponse } from '../../model/DietResponse';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { NgToastService } from 'ng-angular-popup';
import { User } from 'src/app/model/User';
import { SocketDietDto } from 'src/app/model/dto/SocketDietDto';
import { DietDto } from 'src/app/model/dto/DietDto';
import { GuestService } from 'src/app/service/guest.service';
import { Trainer } from 'src/app/model/Trainer';
import { NotificationService } from 'src/app/service/notification.service';
@Component({
  selector: 'app-diet-diary',
  templateUrl: './diet-diary.component.html',
  styleUrls: ['./diet-diary.component.css'],
})
export class DietDiaryComponent {
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;
  date: string = '';
  diet?: DietResponse;
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
  public pieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
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

  ngOnInit() {}

  loadDietByDate() {
    this.loadDiet(this.date);
  }

  loadDiet(date: string) {
    this.authService.getAuthData().subscribe((response: User) => {
      if (response.guest != null) {
        this.dietService
          .getDietByDateAndGuestId(response.guest.id as number, date)
          .subscribe((resp: DietResponse) => {
            console.log(resp);
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
            const carbPercentage =
              (resp.carbonhydrateSum / totalCalories) * 100;
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
      if (response.guest != null) {
        this.dietService
          .deleteDiet(response.guest.id as number, this.date)
          .subscribe(() => {
            this.loadDiet(this.date);
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
      if (response.guest != null) {
        this.dietService
          .deleteFood(dietId, response.guest.id as number)
          .subscribe(() => {
            this.loadDiet(this.date);
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

  sendNotificationToTrainer(food: DietDto){
    console.log(food.foodId);
    const token = this.authService.getDecodedToken();
    const trainer = this.guestService.findTrainer(token.sub).toPromise();
    trainer.then((response: Trainer | any) =>{
      //console.log(response);
      const data: SocketDietDto = {
        guestId: token.sub as number,
        trainerId: response.id,
        foodId: food.foodId,
        dietId: food.dietId
      }
      this.notificationService.sendNotificationToTrainer(data);
      this.loadDiet(this.date);
    }, error =>{
      console.log(error.mesage);
    });
  }
}
