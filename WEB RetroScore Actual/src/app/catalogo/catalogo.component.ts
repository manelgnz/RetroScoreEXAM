import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Jersey } from '../models/Jersey';
import { ApiService } from '../Services/api.service';
import { CommonModule } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { SidebarFilterComponent } from '../sidebar-filter/sidebar-filter.component';
import { JerseyComponent } from '../jersey/jersey.component';
import { SearchBarComponent } from '../search-bar/search-bar.component';

@Component({
  selector: 'app-catalogo',
  standalone: true,
  imports: [SidebarFilterComponent, CommonModule, JerseyComponent],
  templateUrl: './catalogo.component.html',
  styleUrls: ['./catalogo.component.css']
})
export class CatalogoComponent implements OnInit {
  route: ActivatedRoute = inject(ActivatedRoute);
  apiService = inject(ApiService);
  private titleService = inject(Title);
  jerseys = signal<Jersey[]>([]); // Signal = Reactive variable that can be subscribed to
  filteredJerseys = signal<Jersey[]>([]);

  ngOnInit(): void {
    this.titleService.setTitle('RetroScore | Catálogo');
    this.loadShirts();
    this.route.queryParams.subscribe(params => {
      const teamName = params['team'];
      if (teamName) {
        this.onSearch(teamName);
      }
    });
  }

  loadShirts(): void {
    this.apiService.getAllJerseys().subscribe((data: { results: Jersey[] }) => {
      console.log('Jerseys loaded:', data.results);
      this.jerseys.set(data.results);
      this.filteredJerseys.set(data.results);

      const teamName = this.route.snapshot.queryParamMap.get('team'); // Checking if there is a team name in the query params
      if (teamName) {
        this.onSearch(teamName); // If there is, we call the onSearch method with the team name
      }
    });
  }

  addToCart(jersey: Jersey): void {
    const user = this.apiService.getLoggedInUser();
    if (!user) {
      alert('Por favor, inicia sesión para añadir a la cesta');
      return;
    }

    const cartItem = {
      userId: user._id, 
      jerseyId: jersey.id, 
      quantity: 1
    };

    console.log('Obteniendo la cesta para el usuario:', user._id);
    this.apiService.getCartByUser(user._id).subscribe({
      next: (cart) => {
        console.log('Cesta obtenida:', cart);
        if (!cart) {
          console.log('No se encontró cesta, creando una nueva.');
          this.apiService.createCart({ userId: user._id }).subscribe({
            next: () => {
              console.log('Cesta creada, añadiendo item a la cesta.');
              this.addItemToCart(cartItem);
            },
            error: (err: any) => {
              console.error('Error al crear la cesta:', err);
              alert('Hubo un error al crear la cesta. Inténtalo de nuevo.');
            }
          });
        } else {
          console.log('Cesta encontrada, añadiendo item a la cesta.');
          this.addItemToCart(cartItem);
        }
      },
      error: (err: any) => {
        console.error('Error al obtener la cesta:', err);
        alert('Hubo un error al obtener la cesta. Inténtalo de nuevo.');
      }
    });
  }

  private addItemToCart(cartItem: { userId: string, jerseyId: string, quantity: number }): void {
    console.log('Añadiendo item a la cesta:', cartItem);
    this.apiService.addToCart(cartItem).subscribe({
      next: () => {
        console.log('Item añadido a la cesta exitosamente');
        alert('Item añadido a la cesta');
      },
      error: (err: any) => {
        console.error('Error al añadir el item a la cesta:', err);
        alert('Hubo un error al añadir el item a la cesta. Inténtalo de nuevo.');
      }
    });
  }

  onFilterChanged(filter: any): void {
    const filtered = this.jerseys().filter((jersey: Jersey) => {
      return (!filter.liga || jersey.league === filter.liga);
    });
    this.filteredJerseys.set(filtered);
  }

  onSearch(teamName: string): void {
    this.filteredJerseys.set(this.jerseys().filter((jersey: Jersey) => jersey.team.toLowerCase().includes(teamName.toLowerCase())));
  }
}