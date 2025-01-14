import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Jersey } from '../models/Jersey';

@Component({
  selector: 'app-jersey',
  templateUrl: './jersey.component.html',
  standalone: true,
  styleUrls: ['./jersey.component.css']
})
export class JerseyComponent implements OnInit {
  @Input() team!: string;
  @Input() price!: number;
  @Input() imageURL!: string;
  @Input() season!: string;
  @Input() colour!: string;
  @Input() jerseyId!: string;
  @Output() addToCartEvent = new EventEmitter<Jersey>();

  ngOnInit(): void {
    console.log('Jersey component initialized with:', this.team, this.price, this.imageURL, this.season, this.colour, this.jerseyId);
  }

  addToCart() {
    this.addToCartEvent.emit({
      team: this.team,
      price: this.price,
      imageURL: this.imageURL,
      season: this.season,
      colour: this.colour,
      id: this.jerseyId
    } as Jersey);
  }
}