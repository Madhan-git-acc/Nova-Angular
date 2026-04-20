import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent implements OnInit {
  items: any[] = [];
  loading = true;
  showDeleteModal = false;
  itemToDeleteId: number | null = null;

  constructor(
    private cartService: CartService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.cartService.getCart().subscribe((data) => {
      this.items = data;
      this.loading = false;
    });
  }

  get subtotal(): number {
    return this.items.reduce((s, i) => s + i.price * i.quantity, 0);
  }

  get shipping(): number {
    return this.subtotal >= 999 ? 0 : 99;
  }

  get total(): number {
    return this.subtotal + this.shipping;
  }

  remove(id: number): void {
    this.cartService.removeItem(id).subscribe(() => {
      this.items = this.items.filter((i) => i.id !== id);
    });
  }

  checkout(): void {
    this.router.navigate(['/checkout']);
  }

  openDeleteModal(itemId: number) {
    this.itemToDeleteId = itemId;
    this.showDeleteModal = true;
  }

  confirmDelete() {
    if (this.itemToDeleteId) {
      this.remove(this.itemToDeleteId);
    }
    this.showDeleteModal = false;
  }
}
