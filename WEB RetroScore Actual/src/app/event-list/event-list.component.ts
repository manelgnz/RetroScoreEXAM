import { Component, inject, OnInit } from '@angular/core';
import { EventService } from '../Services/event.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Observable } from 'rxjs'
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-event-list',
  standalone: true,
  imports: [ CommonModule, RouterModule],
  templateUrl: './event-list.component.html',
  styleUrl: './event-list.component.css'
})
export class EventListComponent implements OnInit{
  route: ActivatedRoute = inject(ActivatedRoute);
  events$!: Observable<any[]>;

  constructor(private eventService: EventService) { }

  ngOnInit(): void {
    this.loadEvents();
  }

  loadEvents(): void {
    this.events$ = this.eventService.getEvents();
  }
}
