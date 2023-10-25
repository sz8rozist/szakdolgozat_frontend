import { Component } from '@angular/core';
import { NgToastService } from 'ng-angular-popup';
import { ChooseTrainerRequest } from 'src/app/model/ChooseTrainerRequest';
import { Trainer } from 'src/app/model/Trainer';
import { TrainerResponse } from 'src/app/model/TrainerResponse';
import { User } from 'src/app/model/User';
import { AuthService } from 'src/app/service/auth.service';
import { TrainerService } from 'src/app/service/trainer.service';
import { UserService } from 'src/app/service/user.service';
@Component({
  selector: 'app-trainer',
  templateUrl: './trainer.component.html',
  styleUrls: ['./trainer.component.css']
})
export class TrainerComponent {

  trainers?: TrainerResponse[];
  user?: User;

  

  constructor(private trainerService: TrainerService,
    private userService: UserService,
    private authService: AuthService,
    private toast: NgToastService){}

  ngOnInit(){
    this.getAllTrainer();
    this.getAuthData();
  }

  getAllTrainer(){
    this.trainerService.getAllTrainer().subscribe((response: TrainerResponse[]) =>{
      console.log(response);
      this.trainers = [...response];

      this.trainers.forEach(trainer => {
        if (trainer.userProfileImage) {
          this.getProfilePicture(trainer.userProfileImage, trainer);
        }
      });
    });
  }

  getProfilePicture(imageName: string, trainer: TrainerResponse) {
    if (imageName != null) {
      this.userService.getImage(imageName).subscribe((response) => {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          trainer.userProfileImage = e.target.result;
        };
        reader.readAsDataURL(response);
      });
    }
  }

  getAuthData() {
    this.authService.getAuthData().subscribe((response: User) => {
      if (response) {
        this.user = response;
      }
    });
  }

  chooseTrainer(trainer: Trainer){
    const token = this.authService.getDecodedToken();
    const data: ChooseTrainerRequest = {
      trainerId: trainer.id as number,
      userId: token.sub as number
    };
    this.trainerService.chooseTrainer(data).subscribe(response =>{
      console.log(response);
      this.getAuthData();
      this.toast.success({
        detail: 'Sikeres',
        summary: 'Sikeres edző kiválasztás!',
        duration: 2000,
        type: 'success',
      });
    });
  }
}