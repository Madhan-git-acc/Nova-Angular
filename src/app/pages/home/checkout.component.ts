import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OrderService } from '../../services/order.service';
import { CartService } from '../../services/cart.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  form: FormGroup;
  cartItems: any[] = [];
  loading = false;
  success = false;
  error = '';

  constructor(
    private fb: FormBuilder,
    private orderService: OrderService,
    private cartService: CartService,
    private http: HttpClient,
    private router: Router
  ) {
    this.form = this.fb.group({
      fullName:    ['', Validators.required],
      line1:       ['', Validators.required],
      line2:       [''],
      city:        ['', Validators.required],
      state:       ['', Validators.required],
      postalCode:  ['', Validators.required],
      paymentMethod: ['COD', Validators.required]
    });
  }

  ngOnInit(): void {
    this.cartService.getCart().subscribe(d => this.cartItems = d);
  }

  get subtotal(): number {
    return this.cartItems.reduce((s, i) => s + i.price * i.quantity, 0);
  }

  placeOrder(): void {
    if (this.form.invalid) return;
    this.loading = true;
    const addr = this.form.value;

    this.http.post<any>(`${environment.apiUrl}/addresses`, addr).subscribe({
      next: (savedAddr) => {
        this.orderService.placeOrder({
          addressId: savedAddr.id,
          paymentMethod: this.form.value.paymentMethod
        }).subscribe({
          next: () => {
            this.success = true;
            this.loading = false;
            setTimeout(() => this.router.navigate(['/orders']), 2500);
          },
          error: () => { this.error = 'Order failed. Please try again.'; this.loading = false; }
        });
      },
      error: () => { this.error = 'Could not save address.'; this.loading = false; }
    });
  }
}