import { User } from 'src/app/models/user';
import { UserProfileId } from './../models/user-profile-id';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { AuthService } from './../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { ConsoleLogService } from '../services/console-log.service';
import { Observable } from 'rxjs';
import { ListItemMenu } from '../models/item-active-menu';
import { AppConstants } from '../constant/app.constant';
import { UserLatestService } from '../services/current-user.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-root',
  templateUrl: './root.component.html',
  styleUrls: ['./root.component.css'],
})
export class RootComponent implements OnInit {
  listItemMenu = new ListItemMenu();
  listInfoUser: any[] = [];
  userMail: any

  isCollapsed : boolean = false;

  private log = new ConsoleLogService(this.constructor.name);
  activeID = 2;
  constructor(
    public authSv: AuthService,
    public afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private userService: UserLatestService,
    private cookieSv: CookieService
  ) {}

  async ngOnInit() {
    this.listItemMenu = new ListItemMenu();
    this.authSv.user = new User();
    // Set up Profile base by UID from auth or get it from authState
    if (this.authSv.uid) {
      // console.log('this.authSv111',this.authSv)
      // console.log('this.authSve.firebase.email',this.authSv.firebaseUser?.email)
      console.log(
        '[RootComponent]',
        'Setup Profile Observable base on UID from Auth Processing: ',
        this.authSv.user
      );
      await this.authSv.setupUserProfile(this.authSv.uid);
      // let userEmail = await this.authSv.user.email
      let userEmail =  this.authSv.firebaseUser?.email

      this.getInforRecentUser(userEmail);
      // TESSSSSSSSSSSSSSST
      // this.test1(this.authSv.user.email)
    } else {
      console.log(
        '[RootComponent]',
        'Setup Profile by call authState and get UID'
      );
      let authStateSub = this.afAuth.authState.subscribe(async (user) => {
        if (user) {
          console.log('user', user);
          this.authSv.firebaseUser = user;
          console.log(
            '[RootComponent]',
            'authState Subscriber get UID: ',
            user?.uid
          );
          await this.authSv.setupUserProfile(user?.uid);
          authStateSub.unsubscribe();

          // TESSSSSSSSSSSSSST
          // this.test1(user.email)

          this.getInforRecentUser(user.email);
        }
      });
    }
    //get recent User in table profiles
  }

  getInforRecentUser(email?: any) {
    console.log('getInforRecentUser email', email);
    this.userMail = email
    this.authSv.getRecentUser(email).subscribe(async (res) => {
      if (res) {
        this.listInfoUser = res;
        await this.convertTimeLastModified()
        this.checkItemActiveByRole();
      }
    });
  }

  async checkItemActiveByRole() {
    let leng = this.listInfoUser.length;
    if (leng > 0) {

      let objInforUser = await this.getLatesUpdateUser();

      //convert data trung tam ho tro
      if (objInforUser && objInforUser['coSoHanhNghe']) {
        let objCoSoHanhNghe = await objInforUser.coSoHanhNghe.get();
        let jsonCoSoHanhNghe = objCoSoHanhNghe.data();
        objInforUser['jsonCoSoHanhNghe'] = jsonCoSoHanhNghe;
      }
      // console.log('objInforUser mainnnnnnn11111', objInforUser);

      // this.userService.setLatestUser(objInforUser)
      if(objInforUser) {
        let jsonUser = JSON.stringify(objInforUser);
        localStorage.setItem('jsonUser',jsonUser)
      }
      let arrRole = objInforUser[AppConstants.PHAN_QUYEN_CHUC_NANG];
      // console.log('arrRole', arrRole);

      if (arrRole.includes(AppConstants.HO_TRO_CHUYEN_MON) && objInforUser['isSupporter']) {
        this.listItemMenu.hoTroChuyenMon = true;
      }
      if (arrRole.includes(AppConstants.DU_LIEU_TRIEU_CHUNG) && objInforUser['isSupporter']) {
        this.listItemMenu.duLieuTrieuChung = true;
      }
      if (arrRole.includes(AppConstants.DU_LIEU_CHAN_DOAN) && objInforUser['isSupporter']) {
        this.listItemMenu.duLieuChanDoan = true;
      }
      if (arrRole.includes(AppConstants.DU_LIEU_THUOC) && objInforUser['isSupporter']) {
        this.listItemMenu.duLieuThuoc = true;
      }
      if (arrRole.includes(AppConstants.DU_LIEU_DICH_VU_CHUYEN_MON) && objInforUser['isSupporter']) {
        this.listItemMenu.duLieuDichVuChuyenMon = true;
      }
      if (arrRole.includes(AppConstants.QUAN_LY_NGUOI_DUNG) && objInforUser['isSupporter']) {
        this.listItemMenu.quanLyNguoiDung = true;
      }
      if (arrRole.includes(AppConstants.DONG_GOI_DICH_VU) && objInforUser['isSupporter']) {
        this.listItemMenu.dongGoiDichVu = true;
      }
      if (arrRole.includes(AppConstants.QUAN_LY_YEU_CAU_DICH_VU) && objInforUser['isSupporter']) {
        this.listItemMenu.quanLyYeuCauDichVu = true;
      }
      if (arrRole.includes(AppConstants.QUAN_LY_TRUNG_TAM_CHUYEN_MON) && objInforUser['isSupporter']) {
        this.listItemMenu.quanLyTrungTamChuyenMon = true;
      }
    }
  }

  convertTimeLastModified() {
    this.listInfoUser.forEach((item:any) => {
      let time =item._fl_meta_.lastModifiedDate.toMillis() 
      item['lastTimeModified'] = time
    });
    
  }

  async processCoSoHanhNgheData(objInforUser: any) {
    if(objInforUser.coSoHanhNghe && objInforUser.coSoHanhNghe!= null) {
      let objCoSoHanhNghe = await objInforUser.coSoHanhNghe.get()
      let jsonCoSoHanhNghe = objCoSoHanhNghe.data()
  
      objInforUser['jsonCoSoHanhNghe'] = jsonCoSoHanhNghe
    }
    return objInforUser
    
  }

  getLatesUpdateUser() {
    var leng = this.listInfoUser.length;
    var currentUser = this.listInfoUser[0];
    if (leng == 1) {
      currentUser = this.processCoSoHanhNgheData(currentUser)
      return currentUser;
    } else {
      const lastTimeModified = Math.max.apply(
        Math,
        this.listInfoUser.map(function (o) {
          // return Number(o._fl_meta_.lastModifiedDate.seconds + o._fl_meta_.lastModifiedDate.nanoseconds);
          return o.lastTimeModified
        })
      );

      currentUser = this.listInfoUser.find(function (o) {
        // return Number(o._fl_meta_.lastModifiedDate.seconds + o._fl_meta_.lastModifiedDate.nanoseconds) == lastTimeModified;
        return o.lastTimeModified == lastTimeModified
      });
      console.log('currentUser root', currentUser);
      currentUser = this.processCoSoHanhNgheData(currentUser)

      return currentUser;
    }
  }

  // test1(email?: any) {
  //   console.log("Get Profile for: ",email)
  //   // this.afs.collection("fl_content",ref=>ref.where("_fl_meta_.schema", "==", "profiles").where("uIDs", "array-contains",uid)).valueChanges().subscribe(data=>{
  //   //   console.log('dataaaaaaaa',data)
  //   // })

  //   this.afs.collection("fl_content",ref=>ref.where("_fl_meta_.schema", "==", "profiles").where("email", "==",`${email}`)).valueChanges().subscribe(data=>{
  //     console.log('dataaaaaaaa',data)
  //   })
    
  // }

  test(uid: string | null) {
    // console.log("Get Profile for: ",uid)
    // this.afs.collection("fl_content",ref=>ref.where("_fl_meta_.schema", "==", "profiles").where("_fl_meta_.locale", "==", "vi").where("uIDs", "array-contains",this.authSv.uid)).valueChanges().subscribe(data=>{
    //   console.log(data[0])
    // })
    this.afs
      .collection('fl_content', (ref) =>
        ref.where('_fl_meta_.schema', '==', 'ichi')
      )
      .valueChanges()
      .subscribe((data) => {
        console.log('Selected ICHI: ', data[0]);
        const ichiRef = this.afs
          .collection('fl_content')
          .doc((data[0] as any).id).ref;
        this.afs
          .collection('fl_content', (ref) =>
            ref
              .where('_fl_meta_.schema', '==', 'services')
              .where('ichi', '==', ichiRef)
          )
          .valueChanges()
          .subscribe((data) => {
            console.log('Selected service: ', data[0]);
          });
      });
  }
}
