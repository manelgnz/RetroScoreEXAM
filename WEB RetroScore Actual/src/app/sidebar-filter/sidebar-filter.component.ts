import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar-filter',
  templateUrl: './sidebar-filter.component.html',
  styleUrls: ['./sidebar-filter.component.css'],
  imports: [CommonModule],
  standalone: true,
})
export class SidebarFilterComponent {
  @Output() filterChanged: EventEmitter<any> = new EventEmitter<any>();
  filtersVisible: boolean = false;
  selectedFilter: string = '';

  onFilterChange() {
    const selectedLiga = (document.querySelector('input[name="liga"]:checked') as HTMLInputElement)?.value;
    const selectedEstilo = (document.querySelector('input[name="estilo"]:checked') as HTMLInputElement)?.value;

    this.filterChanged.emit({
      liga: selectedLiga,
      estilo: selectedEstilo
    });
  }

  toggleFilters() {
    this.filtersVisible = !this.filtersVisible;
  }

  selectFilter(event: Event, filter: string) {
    this.selectedFilter = filter;
  }
}
