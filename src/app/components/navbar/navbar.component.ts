import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  user$ = this.auth.user$;
  cartCount$ = this.cart.cartCount$;

  constructor(private auth: AuthService, private cart: CartService) {}

  logout() { this.auth.logout(); }
}