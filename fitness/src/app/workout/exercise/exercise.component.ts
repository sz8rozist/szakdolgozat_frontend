import { Component } from '@angular/core';
import { Exercise } from 'src/app/model/Exercise';
import { ExerciseService } from 'src/app/service/exercise.service';

@Component({
  selector: 'app-exercise',
  templateUrl: './exercise.component.html',
  styleUrls: ['./exercise.component.css']
})
export class ExerciseComponent {
  exercises: Exercise[] = [];
  currentPage = 0;
  pageSize = 10;
  numberOfElements?: number;
  recordCount?: number;
  totalPages = 0;
  pages: number[] = [];

  constructor(
    private exerciseService: ExerciseService
  ){
    this.loadExercise();
  }

  loadExercise(){
    this.exerciseService.getAllExercise(this.currentPage, this.pageSize).subscribe((exercise: any) =>{
      this.recordCount = exercise.recordCount;
      this.numberOfElements = exercise.numberOfElements;
      this.totalPages = exercise.totalPages;
      this.exercises = [...exercise.content];

      if (this.totalPages) {
        this.pages = Array.from({ length: this.totalPages }, (_, i) => i);
      }
    });
  }
  changePage(page: number) {
    this.currentPage = page;
    this.loadExercise();
  }

  previousPage() {
    if (this.currentPage && this.currentPage != 0) {
      this.currentPage--;
      this.loadExercise();
    }
  }
  nextPage() {
    if (this.totalPages && this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.loadExercise();
    }
  }

  targetedBodyPart(part: string) {
    switch (part) {
      case 'CHEST':
        return 'Mell';
      case 'SHOULDER':
        return 'Váll';
      case 'ABS':
        return 'Has';
      case 'BACK':
        return 'Hát';
      case 'ARMS':
        return 'Kar';
      case 'LEGS':
        return 'Láb';
      default:
        return '';
    }
  }
}
