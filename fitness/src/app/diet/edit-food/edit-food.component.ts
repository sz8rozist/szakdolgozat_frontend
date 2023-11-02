import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Diet } from 'src/app/model/Diet';
import { Food } from 'src/app/model/Food';
import { DietService } from 'src/app/service/diet.service';

@Component({
  selector: 'app-edit-food',
  templateUrl: './edit-food.component.html',
  styleUrls: ['./edit-food.component.css'],
})
export class EditFoodComponent {
  foodForm: FormGroup;
  dietForm: FormGroup;
  diet?: Diet;
  foods?: Food[];

  constructor(private dietService: DietService, private route: ActivatedRoute) {
    this.foodForm = new FormGroup({
      foodId: new FormControl('', [Validators.required]),
      calorie: new FormControl('', [Validators.required,Validators.pattern('^[0-9]*$')]),
      protein: new FormControl('', [Validators.required,Validators.pattern('^[0-9]*$')]),
      carbonhydrate: new FormControl('', [Validators.required, Validators.pattern('^[0-9]*$')]),
      fat: new FormControl('', [Validators.required, Validators.pattern('^[0-9]*$')]),
    });
    this.dietForm = new FormGroup({
      quantity: new FormControl('', [Validators.required,Validators.pattern('^[0-9]*$')]),
      type: new FormControl('', [Validators.required]),
      date: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit() {
    this.loadFoods();
    this.loadDiet();
  }

  loadFoods() {
    this.dietService.getAllFoodWithoutPagination().subscribe((food: Food[]) => {
      this.foods = [...food];
    });
  }

  loadDiet() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.dietService.getDietById(Number(id)).subscribe((response: Diet) => {
        if (response) {
          this.diet = response;
          this.patchFoodForm(this.diet.food);
          this.patchDietForm(this.diet);
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

  patchDietForm(diet: any){
    this.dietForm.patchValue({
      quantity: diet.quantity,
      type: diet.type,
      date: diet.date
    });
  }

  onSelectChange(event: Event){
    const selectedValue = (event.target as HTMLSelectElement).value;
    this.dietService.getFoodById(Number(selectedValue)).subscribe((response: Food) =>{
      if(response){
        this.patchFoodForm(response);
      }
    });
  }

  saveEtkezes(){
    if(this.dietForm.valid && this.foodForm.valid){
      console.log(this.dietForm.getRawValue());
      console.log(this.foodForm.getRawValue());
    }
  }
}
