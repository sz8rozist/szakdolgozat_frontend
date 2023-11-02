import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgToastService } from 'ng-angular-popup';
import { Exercise } from 'src/app/model/Exercise';
import { ExerciseService } from 'src/app/service/exercise.service';

@Component({
  selector: 'app-add-exercise',
  templateUrl: './add-exercise.component.html',
  styleUrls: ['./add-exercise.component.css']
})
export class AddExerciseComponent {
  exerciseForm: FormGroup;
  constructor(
    private exerciseService: ExerciseService,
    private toast: NgToastService
  ){
    this.exerciseForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      targetedBodyPart: new FormControl('', [Validators.required])
    });
  }

  onSubmit(){
    if(this.exerciseForm.valid){
      const exercise: Exercise = {
        name: this.exerciseForm.get('name')?.value,
        description: this.exerciseForm.get('description')?.value,
        targetedBodyPart: this.exerciseForm.get('targetedBodyPart')?.value
      }
      this.exerciseService.saveExercise(exercise).subscribe((response: Exercise) =>{
        if(response){
          this.exerciseForm.reset();
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
