import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  private langSubject = new BehaviorSubject<string>("");
  langObservable = this.langSubject.asObservable();
  constructor() { }

  setLang(value: string){
    this.langSubject.next(value);
  }

  getLangObservable(){
    return this.langObservable;
  }
}
