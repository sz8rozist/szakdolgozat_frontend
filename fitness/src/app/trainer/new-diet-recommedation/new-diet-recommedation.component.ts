import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { DietRecommendation } from 'src/app/model/DietRecommendation';
import { Guest } from 'src/app/model/Guest';
import { NutiritonRequest } from 'src/app/model/NutiritonRequest';
import { Nutiriton } from 'src/app/model/Nutrition';
import { AuthService } from 'src/app/service/auth.service';
import { DietRecommendationService } from 'src/app/service/diet-recommendation.service';
import { GuestService } from 'src/app/service/guest.service';

@Component({
  selector: 'app-new-diet-recommedation',
  templateUrl: './new-diet-recommedation.component.html',
  styleUrls: ['./new-diet-recommedation.component.css'],
})
export class NewDietRecommedationComponent {
  guestId: any;
  dietRecommedationForm: FormGroup;
  nutiriton?: Nutiriton;
  constructor(
    private route: ActivatedRoute,
    private toast: NgToastService,
    private dietRecommendationService: DietRecommendationService,
    private authService: AuthService,
    private router: Router,
    private guestService: GuestService
  ) {
    this.dietRecommedationForm = new FormGroup({
      date: new FormControl('', [Validators.required]),
      bodyWeight: new FormControl('', [
        Validators.required,
        Validators.pattern('^[0-9]*$'),
      ]),
      ch_szazalek: new FormControl('', [Validators.pattern('^[0-9]*$')]),
      fat_szazalek: new FormControl('', [Validators.pattern('^[0-9]*$')]),
      feherje_szazalek: new FormControl('', [Validators.pattern('^[0-9]*$')]),
      calorie: new FormControl('', [
        Validators.required,
        Validators.pattern('^[0-9]*$'),
      ]),
      carbonhydrate: new FormControl('', [
        Validators.required,
        Validators.pattern('^[0-9]*$'),
      ]),
      protein: new FormControl('', [
        Validators.required,
        Validators.pattern('^[0-9]*$'),
      ]),
      fat: new FormControl('', [
        Validators.required,
        Validators.pattern('^[0-9]*$'),
      ]),
      age: new FormControl(''),
      height: new FormControl('')
    });
  }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      const id = params['guestId'];
      // Most itt kezelheted a kapott paramétert
      console.log('Routing paraméter - guestId:', id);
      this.guestId = id;
      this.guestService.getById(id).subscribe((response: Guest) =>{
        console.log(response);
        if(response){
          this.dietRecommedationForm.patchValue({
            age: response.age == null ? 0 : response.age,
            height: response.height
          });
        }
      });
    });
  }

  onSubmit() {
    if (this.dietRecommedationForm.valid) {
      const dietRecommendation: DietRecommendation = {
        date: this.dietRecommedationForm.get('date')?.value,
        calorie: this.dietRecommedationForm.get('calorie')?.value,
        carbonhydrate: this.dietRecommedationForm.get('carbonhydrate')?.value,
        protein: this.dietRecommedationForm.get('protein')?.value,
        fat: this.dietRecommedationForm.get('fat')?.value,
        bodyWeight: this.dietRecommedationForm.get('bodyWeight')?.value
      };
      const token = this.authService.getDecodedToken();
      this.dietRecommendationService
        .saveRecommendation(dietRecommendation, this.guestId, token.sub)
        .subscribe(
          (response: DietRecommendation) => {
            if (response) {
              this.dietRecommedationForm.reset();
              this.toast.success({
                detail: 'Sikeres',
                summary: 'Sikeres mentés!',
                duration: 2000,
                type: 'success',
              });
              this.router.navigate([
                '/trainer/dietRecommedation',
                this.guestId,
              ]);
            }
          },
          (error) => {
            console.log(error);
            this.toast.error({
              detail: 'Hiba',
              summary: 'Váratlan hiba történt a mentés közben!',
              duration: 2000,
              type: 'error',
            });
          }
        );
    }
  }

  calculateNutritions() {
    if (
      this.dietRecommedationForm.get('bodyWeight')?.value &&
      this.dietRecommedationForm.get('age')?.value &&
      this.dietRecommedationForm.get('ch_szazalek')?.value &&
      this.dietRecommedationForm.get('fat_szazalek')?.value &&
      this.dietRecommedationForm.get('feherje_szazalek')?.value
    ) {

      const data: NutiritonRequest = {
        bodyWeight: this.dietRecommedationForm.get('bodyWeight')?.value,
        chSzazalek: this.dietRecommedationForm.get('ch_szazalek')?.value,
        fatSzazalek: this.dietRecommedationForm.get('fat_szazalek')?.value,
        proteinSzazalek: this.dietRecommedationForm.get('feherje_szazalek')?.value,
        guestId: this.guestId
      }

      this.dietRecommendationService.calculateNutrition(data).subscribe((response: Nutiriton) =>{
        if(response){
          this.nutiriton = response;
          this.dietRecommedationForm.patchValue({
            calorie: response.calories,
            carbonhydrate: response.carbohydrates,
            protein: response.protein,
            fat: response.fat
          });
        }
      },error => console.log(error));
    }
  }
}
