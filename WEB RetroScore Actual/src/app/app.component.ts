import { Component, OnInit, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterModule, RouterOutlet } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { CestaComponent } from './cesta/cesta.component';
import { SliderComponent } from './slider/slider.component';
import { ProfileComponent } from './profile/profile.component';
import { JerseyComponent } from './jersey/jersey.component';
import { JerseyContainerComponent } from './jersey-container/jersey-container.component';
import { HttpClientModule } from '@angular/common/http';
import { PopupService } from './Services/popup.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterModule,
    HomeComponent,
    HeaderComponent,
    FooterComponent,
    CestaComponent,
    SliderComponent,
    ProfileComponent,
    JerseyComponent,
    JerseyContainerComponent,
    HttpClientModule
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [PopupService]
})
export class AppComponent implements OnInit {
  private titleService = inject(Title);

  ngOnInit(): void {
    this.titleService.setTitle('Título Común para Todas las Páginas');
  }

  constructor() { }
}