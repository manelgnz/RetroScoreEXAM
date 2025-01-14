import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css']
})
export class SearchBarComponent {
  @Output() search: EventEmitter<string> = new EventEmitter<string>();
  teamName: string = '';

  onSubmit(event: Event): void {
    event.preventDefault(); 
    this.search.emit(this.teamName);
    this.teamName = '';
  }
}