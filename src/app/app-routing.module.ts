import { QuanLyPhienKhamComponent } from './root/quan-ly-phien-kham/quan-ly-phien-kham.component';
import { UserManagementGuard } from './root/user-management/user-management.guard';
import { UserManagementComponent } from './root/user-management/user-management.component';
import { WelcomeCustomerComponent } from './root/welcome-customer/welcome-customer.component';
import { MyAccountDetailComponent } from './root/my-account-detail/my-account-detail.component';

import { RegistrationComponent } from './auth/registration/registration.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { RootComponent } from './root/root.component';
import { LoginComponent } from './auth/login/login.component';
import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { pipe } from 'rxjs';
import { map } from 'rxjs/operators';
import { canActivate, hasCustomClaim, redirectUnauthorizedTo, redirectLoggedInTo,customClaims,AuthPipe } from '@angular/fire/auth-guard';
import { QuanLyThanhToanComponent } from './root/quan-ly-thanh-toan/quan-ly-thanh-toan.component';


const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['login']);
// const khach_hang_only = () => pipe(customClaims, map(claims => (claims.r as Array<number>).includes(1)));
const nha_cung_cap_only = () => pipe(customClaims, map(claims => (claims.r as Array<number>).includes(2))) as AuthPipe;
const nv_trung_tam_only = () => pipe(customClaims, map(claims => (claims.r as Array<number>).includes(3))) as AuthPipe;;
const nv_doctorcity_only = () => pipe(customClaims, map(claims => (claims.r as Array<number>).includes(4))) as AuthPipe;;
const admin_only = () => pipe(customClaims, map(claims => (claims.r as Array<number>).includes(5))) as AuthPipe;;

const routes: Routes = [
  { path: 'tai-khoan', component: MyAccountDetailComponent },
  { path: 'dang-ky', component: RegistrationComponent, ...canActivate(() => redirectLoggedInTo(['trang-chu'])) },
  { path: 'registration', pathMatch: 'full', redirectTo: 'dang-ky' },
  { path: 'dang-nhap', component: LoginComponent, ...canActivate(() => redirectLoggedInTo(['trang-chu'])) },
  { path: 'login', pathMatch: 'full', redirectTo: 'dang-nhap' },
  {
    path: 't',
    component: RootComponent,
    ...canActivate(() => redirectUnauthorizedTo(['dang-nhap'])),
    children: [
      { path: 'chao-mung', component: WelcomeCustomerComponent },
      { path: 'tai-khoan-cua-toi', component: MyAccountDetailComponent },
      {
        path: 'quan-ly-nguoi-dung',
        component: UserManagementComponent,
        ...canActivate(nv_doctorcity_only),
      },
      {
        path: 'quan-ly-phien-kham',
        component: QuanLyPhienKhamComponent,
      },
      {
        path: 'quan-ly-thanh-toan',
        component: QuanLyThanhToanComponent,
      },
      // { path: 'quan-ly-nguoi-dung', component: UserManagementComponent, canActivate: [UserManagementGuard]},
      { path: '', pathMatch: 'full', redirectTo: 'chao-mung' },
    ]

  },
  { path: 'trang-chu', pathMatch: 'full', redirectTo: 't' },
  { path: '', pathMatch: 'full', redirectTo: 't' },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
