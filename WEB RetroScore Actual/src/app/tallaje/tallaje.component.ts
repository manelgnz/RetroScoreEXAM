import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-tallaje',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tallaje.component.html',
  styleUrls: ['./tallaje.component.css']
})
export class TallajeComponent implements OnInit {
  private titleService = inject(Title);

  showFAQ: boolean = false;

  ngOnInit(): void {
    this.titleService.setTitle('RetroScore | Tallaje');
  }

  toggleFAQ(): void {
    this.showFAQ = !this.showFAQ;
  }

}