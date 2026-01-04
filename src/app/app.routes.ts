import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: 'login', loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent) },
  { path: 'register', loadComponent: () => import('./components/register/register.component').then(m => m.RegisterComponent) },
  { path: 'register-admin', loadComponent: () => import('./components/register-admin/register-admin.component').then(m => m.RegisterAdminComponent), canActivate: [authGuard] },
  { path: 'dashboard', loadComponent: () => import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent), canActivate: [authGuard] },
  { path: 'members', loadComponent: () => import('./components/members/members.component').then(m => m.MembersComponent), canActivate: [authGuard] },
  { path: 'payments', loadComponent: () => import('./components/payments/payments.component').then(m => m.PaymentsComponent), canActivate: [authGuard] },
  { path: 'payment-plans', loadComponent: () => import('./components/payment-plans/payment-plans.component').then(m => m.PaymentPlansComponent), canActivate: [authGuard] },
  { path: 'attendance', loadComponent: () => import('./components/attendance/attendance.component').then(m => m.AttendanceComponent), canActivate: [authGuard] },
  { path: 'meal-plans', loadComponent: () => import('./components/meal-plans/meal-plans.component').then(m => m.MealPlansComponent), canActivate: [authGuard] },
  { path: 'reports', loadComponent: () => import('./components/reports/reports.component').then(m => m.ReportsComponent), canActivate: [authGuard] },
  { path: 'profile', loadComponent: () => import('./components/profile/profile.component').then(m => m.ProfileComponent), canActivate: [authGuard] },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: '/dashboard' }
];

