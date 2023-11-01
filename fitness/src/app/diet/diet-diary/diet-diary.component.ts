import { Component } from '@angular/core';
import { DietService } from '../../service/diet.service';
import { AuthService } from '../../service/auth.service';
@Component({
  selector: 'app-diet-diary',
  templateUrl: './diet-diary.component.html',
  styleUrls: ['./diet-diary.component.css'],
})
export class DietDiaryComponent {
  dates: string[] = [];

  constructor(
    private dietService: DietService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    const token = this.authService.getDecodedToken();
    this.dietService.getDates(token.sub).subscribe((response: string[]) => {
      this.dates = [...response];
    });
  }
}
