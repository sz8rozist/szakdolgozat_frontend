import { Component } from '@angular/core';
import { Guest } from 'src/app/model/Guest';
import { Trainer } from 'src/app/model/Trainer';
import { User } from 'src/app/model/User';
import { AuthService } from 'src/app/service/auth.service';

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

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authService.getAuthData().subscribe((response: User) => {
      this.allGuests = [...response.trainer.guests];
      this.calculatePageNumbers();
      this.updateDisplayedItems();
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
}
