import { GoService } from './../../services/go.service';
import { AuthService } from './../../services/auth.service';
import { NotifierService } from 'angular-notifier';
import { Component, OnInit } from '@angular/core';
import { faEnvelope,faLock } from '@fortawesome/free-solid-svg-icons';
import { faFacebookF,faTwitter,faGoogle } from '@fortawesome/free-brands-svg-icons';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {
  email="";
  password="";
  rePassword="";

  icon = {envelope: faEnvelope, lock: faLock, facebook: faFacebookF, tweeter: faTwitter, google: faGoogle}
  constructor(
    public afAuth: AngularFireAuth,
    public notifier: NotifierService,
    public authSv: AuthService,
    public go: GoService
  ) { }

  ngOnInit(): void { 
  }
  register(){
    // console.log("[RegistrationComponent] ",this.email," / ",this.password)
    this.password = this.password.trim();
    this.rePassword = this.rePassword.trim();
    if(this.password.length && this.rePassword.length && this.password === this.rePassword){ 
      this.afAuth.createUserWithEmailAndPassword(this.email,this.password)
      .then(user=>{
        this.notifier.notify("success",`Đăng ký tài khoản ${this.email} thành công!`)
        this.notifier.notify("info",`Bạn đã có thể đăng nhập bằng ${this.email} và mật khẩu vừa mới đăng ký vào lần truy cập sau.`)
        this.go.home()

      })
      .catch(reason=>{
        switch(reason?.code){
          case "auth/email-already-in-use":
            this.notifier.notify("error",`Địa chỉ email ${this.email} đã tồn tại!`);
            this.notifier.notify("warning","Vui lòng nhập một địa chỉ email khác hoặc chuyển sang đăng nhập bằng "+this.email+".")
            break;
          case "auth/invalid-email":
            this.notifier.notify("error",`Địa chỉ email không đúng!`);
            this.notifier.notify("warning","Vui lòng nhập một địa chỉ email khác.")
            break;
          case "auth/weak-password":
            this.notifier.notify("error",`Mật khẩu yếu!`);
            this.notifier.notify("warning","Vui lòng nhập một mật khẩu dài tối thiểu 6 ký tự.")
            break;
          default:
            this.notifier.notify("error",`Có lỗi. Không thể đăng ký được`);
            this.notifier.notify("warning","Vui lòng thử đăng ký lại theo một cách khác ")
            break;
        }
      })
    }else{
      this.notifier.notify("error",`Mật khẩu không khớp hoặc còn trống.`)

    }
  }
}
