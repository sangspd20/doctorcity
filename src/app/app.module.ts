import { GoService } from './services/go.service';
import { environment } from './../environments/environment';
import { AuthService } from './services/auth.service';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LoginComponent } from './auth/login/login.component';
import { RootComponent } from './root/root.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from "@angular/fire/firestore";
import { AngularFireFunctionsModule } from '@angular/fire/functions';
import { AngularFireStorageModule, BUCKET } from '@angular/fire/storage';
import { NotifierModule } from "angular-notifier";
import { RegistrationComponent } from './auth/registration/registration.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CookieService } from 'ngx-cookie-service';
import { MyAccountDetailComponent } from './root/my-account-detail/my-account-detail.component';
import { PhoneNumbersComponent } from './share-component/phone-numbers/phone-numbers.component';
import { GenderSelectorComponent } from './share-component/gender-selector/gender-selector.component';
import { DatePickerComponent } from './share-component/date-picker/date-picker.component';
import { WelcomeCustomerComponent } from './root/welcome-customer/welcome-customer.component';
import { UserManagementComponent } from './root/user-management/user-management.component';
import { UserListComponent } from './root/user-management/user-list/user-list.component';
import { UserDetailComponent } from './root/user-management/user-detail/user-detail.component';
import { QuanLyPhienKhamComponent } from './root/quan-ly-phien-kham/quan-ly-phien-kham.component';
import { DanhSachPhienKhamComponent } from './root/quan-ly-phien-kham/danh-sach-phien-kham/danh-sach-phien-kham.component';
import { ThongTinTongQuanComponent } from './root/quan-ly-phien-kham/thong-tin-tong-quan/thong-tin-tong-quan.component';
import { TrieuChungItemComponent } from './root/quan-ly-phien-kham/trieu-chung-item/trieu-chung-item.component';
import { QuanLyChanDoanComponent } from './root/quan-ly-phien-kham/quan-ly-chan-doan/quan-ly-chan-doan.component';
import { DonThuocComponent } from './root/quan-ly-phien-kham/don-thuoc/don-thuoc.component';
import { DichVuItemComponent } from './root/quan-ly-phien-kham/dich-vu-item/dich-vu-item.component';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { XuLyItemComponent } from './root/quan-ly-phien-kham/xu-ly-item/xu-ly-item.component';
import { BadgeModule } from 'primeng/badge';
import { MultiSelectModule } from 'primeng/multiselect';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { TooltipModule } from 'primeng/tooltip';
import { QuanLyThanhToanComponent } from './root/quan-ly-thanh-toan/quan-ly-thanh-toan.component';
import { DanhSachNhaCungCapComponent } from './root/quan-ly-thanh-toan/danh-sach-nha-cung-cap/danh-sach-nha-cung-cap.component';
import { CanLamSangComponent } from './root/quan-ly-phien-kham/can-lam-sang/can-lam-sang.component';
import { NgxDocViewerModule} from 'ngx-doc-viewer';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RootComponent,
    PageNotFoundComponent,
    RegistrationComponent,
    MyAccountDetailComponent,
    PhoneNumbersComponent,
    GenderSelectorComponent,
    DatePickerComponent,
    WelcomeCustomerComponent,
    UserManagementComponent,
    UserListComponent,
    UserDetailComponent,
    QuanLyPhienKhamComponent,
    DanhSachPhienKhamComponent,
    ThongTinTongQuanComponent,
    TrieuChungItemComponent,
    QuanLyChanDoanComponent,
    DonThuocComponent,
    DichVuItemComponent,
    XuLyItemComponent,
    QuanLyThanhToanComponent,
    DanhSachNhaCungCapComponent,
    CanLamSangComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    AppRoutingModule,
    NgbModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireFunctionsModule,
    AngularFireStorageModule,
    NotifierModule,
    FontAwesomeModule,
    DropdownModule,
    ButtonModule,
    MultiSelectModule,
    InputTextModule,
    CheckboxModule,
    TooltipModule,
    BadgeModule,
    DialogModule,
    NgxDocViewerModule,
  ],
  providers: [
    { provide: BUCKET, useValue: environment.firebase.storageBucket },
    AuthService, GoService, CookieService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
