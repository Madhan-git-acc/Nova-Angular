import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ProductService } from '../../services/product.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  products: any[] = [];
  categories: any[] = [];
  total = 0;
  loading = false;

  filters: any = {
    categoryId: null,
    search: '',
    minPrice: null,
    maxPrice: null,
    featured: null,
    page: 1,
    pageSize: 12
  };

  constructor(
    private productService: ProductService,
    private http: HttpClient,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.http.get<any[]>(`${environment.apiUrl}/categories`)
      .subscribe(c => this.categories = c);

    this.route.queryParams.subscribe(params => {
      if (params['categoryId']) this.filters.categoryId = +params['categoryId'];
      if (params['featured']) this.filters.featured = params['featured'];
      this.loadProducts();
    });
  }

  loadProducts(): void {
    this.loading = true;
    this.productService.getAll(this.filters).subscribe(r => {
      this.products = r.data;
      this.total = r.total;
      this.loading = false;
    });
  }

  onFilterChange(): void {
    this.filters.page = 1;
    this.loadProducts();
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
    this.filters = { categoryId: null, search: '', minPrice: null, maxPrice: null, featured: null, page: 1, pageSize: 12 };
    this.loadProducts();
  }
}