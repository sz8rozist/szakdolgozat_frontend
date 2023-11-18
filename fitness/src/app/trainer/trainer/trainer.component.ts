import { Component } from '@angular/core';
import { NgToastService } from 'ng-angular-popup';
import { ChooseTrainerRequest } from '../../model/ChooseTrainerRequest';
import { Trainer } from '../../model/Trainer';
import { AuthService } from '../../service/auth.service';
import { TrainerService } from '../../service/trainer.service';
import { UserService } from '../../service/user.service';
import { User } from 'src/app/model/User';
@Component({
  selector: 'app-trainer',
  templateUrl: './trainer.component.html',
  styleUrls: ['./trainer.component.css']
})
export class TrainerComponent {

  trainers?: Trainer[];
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
    this.trainerService.getAllTrainer().subscribe((response: Trainer[]) =>{
      console.log(response);
      this.trainers = [...response];

      this.trainers.forEach(trainer => {
        if (trainer?.user?.profilePictureName) {
          this.getProfilePicture(trainer?.user?.profilePictureName, trainer.user);
        }
      });
    });
  }

  getProfilePicture(imageName: string, trainer: User) {
    if (imageName != null) {
      this.userService.getImage(imageName).subscribe((response) => {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          trainer.profilePictureName = e.target.result;
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
