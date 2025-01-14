import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../Services/api.service';
import { Cart } from '../models/Cart';
import { PopupService } from '../Services/popup.service';

@Component({
  selector: 'app-cesta',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cesta.component.html',
  styleUrls: ['./cesta.component.css'],
})
export class CestaComponent implements OnInit {
  private apiService = inject(ApiService);
  cart: Cart | null = null;
  isLoggedIn: boolean = false;
  private popupService = inject(PopupService);

  ngOnInit(): void {
    this.isLoggedIn = this.apiService.isLoggedIn();
    if (this.isLoggedIn) {
        const user = this.apiService.getLoggedInUser(); // Obtiene el usuario actual
        console.log('Usuario recuperado:', user); // Verifica qué se está recuperando

        if (user) {
            const userId = user._id; // Usa el ID del usuario
            console.log('ID de usuario:', userId); // Verifica que userId no sea undefined

            const cartId = JSON.parse(localStorage.getItem('user') || 'null')?.cartId;
            console.log('ID del carrito:', cartId); // Verifica que cartId no sea undefined

            if (cartId) {
                this.apiService.getCartByUser(userId).subscribe({
                    next: (cart) => {
                        this.cart = cart;
                        console.log('Carrito obtenido:', cart);
                        
                    },
                    error: (err) => console.error('Error obteniendo la cesta:', err),
                });
            } else {
                console.error('cartId es undefined.');
            }
        } else {
            console.error('No hay usuario autenticado.');
        }
    }
}
  openRegisterPopup(): void {
  this.popupService.showPopup();
  }

  private loadCart(): void {
    const user = this.apiService.getLoggedInUser();
    if (user) {
      console.log('ID de usuario para obtener el carrito:', user._id); // Verifica el ID
      this.apiService.getCartByUser(user._id).subscribe({
        next: (cart) => {
          console.log('Carrito obtenido:', cart);
          this.cart = cart;
        },
        error: (err) => {
          console.error('Error obteniendo la cesta:', err);
        },
      });
    }
  }

  removeFromCart(itemId: string): void {
    const user = this.apiService.getLoggedInUser();
    console.log('Usuario obtenido en ngOnInit:', user); // Verifica el usuario obtenido
    const cartId = JSON.parse(localStorage.getItem('user') || 'null')?.cartId;
    if (user) {
      // Busca el ítem en el carrito usando el id del jersey
      const item = this.cart?.items.find(i => i.jersey.id === itemId);

      if (item) {
        // Decrementa la cantidad
        if (item.quantity > 1) {
          item.quantity--; // Disminuir la cantidad en 1
          this.updateCartItem(item); // Actualiza el carrito en el backend
        } else {
          // Si la cantidad es 1, elimínalo completamente
          this.apiService.deleteFromCart(item.jersey.id).subscribe({
            next: () => {
              console.log('Item eliminado de la cesta:', itemId);
              this.loadCart(); // Recarga la cesta después de eliminar un ítem
            },
            error: (err) => {
              console.error('Error al eliminar el item de la cesta:', err);
              alert('Hubo un error al eliminar el item de la cesta. Inténtalo de nuevo.');
            }
          });
        }
      } else {
        console.error('Ítem no encontrado en la cesta');
      }
    } else {
      console.error('Usuario no autenticado');
    }
  }

  // Método para actualizar el ítem en el carrito
  private updateCartItem(item: any): void {
    const user = this.apiService.getLoggedInUser();
    if (user) {
      const updatedItem = {
        userId: user._id,
        jerseyId: item.jersey.id, // Asegúrate de que estás utilizando el id correcto
        quantity: item.quantity,
      };
      this.apiService.updateCartItem(updatedItem).subscribe({
        next: () => {
          console.log('Ítem actualizado en la cesta:', updatedItem);
          this.loadCart(); // Recarga la cesta para reflejar cambios
        },
        error: (err) => {
          console.error('Error al actualizar el item en la cesta:', err);
          alert('Hubo un error al actualizar el item en la cesta. Inténtalo de nuevo.');
        }
      });
    } else {
      console.error('Usuario no autenticado');
    }
  }

  calculateTotal(): number {
    if (!this.cart) return 0; // Si no hay cesta, retorna 0
    return this.cart.items.reduce((total, item) => {
      // Reduce los items de la cesta a un único valor
      return total + (item.jersey.price || 0) * item.quantity; // Asegúrate de que price esté definido
    }, 0);
  }

  sendEmail(): void {
    if (!this.cart || this.cart.items.length === 0) {
      alert('No hay items en la cesta para enviar.');
      return;
    }

    let emailBody = "Querido Cliente, Introduzca su nombre en los espacios donde se indique [cliente]\n\n";
    emailBody += 'Cesta de [cliente]:\n\n';

    this.cart.items.forEach(item => {
      emailBody += `Equipo: ${item.jersey.team}\n`;
      emailBody += `Precio: ${item.jersey.price} €\n`;
      emailBody += `Temporada: ${item.jersey.season}\n`;
      emailBody += `Cantidad: ${item.quantity}\n`;
      emailBody += '---------------------------\n';
    });

    const total = this.calculateTotal();
    emailBody += `Total: ${total} €\n`;

    const email = 'retroscore24@gmail.com';
    const subject = 'Cesta de [cliente]';
    const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailBody)}`;

    window.location.href = mailtoLink;
  }
}
