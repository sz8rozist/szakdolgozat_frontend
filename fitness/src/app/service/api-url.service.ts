import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ApiUrlService {
  private apiUrl = 'http://localhost:8080';

  constructor() {}

  getApiUrl(): string {
    return this.apiUrl;
  }
}
