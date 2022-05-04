import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class GoService {

  constructor(
    private router: Router
  ) { }
  login(){
    console.log("[GoService]","go login");
    this.router.navigate(["/dang-nhap"]);
  }
  home() {
    console.log("[GoService]","go home");
    this.router.navigate(["/trang-chu"]);
  }
  registration(){
    console.log("[GoService]","go home");
    this.router.navigate(["/dang-ky"]);
  }
  first(role: number[]|undefined){
    if(role){
      if(role.includes(3)||role.includes(4)) this.router.navigate(["/t/quan-ly-nguoi-dung"])
      else if(role.includes(2)) this.router.navigate(["/t/chao-mung"])
    }
  }
  quan_ly_phien_kham(){
    console.log("[GoService]","Chuyển đến Quản lý Phiên khám");
    this.router.navigate(["/t/quan-ly-phien-kham"]);
  }
}
