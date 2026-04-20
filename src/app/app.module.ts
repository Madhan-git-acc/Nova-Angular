import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { NavbarComponent } from './components/navbar/navbar.component';
import { CartComponent } from './pages/home/cart.component';
import { CheckoutComponent } from './pages/home/checkout.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/home/login.component';
import { OrdersComponent } from './pages/home/orders.component';
import { ProductDetailComponent } from './pages/home/product-detail.component';
import { ProductListComponent } from './pages/home/product-list.component';
import { RegisterComponent } from './pages/home/register.component';

// Import your components here as you create them


const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'products', component: ProductListComponent },
  { path: 'products/:id', component: ProductDetailComponent },
  { path: 'cart', component: CartComponent },
  { path: 'checkout', component: CheckoutComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'orders', component: OrdersComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  declarations: [
    AppComponent, HomeComponent, ProductListComponent, ProductDetailComponent,
    CartComponent, CheckoutComponent, LoginComponent, RegisterComponent,
    OrdersComponent, NavbarComponent
  ],
  imports: [
    BrowserModule, BrowserAnimationsModule,
    HttpClientModule, FormsModule, ReactiveFormsModule,
    RouterModule.forRoot(routes)
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}