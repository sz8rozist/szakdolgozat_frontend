import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { faAdd, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { NgToastService } from 'ng-angular-popup';
import { DietRecommendation } from 'src/app/model/DietRecommendation';
import { AuthService } from 'src/app/service/auth.service';
import { DietRecommendationService } from 'src/app/service/diet-recommendation.service';

@Component({
  selector: 'app-diet-recommedation',
  templateUrl: './diet-recommedation.component.html',
  styleUrls: ['./diet-recommedation.component.css'],
})
export class DietRecommedationComponent {
  recommedation: DietRecommendation[] = [];
  guestId: any;
  faTrash = faTrash;
  faEdit = faEdit;
  faNew = faAdd;

  constructor(
    private dietRecommendationService: DietRecommendationService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private toast: NgToastService
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      const id = params['guestId'];
      // Most itt kezelheted a kapott paramétert
      this.guestId = id;
    });
    this.getAllRecommendations();
  }

  getAllRecommendations() {
    const token = this.authService.getDecodedToken();
    this.dietRecommendationService
      .getDietRecommedations(this.guestId, token.sub)
      .subscribe((response: DietRecommendation[]) => {
        this.recommedation = [...response];
      });
  }

  onDelete(id: any) {
    this.dietRecommendationService
      .deleteRecommendation(id)
      .subscribe((response) => {
        if (response.status == 204) {
          this.toast.success({
            detail: 'Sikeres',
            summary: 'Sikeres törlés!',
            duration: 2000,
            type: 'success',
          });
          this.recommedation = this.recommedation.filter(
            (obj) => obj.id !== id
          );
        }
      });
  }
}
