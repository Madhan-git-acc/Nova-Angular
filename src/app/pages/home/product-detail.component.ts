import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {
  product: any = null;
  selectedImage: string = '';
  selectedSize: string = '';
  selectedColor: string = '';
  quantity: number = 1;
  addedMsg: string = '';
  error: string = '';
  loading = true;
  addingToCart = false;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.productService.getById(+id!).subscribe(p => {
      this.product = p;
      this.selectedImage = p.images?.[0] || '';
      this.selectedSize = p.sizes?.split(',')[0] || '';
      this.selectedColor = p.colors?.split(',')[0] || '';
      this.loading = false;
    });
  }

  get sizes(): string[] {
    return this.product?.sizes?.split(',') ?? [];
  }

  get colors(): string[] {
    return this.product?.colors?.split(',') ?? [];
  }

  get discount(): number {
    if (!this.product?.salePrice) return 0;
    return Math.round(((this.product.price - this.product.salePrice) / this.product.price) * 100);
  }

  selectImage(img: string): void {
    this.selectedImage = img;
  }

  addToCart(): void {
    if (!this.auth.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    if (this.addingToCart) return; // prevent double click

    this.addingToCart = true;
    this.error = '';
    this.addedMsg = '';

    this.cartService.addToCart({
      productId: this.product.id,
      quantity: this.quantity,
      size: this.selectedSize,
      color: this.selectedColor
    }).subscribe({
      next: () => {
        this.addingToCart = false;
        this.addedMsg = '✓ Added to cart!';
        // Auto-clear success message after 2.5 seconds
        setTimeout(() => {
          if (this.addedMsg === '✓ Added to cart!') this.addedMsg = '';
        }, 2500);
      },
      error: (err) => {
        this.addingToCart = false;
        this.error = 'Could not add to cart. Please try again.';
        // Auto-clear error after 3 seconds
        setTimeout(() => this.error = '', 3000);
      }
    });
  }

  get stars(): number[] {
    return [1, 2, 3, 4, 5];
  }
}