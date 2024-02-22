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
import DatalabelsPlugin from 'chartjs-plugin-datalabels';
import {
  faCheck,
  faEdit,
  faTrash,
  faUtensils,
} from '@fortawesome/free-solid-svg-icons';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalComponent } from 'src/app/components/modal/modal.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Diet } from 'src/app/model/Diet';
import { Food } from 'src/app/model/Food';
import { DietUpdateRequest } from 'src/app/model/DietUpdateRequest';
@Component({
  selector: 'app-diet-diary',
  templateUrl: './diet-diary.component.html',
  styleUrls: ['./diet-diary.component.css'],
})
export class DietDiaryComponent {
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;
  date: string = '';
  diet?: DietResponse;
  giveByTrainer: boolean = false;
  faTrash = faTrash;
  faEdit = faEdit;
  faUtensil = faUtensils;
  faCheck = faCheck;
  dietId?: number;
  @ViewChild('modalRef') modalRef!: ModalComponent;
  foodForm: FormGroup;
  dietForm: FormGroup;
  diets?: Diet;
  foods?: Food[];
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
    private notificationService: NotificationService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.foodForm = new FormGroup({
      foodId: new FormControl('', [Validators.required]),
      calorie: new FormControl('', [
        Validators.required,
        Validators.pattern('^[0-9]*$'),
      ]),
      protein: new FormControl('', [
        Validators.required,
        Validators.pattern('^[0-9]*$'),
      ]),
      carbonhydrate: new FormControl('', [
        Validators.required,
        Validators.pattern('^[0-9]*$'),
      ]),
      fat: new FormControl('', [
        Validators.required,
        Validators.pattern('^[0-9]*$'),
      ]),
    });
    this.dietForm = new FormGroup({
      quantity: new FormControl('', [
        Validators.required,
        Validators.pattern('^[0-9]*$'),
      ]),
      type: new FormControl('', [Validators.required]),
      date: new FormControl('', [Validators.required]),
    });
  }
  public pieChartPlugins = [DatalabelsPlugin];
  ngOnInit() {
    const date = this.route.snapshot.paramMap.get('date');
    if (date) {
      this.date = date;
      this.loadDiet(date);
    }
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

  sendNotificationToTrainer(food: DietDto) {
    const token = this.authService.getDecodedToken();
    const trainer = this.guestService.findTrainer(token.sub).toPromise();
    trainer.then(
      (response: Trainer | any) => {
        if (response != null) {
          const data: SocketDietDto = {
            guestId: token.sub as number,
            trainerId: response.id,
            foodId: food.foodId,
            dietId: food.dietId,
          };
          this.notificationService.sendNotificationToTrainer(data);
          var item = this.diet?.diet.find((item) => item.foodId == food.foodId);
          if (item) {
            item.eated = true;
          }
        } else {
          this.dietService.setEated(food.dietId).subscribe(
            (response) => {
              if (response.status == 204) {
                var item = this.diet?.diet.find(
                  (item) => item.foodId == food.foodId
                );
                if (item) {
                  item.eated = true;
                }
              }
            },
            (error) => console.log(error)
          );
        }
      },
      (error) => {
        console.log(error.mesage);
      }
    );
  }

  openEditModal(id: number) {
    this.dietId = id;
    this.modalRef.openModal();
    this.loadFoods();
    this.loadDietToForm();
  }

  loadFoods() {
    this.dietService.getAllFoodWithoutPagination().subscribe((food: Food[]) => {
      this.foods = [...food];
    });
  }

  loadDietToForm() {
    if (this.dietId) {
      this.dietService
        .getDietById(Number(this.dietId))
        .subscribe((response: Diet) => {
          if (response) {
            this.diets = response;
            this.patchFoodForm(this.diets.food);
            this.patchDietForm(this.diets);
          }
        });
    }
  }

  patchFoodForm(food: any) {
    this.foodForm.patchValue({
      foodId: food.id,
      calorie: food.calorie,
      protein: food.protein,
      carbonhydrate: food.carbonhydrate,
      fat: food.fat,
    });
  }

  patchDietForm(diet: any) {
    this.dietForm.patchValue({
      quantity: diet.quantity,
      type: diet.type,
      date: diet.date,
    });
  }

  onSelectChange(event: Event) {
    const selectedValue = (event.target as HTMLSelectElement).value;
    this.dietService
      .getFoodById(Number(selectedValue))
      .subscribe((response: Food) => {
        if (response) {
          this.patchFoodForm(response);
        }
      });
  }

  saveEtkezes() {
    if (this.dietForm.valid && this.foodForm.valid) {
      const diet: DietUpdateRequest = {
        foodId: this.foodForm.get('foodId')?.value,
        quantity: this.dietForm.get('quantity')?.value,
        date: this.dietForm.get('date')?.value,
        type: this.dietForm.get('type')?.value,
      };
      this.dietService
        .updateDiet(diet, this.diets?.id as number)
        .subscribe(() => {
          this.toast.success({
            detail: 'Sikeres',
            summary: 'Sikeres frissítés',
            duration: 2000,
            type: 'success',
          });
          this.modalRef.closeModal();
          this.loadDiet(this.date);
        });
    }
  }

  
}
