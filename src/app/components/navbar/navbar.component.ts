import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { NavigationEnd, Router } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';
import { filter } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent {
  user$ = this.auth.user$;
  cartCount$ = this.cart.cartCount$;
  menuOpen = false;
  showLogoutModal = false; // control modal visibility

  constructor(
    private auth: AuthService,
    private cart: CartService,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        // Re-fetch user status on every navigation
        this.user$ = this.auth.user$;
      });
    this.user$.subscribe(() => {
      this.cdr.detectChanges(); // force re-render
    });
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
    if (this.menuOpen) {
      document.body.classList.add('menu-open');
    } else {
      document.body.classList.remove('menu-open');
    }
  }

  closeMenu() {
    this.menuOpen = false;
    document.body.classList.remove('menu-open');
  }

  openLogoutModal() {
    this.showLogoutModal = true;
    this.closeMenu();
  }

  confirmLogout() {
    this.auth.logout();
    this.router.navigate(['/login']);
    this.showLogoutModal = false;
  }

  cancelLogout() {
    this.showLogoutModal = false;
  }
}
