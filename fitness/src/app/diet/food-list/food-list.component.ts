import { Component } from '@angular/core';
import { Food } from 'src/app/model/Food';
import { DietService } from 'src/app/service/diet.service';

@Component({
  selector: 'app-food-list',
  templateUrl: './food-list.component.html',
  styleUrls: ['./food-list.component.css']
})
export class FoodListComponent {
  foods: Food[] = [];
  currentPage = 0;
  pageSize = 10;
  numberOfElements?: number;
  recordCount?: number;
  totalPages = 0;
  pages: number[] = [];
  constructor(
    private dietService: DietService
  ){}

  ngOnInit(){
    this.loadFoods();
  }

  loadFoods(){
    this.dietService.getAllFood(this.currentPage, this.pageSize).subscribe((food: any) =>{
      console.log(food);
      this.recordCount = food.recordCount;
      this.numberOfElements = food.numberOfElements;
      this.totalPages = food.totalPages;
      this.foods = [...food.content];

      if (this.totalPages) {
        this.pages = Array.from({ length: this.totalPages }, (_, i) => i);
      }
    });
  }

  changePage(page: number) {
    this.currentPage = page;
    this.loadFoods();
  }

  previousPage() {
    if (this.currentPage && this.currentPage != 0) {
      this.currentPage--;
      this.loadFoods();
    }
  }
  nextPage() {
    if (this.totalPages && this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.loadFoods();

    }
  }
}
