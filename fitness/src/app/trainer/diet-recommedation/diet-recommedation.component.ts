import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { DietRecommendation } from 'src/app/model/DietRecommendation';
import { AuthService } from 'src/app/service/auth.service';
import { DietRecommendationService } from 'src/app/service/diet-recommendation.service';

@Component({
  selector: 'app-diet-recommedation',
  templateUrl: './diet-recommedation.component.html',
  styleUrls: ['./diet-recommedation.component.css'],
})
export class DietRecommedationComponent {
  guestId: any;
  dietRecommedationForm: FormGroup;
  constructor(
    private route: ActivatedRoute,
    private toast: NgToastService,
    private dietRecommendationService: DietRecommendationService,
    private authService: AuthService
    ) {
    this.dietRecommedationForm = new FormGroup({
      date: new FormControl('', [Validators.required]),
      calorie: new FormControl('', [Validators.required,Validators.pattern('^[0-9]*$')]),
      carbonhydrate: new FormControl('', [Validators.required, Validators.pattern('^[0-9]*$')]),
      protein: new FormControl('', [Validators.required,Validators.pattern('^[0-9]*$')]),
      fat: new FormControl('', [Validators.required, Validators.pattern('^[0-9]*$')])
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

  onSubmit(){
    if(this.dietRecommedationForm.valid){
      const dietRecommendation: DietRecommendation = {
        date: this.dietRecommedationForm.get('date')?.value,
        calorie: this.dietRecommedationForm.get('calorie')?.value,
        carbonhydrate: this.dietRecommedationForm.get('carbonhydrate')?.value,
        protein: this.dietRecommedationForm.get('protein')?.value,
        fat: this.dietRecommedationForm.get('fat')?.value
      }
      const token = this.authService.getDecodedToken();
      this.dietRecommendationService.saveRecommendation(dietRecommendation, this.guestId, token.sub).subscribe(
        (response: DietRecommendation) =>{
        if(response){
          console.log(response);
          this.dietRecommedationForm.reset();
          this.toast.success({
            detail: 'Sikeres',
            summary: 'Sikeres mentés!',
            duration: 2000,
            type: 'success',
          });
        }
      },
      (error) =>{
        console.log(error);
        this.toast.error({
          detail: 'Hiba',
          summary: 'Váratlan hiba történt a mentés közben!',
          duration: 2000,
          type: 'error',
        });
      });
    }
  }
}
