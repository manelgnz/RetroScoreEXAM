export interface Cart {
  _id: string;  // Identificador único del carrito
  userId: string;  // ID del usuario al que pertenece el carrito
  items: Array<{
      jersey: {
          id: string;  // ID del jersey
          team: string;
          price: number;
          season: string;
          league: string;
          colour: string;
          imageURL: string;
      };
      quantity: number;
  }>;
}
