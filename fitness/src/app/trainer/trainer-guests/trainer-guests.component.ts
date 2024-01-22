import { Component } from '@angular/core';
import { NgToastService } from 'ng-angular-popup';
import { Guest } from 'src/app/model/Guest';
import { Trainer } from 'src/app/model/Trainer';
import { User } from 'src/app/model/User';
import { AuthService } from 'src/app/service/auth.service';
import { GuestService } from 'src/app/service/guest.service';

@Component({
  selector: 'app-trainer-guests',
  templateUrl: './trainer-guests.component.html',
  styleUrls: ['./trainer-guests.component.css'],
})
export class TrainerGuestsComponent {
  // Az aktuálisan megjelenítendő elemek
  displayedGuest: Guest[] = [];
  allGuests: Guest[] = [];
  // Az oldalméret
  pageSize = 10;
  // Az aktuális oldalszám
  currentPage = 1;
  pageNumbers: number[] = [];
  searchInput: string = '';
  switch: boolean = false;
  trainerId?: number;
  constructor(
    private guestService: GuestService,
    private authService: AuthService,
    private toast: NgToastService
  ) {}

  ngOnInit() {
    this.authService.getAuthData().subscribe((authResponse: User) => {
      const authTrainerId = authResponse.trainer.id;
      this.trainerId = authTrainerId;

      this.guestService.getAllGuest().subscribe((guestResult: Guest[]) => {
        console.log(guestResult);
        // Szűrjük a vendégeket a trainerId alapján
        const matchingGuests = guestResult.filter(
          (guest) =>
            guest.trainer == null ||
            (guest.trainer != null && guest.trainer.id === authTrainerId)
        );

        if (matchingGuests.length > 0) {
          // Beállítjuk a trainer_guest értékét azoknál, ahol a trainerId egyezik
          matchingGuests.forEach((matchingGuest) => {
            matchingGuest.trainer_guest =
              matchingGuest.trainer != null &&
              matchingGuest.trainer.id === authTrainerId;
          });
        }
        this.allGuests = [...matchingGuests];
        this.calculatePageNumbers();
        this.updateDisplayedItems();
      });
    });
  }

  onPageChanged(newPage: number) {
    this.currentPage = newPage;
    this.updateDisplayedItems();
  }

  updateDisplayedItems() {
    const filteredItems = this.allGuests.filter((item) =>
      this.matchesSearchQuery(item, this.searchInput)
    );
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.displayedGuest = filteredItems.slice(startIndex, endIndex);
  }

  calculatePageNumbers() {
    const totalItems = this.allGuests.length;
    const totalPages = Math.ceil(totalItems / this.pageSize);
    this.pageNumbers = Array.from(
      { length: totalPages },
      (_, index) => index + 1
    );
  }

  onSearch() {
    // Keresés eseménykezelő
    this.currentPage = 1;
    this.calculatePageNumbers();
    this.updateDisplayedItems();
  }

  matchesSearchQuery(item: any, query: string): boolean {
    const keywords = query
      .toLowerCase()
      .split(' ')
      .filter((keyword) => keyword.trim() !== '');

    return (
      keywords.every(
        (keyword) =>
          item.first_name.toLowerCase().includes(keyword) ||
          item.last_name.toLowerCase().includes(keyword)
      ) ||
      (item.first_name + ' ' + item.last_name)
        .toLowerCase()
        .includes(query.toLowerCase())
    );
  }

  onChange() {
    if (this.switch) {
      // Szűrjük a trainer_guest értékek alapján
      const filtered = this.displayedGuest.filter((elem) => elem.trainer_guest);
      this.displayedGuest = filtered;
    } else {
      // Ha a switch hamis, akkor visszaállítjuk a kezdeti állapotba
      this.displayedGuest = [...this.allGuests];
    }
  }

  addGuest(guestId: any){
    this.guestService.addTrainerToGuest(guestId, this.trainerId as any).subscribe(response =>{
      if(response){
        this.toast.success({
          detail: 'Sikeres',
          summary: 'Sikeres felvétel!',
          duration: 2000,
          type: 'success',
        })
        const foundGuest = this.displayedGuest.find(guest => guest.id === guestId);
        if (foundGuest) {
          foundGuest.trainer_guest = true;
        } else {
          console.warn(`Nem található személy az ID alapján: ${guestId}`);
        }      }
    },(error) => {console.log(error)});
  }
}
