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
import { AuthGuard } from './guards/auth.guard';
import { ConfirmModalComponent } from './pages/confirmation-modal/confirm-modal.component';
import { ImageUrlPipe } from './pipes/image-url.pipe';

// Import your components here as you create them


const routes: Routes = [
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'products', component: ProductListComponent, canActivate: [AuthGuard] },
  { path: 'products/:id', component: ProductDetailComponent, canActivate: [AuthGuard] },
  { path: 'cart', component: CartComponent, canActivate: [AuthGuard] },
  { path: 'checkout', component: CheckoutComponent, canActivate: [AuthGuard] },
  { path: 'orders', component: OrdersComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },    // redirects to protected home
  { path: '**', redirectTo: '/home' }                     // wildcard also goes to home (protected)
];
@NgModule({
  declarations: [
    AppComponent, HomeComponent, ProductListComponent, ProductDetailComponent,
    CartComponent, CheckoutComponent, LoginComponent, RegisterComponent,
    OrdersComponent, NavbarComponent, ConfirmModalComponent, ImageUrlPipe
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