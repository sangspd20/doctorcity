import { CookieService } from 'ngx-cookie-service';
import { AngularFireAuth } from '@angular/fire/auth';
import { GoService } from '../../services/go.service';
import { AuthService } from '../../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { NotifierService } from 'angular-notifier';
import { NgbModal,NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { faFacebookF,faGoogle } from '@fortawesome/free-brands-svg-icons';

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  isSaveCookies = false;
  email="";
  password="";
  icon = {fb:faFacebookF,go:faGoogle};
  constructor(
    public afAuth: AngularFireAuth,
    public authSv: AuthService,
    public notifier: NotifierService,
    public go: GoService,
    public mdSv: NgbModal,
    private cookieSv: CookieService
  ) { 
    if(this.cookieSv.check("email") && this.cookieSv.check("password")) {
      this.notifier.notify("default","Đang đăng nhập bằng thông tin đã lưu...")
      this.email=this.cookieSv.get("email");
      this.password=this.cookieSv.get("password");
      this.authSv.signInWithEmail(this.email,this.password,true);
    }
  }

  ngOnInit(): void {
  }
  resetPassword(){
    console.log("[LoginComponent]","Start reset!")
    this.afAuth.sendPasswordResetEmail(this.email).then(user=>{
      this.notifier.notify("success",`Gửi email khôi phục mật khẩu đến ${this.email} thành công!`)
      this.notifier.notify("info","Bạn vui lòng kiểm tra hộp thư đến và mở link nhận được để tạo lại mật khẩu.")
    })
  }
}
