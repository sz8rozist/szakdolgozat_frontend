import { Injectable } from '@angular/core';
import { ApiUrlService } from './api-url.service';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { UpdateProfile } from '../model/UpdateProfile';
import { User } from '../model/User';
import { ChangePassword } from '../model/ChangePassword';
import { UserDto } from '../model/dto/UserDto';

@Injectable({
  providedIn: 'root',
})
export class UserService {

  private _profilePicture$ = new BehaviorSubject<string | null>(null);
  profilePicture$: Observable<string | null> =
    this._profilePicture$.asObservable();

  constructor(private apiUrlService: ApiUrlService, private http: HttpClient) {}

  updateProfilePicture(newProfilePictureUrl: string) {
    this._profilePicture$.next(newProfilePictureUrl);
  }

  deleteProfilePicture(){
    this._profilePicture$.next(null);
  }

  uploadFile(formData: FormData, userId: number) {
    return this.http.post(
      `${this.apiUrlService.getApiUrl()}/user/image/${userId}`,
      formData,
      { responseType: 'text' }
    );
  }

  getImage(imageName: string) {
    return this.http.get(
      `${this.apiUrlService.getApiUrl()}/user/image/${imageName}`,
      { responseType: 'blob' }
    );
  }

  deleteImage(userId: number) {
    return this.http.delete(
      `${this.apiUrlService.getApiUrl()}/user/image/${userId}`
    );
  }

  updateProfileData(data: UpdateProfile){
    return this.http.put<User>(`${this.apiUrlService.getApiUrl()}/user/${data.id}`, data);
  }

  changePassword(password: ChangePassword, userId: number){
    return this.http.put(`${this.apiUrlService.getApiUrl()}/user/password/${userId}`, password);
  }

  getAllUser(userId: number){
    return this.http.get<UserDto[]>(`${this.apiUrlService.getApiUrl()}/user/userMessages/${userId}`);
  }

  setOnline(userId: number) {
    return this.http.get(`${this.apiUrlService.getApiUrl()}/user/setOnline/${userId}`, {observe: "response"});
  }
  removeOnline(userId: number) {
    return this.http.get(`${this.apiUrlService.getApiUrl()}/user/removeOnline/${userId}`, {observe: "response"});
  }
}
