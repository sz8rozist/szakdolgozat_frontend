import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { Food } from '../../model/Food';
import { DietService } from '../../service/diet.service';

@Component({
  selector: 'app-food-form',
  templateUrl: './food-form.component.html',
  styleUrls: ['./food-form.component.css']
})
export class FoodFormComponent {

  foodForm: FormGroup;
  constructor(
    private dietService: DietService,
    private toast: NgToastService
  ){
    this.foodForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      calorie: new FormControl('', [Validators.required,Validators.pattern('^[0-9]*$')]),
      carbonhydrate: new FormControl('', [Validators.required, Validators.pattern('^[0-9]*$')]),
      protein: new FormControl('', [Validators.required,Validators.pattern('^[0-9]*$')]),
      fat: new FormControl('', [Validators.required, Validators.pattern('^[0-9]*$')])
    });
  }

  onSubmit(){
    if(this.foodForm.valid){
      const food: Food = {
        name: this.foodForm.get('name')?.value,
        calorie: this.foodForm.get('calorie')?.value,
        carbonhydrate: this.foodForm.get('carbonhydrate')?.value,
        protein: this.foodForm.get('protein')?.value,
        fat: this.foodForm.get('fat')?.value
      }

      this.dietService.createFood(food).subscribe((response: Food) =>{
        if(response){
          console.log(response);
          this.foodForm.reset();
          this.toast.success({
            detail: 'Sikeres',
            summary: 'Sikeres mentés!',
            duration: 2000,
            type: 'success',
          });
        }
      });
    }
  }
}
