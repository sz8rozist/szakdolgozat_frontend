import {
  AbstractControl,
  AsyncValidatorFn,
} from '@angular/forms';
import { AuthService } from '../service/auth.service';
import { catchError, map, of } from 'rxjs';
import { ChangePassword } from '../model/ChangePassword';

export class PasswordValidator {
  static goodPasswordValidator(authService: AuthService): AsyncValidatorFn {
    return (control: AbstractControl) => {
      const password = control.value;
      if (password) {
        const changePw: ChangePassword = {
            password: password
        }
        const token = authService.getDecodedToken();
        return authService.checkPassword(token.sub, changePw).pipe(
          map((response) => {
            const goodPass = response.body;
            const status = response.status;
            return status === 200 && goodPass ? null : { goodPass: true };
          }),
          catchError(() => of(null))
        );
      } else {
        return of(null);
      }
    };
  }
}
