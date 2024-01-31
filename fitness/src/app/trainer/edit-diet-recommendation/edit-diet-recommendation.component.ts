import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { DietRecommendation } from 'src/app/model/DietRecommendation';
import { AuthService } from 'src/app/service/auth.service';
import { DietRecommendationService } from 'src/app/service/diet-recommendation.service';

@Component({
  selector: 'app-edit-diet-recommendation',
  templateUrl: './edit-diet-recommendation.component.html',
  styleUrls: ['./edit-diet-recommendation.component.css']
})
export class EditDietRecommendationComponent {
  recommendationId: any;
  dietRecommedationForm: FormGroup;
  guestId: any;
  constructor(
    private route: ActivatedRoute,
    private toast: NgToastService,
    private dietRecommendationService: DietRecommendationService,
    private authService: AuthService,
    private router: Router
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
      const id = params['id'];
      const guestId = params['guestId'];
      // Most itt kezelheted a kapott paramétert
      console.log('Routing paraméter - guestId:', id);
      this.recommendationId = id;
      this.guestId = guestId;
    });
    this.dietRecommendationService.getById(this.recommendationId).subscribe((response: DietRecommendation) =>{
      this.dietRecommedationForm.patchValue({
        date: response.date,
        calorie: response.calorie,
        carbonhydrate: response.carbonhydrate,
        protein: response.protein,
        fat: response.fat
      });
    }, error => console.log(error));
  }

  onSubmit(){
    if(this.dietRecommedationForm.valid){
      const data: DietRecommendation = {
        calorie: this.dietRecommedationForm.get('calorie')?.value,
        date: this.dietRecommedationForm.get('date')?.value,
        carbonhydrate: this.dietRecommedationForm.get('carbonhydrate')?.value,
        protein: this.dietRecommedationForm.get('protein')?.value,
        fat: this.dietRecommedationForm.get('fat')?.value
      }
      this.dietRecommendationService.update(this.recommendationId,data).subscribe((response: DietRecommendation) =>{
        if(response){
          this.toast.success({
            detail: 'Sikeres',
            summary: 'Sikeres módosítás!',
            duration: 2000,
            type: 'success',
          });
          this.router.navigate([
            '/trainer/dietRecommedation',
            this.guestId,
          ]);
        }
      });
    }
  }
}
