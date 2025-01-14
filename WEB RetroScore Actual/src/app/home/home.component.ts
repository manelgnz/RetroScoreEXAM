import { Component, OnInit, inject } from '@angular/core';
import { ApiService } from '../Services/api.service';
import { Title } from '@angular/platform-browser';
import { Jersey } from '../models/Jersey';
import { JerseyComponent } from "../jersey/jersey.component";
import { SliderComponent } from "../slider/slider.component";
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  standalone: true,
  styleUrls: ['./home.component.css'],
  imports: [JerseyComponent, SliderComponent, CommonModule]
})
export class HomeComponent implements OnInit {
   jerseys: Jersey[] = [];
  apiService = inject(ApiService);
  titleService = inject(Title);

  constructor() { }

  ngOnInit(): void {
    this.titleService.setTitle('RetroScore | Home');
    this.loadJerseys();
  }

  loadJerseys(): void {
    const teams = ['Real Madrid', 'FC Barcelona', 'Manchester United', 'Juventus']; // Reemplaza con los nombres de los equipos que deseas cargar

    const jerseyObservables = teams.map(team => this.apiService.getJerseyByTeam(team));
    forkJoin(jerseyObservables).subscribe((data: Jersey[][]) => {
      this.jerseys = data.flat(); // Combina los resultados de los diferentes equipos en un solo array
    }, error => {
      console.error('Error al cargar los jerseys:', error);
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
      jerseyId: jersey._id, 
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
}