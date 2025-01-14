import { Component, OnInit, inject, signal } from '@angular/core';
import { Router, NavigationEnd, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PopupService } from '../Services/popup.service';
import { SearchBarComponent } from '../search-bar/search-bar.component';
import { ApiService } from '../Services/api.service';
import { Jersey } from '../models/Jersey';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, SearchBarComponent],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})

export class HeaderComponent implements OnInit {
  menuActive = false;
  apiService = inject(ApiService);
  jersey = signal<Jersey[]>([]);
  filteredJerseys = signal<Jersey[]>([]);
  isLoggedIn = false;
  userImage = 'user.png';

  constructor(private popupService: PopupService, private router: Router) { }

  ngOnInit(): void {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.menuActive = false;
      }
    });

    this.checkLoginStatus();
  }

  checkLoginStatus(): void {
    this.isLoggedIn = this.apiService.isLoggedIn();
    if (this.isLoggedIn) {
      this.userImage = 'user-logged.png';
    } else {
      this.userImage = 'user.png';
    }
  }

  openProfilePopup() {
    this.popupService.showPopup();
  }

  toggleMenu() {
    this.menuActive = !this.menuActive;
  }

  onSearch(teamName: string): void {
    this.router.navigate(['/catalogo'], { queryParams: { team: teamName } });
  }

  links = [
    { path: '/', label: 'Inicio' },
    { path: '/catalogo', label: 'Catálogo' },
    { path: '/tallaje', label: 'Tallaje' },
    { path: '/about-us', label: 'Sobre Nosotros' },
    { path: '/cesta', label: 'Cesta' }
  ];
}