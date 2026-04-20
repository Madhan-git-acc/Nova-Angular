import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ProductService } from '../../services/product.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
})
export class ProductListComponent implements OnInit {
  products: any[] = [];
  categories: any[] = [];
  total = 0;
  loading = false;
  searchTerm: string = '';
  maxPrice = 10000; // default upper bound (you can fetch from backend)
  isSliding = false;

  filters: any = {
    categoryId: null,
    search: '',
    minPrice: null,
    maxPrice: null,
    featured: null,
    page: 1,
    pageSize: 12,
  };

  constructor(
    private productService: ProductService,
    private http: HttpClient,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.http
      .get<any[]>(`${environment.apiUrl}/categories`)
      .subscribe((c) => (this.categories = c));

    this.route.queryParams.subscribe((params) => {
      if (params['categoryId']) this.filters.categoryId = +params['categoryId'];
      if (params['featured']) this.filters.featured = params['featured'];
      this.loadProducts();
    });
    this.searchTerm = this.filters.search || '';
    if (this.filters.minPrice === null) this.filters.minPrice = 0;
    if (this.filters.maxPrice === null) this.filters.maxPrice = this.maxPrice;
  }

  loadProducts(): void {
    this.loading = true;
    this.productService.getAll(this.filters).subscribe((r) => {
      this.products = r.data;
      this.total = r.total;
      this.loading = false;
    });
  }

  onSearch(): void {
    this.filters.search = this.searchTerm;
    this.filters.page = 1;
    this.loadProducts();
  }

  onFilterChange(): void {
    this.filters.page = 1;
    this.loadProducts();
  }

  onPriceInput(): void {
    // Ensure min <= max
    if (this.filters.minPrice > this.filters.maxPrice) {
      [this.filters.minPrice, this.filters.maxPrice] = [
        this.filters.maxPrice,
        this.filters.minPrice,
      ];
    }
    // Also clamp within bounds
    this.filters.minPrice = Math.max(
      0,
      Math.min(this.filters.minPrice, this.maxPrice),
    );
    this.filters.maxPrice = Math.max(
      0,
      Math.min(this.filters.maxPrice, this.maxPrice),
    );

    this.onFilterChange(); // apply filters
  }

  get minPercent(): number {
    return (this.filters.minPrice / this.maxPrice) * 100;
  }

  get maxPercent(): number {
    return 100 - (this.filters.maxPrice / this.maxPrice) * 100;
  }

  onSliderInput(): void {
    // Optional: enforce min <= max
    if (this.filters.minPrice > this.filters.maxPrice) {
      this.filters.minPrice = this.filters.maxPrice;
    }
    // If you want to update the product list in real time, call onFilterChange()
    // Otherwise, wait for (change) event
  }

  prevPage(): void {
    if (this.filters.page > 1) {
      this.filters.page--;
      this.loadProducts();
    }
  }

  nextPage(): void {
    if (this.filters.page * this.filters.pageSize < this.total) {
      this.filters.page++;
      this.loadProducts();
    }
  }

  get totalPages(): number {
    return Math.ceil(this.total / this.filters.pageSize);
  }

  clearFilters(): void {
    this.filters = {
      categoryId: null,
      search: '',
      minPrice: null,
      maxPrice: null,
      featured: null,
      page: 1,
      pageSize: 12,
    };
    this.searchTerm = '';
    this.loadProducts();
  }
}
