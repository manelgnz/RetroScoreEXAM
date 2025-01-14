import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
  
@Injectable({
  providedIn: 'root'
})
export class PopupService {
  private popupVisible = new BehaviorSubject<boolean>(false);
  popupVisible$ = this.popupVisible.asObservable();

  private registerPopupVisible = new BehaviorSubject<boolean>(false);
  registerPopupVisible$ = this.registerPopupVisible.asObservable();

  showPopup() {
    this.popupVisible.next(true);
  }

  hidePopup() {
    this.popupVisible.next(false);
  }

  showRegisterPopup() {
    this.registerPopupVisible.next(true);
  }

  hideRegisterPopup() {
    this.registerPopupVisible.next(false);
  }
  
}