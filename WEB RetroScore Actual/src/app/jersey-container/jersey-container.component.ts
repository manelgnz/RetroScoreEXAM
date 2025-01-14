import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../Services/api.service';
import { Jersey } from '../models/Jersey';
import { JerseyComponent } from '../jersey/jersey.component';
import { Jerseys } from '../models/Jerseys';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-jersey-container',
  standalone: true,
  imports: [JerseyComponent, CommonModule],
  templateUrl: './jersey-container.component.html',
  styleUrls: ['./jersey-container.component.css']
})
export class JerseyContainerComponent implements OnInit {

  route: ActivatedRoute = inject(ActivatedRoute);
  apiService = inject(ApiService);

  jerseys = signal<Jersey[] | null>(null);
  jersey = signal<Jersey | null>(null);

  ngOnInit(): void {
    this.apiService.getAllJerseys()
      .subscribe({
        next: (jerseys: Jerseys) => {
          console.log(jerseys.results);
          this.jerseys.set(jerseys.results);
        },
        error: (err) => console.error('Error al cargar jerseys:', err)
      });
  }
}