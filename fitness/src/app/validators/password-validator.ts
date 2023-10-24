import {
  AbstractControl,
  AsyncValidatorFn,
  ValidationErrors,
} from '@angular/forms';
import { AuthService } from '../service/auth.service';
import { catchError, map, of } from 'rxjs';

export class PasswordValidator {
  static goodPasswordValidator(authService: AuthService): AsyncValidatorFn {
    return (control: AbstractControl) => {
      const password = control.value;
      if (password) {
        const token = authService.getDecodedToken();
        return authService.checkPassword(token.sub, password).pipe(
          map((response) => {
            const goodPass = response.body;
            const status = response.status;
            return status === 200 && goodPass ? { goodPass: true } : null;
          }),
          catchError(() => of(null))
        );
      } else {
        return of(null);
      }
    };
  }
}
