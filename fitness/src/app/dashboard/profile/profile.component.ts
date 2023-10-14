import { Component } from '@angular/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
  activeTab: string = 'overview';

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }
}
