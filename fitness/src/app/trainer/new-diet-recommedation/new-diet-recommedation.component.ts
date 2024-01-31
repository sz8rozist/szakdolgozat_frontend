import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { DietRecommendation } from 'src/app/model/DietRecommendation';
import { AuthService } from 'src/app/service/auth.service';
import { DietRecommendationService } from 'src/app/service/diet-recommendation.service';

@Component({
  selector: 'app-new-diet-recommedation',
  templateUrl: './new-diet-recommedation.component.html',
  styleUrls: ['./new-diet-recommedation.component.css'],
})
export class NewDietRecommedationComponent {
  guestId: any;
  dietRecommedationForm: FormGroup;
  constructor(
    private route: ActivatedRoute,
    private toast: NgToastService,
    private dietRecommendationService: DietRecommendationService,
    private authService: AuthService,
    private router: Router
  ) {
    this.dietRecommedationForm = new FormGroup({
      date: new FormControl('', [Validators.required]),
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
    });
  }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      const id = params['guestId'];
      // Most itt kezelheted a kapott paramétert
      console.log('Routing paraméter - guestId:', id);
      this.guestId = id;
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
}
