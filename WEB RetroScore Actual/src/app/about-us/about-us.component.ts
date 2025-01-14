
import { Component, OnInit, inject, signal } from '@angular/core';
import { SidebarFilterComponent } from '../sidebar-filter/sidebar-filter.component';
import { FooterComponent } from '../footer/footer.component';
import { JerseyComponent } from '../jersey/jersey.component';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { ApiService } from '../Services/api.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-about-us',
  standalone: true,
  imports: [],
  templateUrl: './about-us.component.html',
  styleUrl: './about-us.component.css'
})
export class AboutUsComponent implements OnInit{
  private titleService = inject(Title);

  ngOnInit(): void {
    this.titleService.setTitle('RetroScore | About Us');
  }

}

