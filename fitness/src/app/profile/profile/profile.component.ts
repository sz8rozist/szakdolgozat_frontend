import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgToastService } from 'ng-angular-popup';
import { Guest } from 'src/app/model/Guest';
import { Trainer } from 'src/app/model/Trainer';
import { UpdateProfile } from 'src/app/model/UpdateProfile';
import { User } from 'src/app/model/User';
import { AuthService } from 'src/app/service/auth.service';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent {
  activeTab: string = 'overview';
  user?: User;
  trainer?: Trainer;
  guest?: Guest;
  selectedFile?: File;
  profileImageSrc?: string;
  profileForm: FormGroup;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private toast: NgToastService
  ) {
    this.profileForm = new FormGroup({
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      age: new FormControl('', [Validators.pattern('^[0-9]*$')]),
      height: new FormControl('', [Validators.pattern('^[0-9]*$')]),
      weight: new FormControl('', [Validators.pattern('^[0-9]*$')]),
      type: new FormControl(''),
    });
  }

  ngOnInit() {
    this.getAuthData();
  }

  getAuthData() {
    this.authService.getAuthData().subscribe((response: User) => {
      if (response) {
        this.user = response;
        if (this.user.trainer != null) {
          this.trainer = this.user.trainer;
        } else {
          this.guest = this.user.guest;
        }
        this.patchFormData();
        this.getProfilePicture(response.profilePictureName);
      }
    });
  }

  getProfilePicture(imageName: string) {
    if (imageName != null) {
      this.userService.getImage(imageName).subscribe((response) => {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.profileImageSrc = e.target.result;
        };
        reader.readAsDataURL(response);
      });
    }
  }

  patchFormData() {
    this.profileForm.patchValue({
      firstName: this.trainer?.first_name || this.guest?.first_name,
      lastName: this.trainer?.last_name || this.guest?.last_name,
      email: this.trainer?.email || this.guest?.email,
      age: this.guest?.age,
      height: this.guest?.height,
      weight: this.guest?.weight,
      type: this.trainer?.type,
    });
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  uploadProfilePicture() {
    if (!this.selectedFile) {
      return;
    }
    const formData = new FormData();
    formData.append('file', this.selectedFile, this.selectedFile.name);
    this.userService
      .uploadFile(formData, this.user?.id as number)
      .subscribe((response: string) => {
        console.log(response);
        this.getAuthData();
        this.userService.updateProfilePicture(response);
        this.toast.success({
          detail: 'Sikeres',
          summary: 'Sikeres képfeltöltés!',
          duration: 2000,
          type: 'success',
        });
      });
  }

  deleteProfilePicture() {
    this.userService
      .deleteImage(this.user?.id as number)
      .subscribe((response) => {
        console.log(response);
        this.profileImageSrc = '';
        this.userService.deleteProfilePicture();
        this.toast.success({
          detail: 'Sikeres',
          summary: 'Sikeres profilkép törlés!',
          duration: 2000,
          type: 'success',
        });
      });
  }

  updateProfile() {
    const data: UpdateProfile = {
      id: this.user?.id,
      firstName: this.profileForm.get('firstName')?.value,
      lastName: this.profileForm.get('lastName')?.value,
      email: this.profileForm.get('email')?.value,
      age: this.profileForm.get('age')?.value,
      height: this.profileForm.get('height')?.value,
      weight: this.profileForm.get('weight')?.value,
      type: this.profileForm.get('type')?.value,
    };
    this.userService.updateProfileData(data).subscribe((response: User) => {
      this.toast.success({
        detail: 'Sikeres',
        summary: 'Sikeres frissítés!',
        duration: 2000,
        type: 'success',
      });
      this.getAuthData();
    });
  }
}
