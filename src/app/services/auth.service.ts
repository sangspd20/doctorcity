import { ConsoleLogService } from './console-log.service';
import { UserProfileId } from './../models/user-profile-id';

import { CookieService } from 'ngx-cookie-service';
import { NotifierService } from 'angular-notifier';
import { GoService } from './go.service';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import firebase from 'firebase/app';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { User } from 'src/app/models/user';
import { textChangeRangeIsUnchanged } from 'typescript';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private log = new ConsoleLogService(this.constructor.name);
  public user = new User();
  public claims: any;
  public profileID?: string;
  public uid = '';
  public firebaseUser: firebase.User | null = null;
  constructor(
    private afAuth: AngularFireAuth,
    private go: GoService,
    private notifier: NotifierService,
    private cookieSv: CookieService,
    private afs: AngularFirestore
  ) {}

  getRecentUser (email?: any) {
    // return (this.afs.firestore.doc(`profiles/${uid}`).get())
    // return (this.afs.firestore.doc(`profiles`).)

    // return this.afs.collection('fl_content').valueChanges();
    // return this.afs.collection("fl_content", ref => ref.where("_fl_meta_.schema", "==", "profiles").where("email","==",`${email}`)).valueChanges()
    // return this.afs.collection("fl_content", ref => ref.where("_fl_meta_.schema", "==", "profiles")).valueChanges()
    return this.afs
    .collection('fl_content', (ref) =>
      ref
        .where('_fl_meta_.schema', '==', 'profiles')
        .where('email','==',`${email}`)
        
    )
    .valueChanges()
    
  }

  signOut(backLink?: String) {
    console.log('[AuthService]', 'Sign Out!');
    this.afAuth.signOut().then(() => {
      if (this.cookieSv.check('email')) this.cookieSv.delete('email');
      if (this.cookieSv.check('password')) this.cookieSv.delete('password');

      this.go.login();
    });
  }

  signInWithEmail(email: string, password: string, isSave?: boolean) {
    // console.log("[AuthService] ",email," / ",password);

    console.log('[AuthService]', 'Save cookies? ', isSave);
    this.afAuth
      .signInWithEmailAndPassword(email, password)
      .then((uCre) => {
        if (isSave) {
          this.cookieSv.set('email', email);
          this.cookieSv.set('password', password);
        } else {
          this.cookieSv.delete('email');
          this.cookieSv.delete('password');
        }
        this.showSuccessAndGo(uCre);
      })
      .catch((reason) => this.showFailed(reason));
  }

  signInWithGoogle() {
    return this.afAuth
      .signInWithPopup(new firebase.auth.GoogleAuthProvider())
      .then((uCre) => this.showSuccessAndGo(uCre))
      .catch((reason) => this.showFailed(reason));
  }

  signInWithFacebook() {
    return this.afAuth
      .signInWithPopup(new firebase.auth.FacebookAuthProvider())
      .then((uCre) => this.showSuccessAndGo(uCre))
      .catch((reason) => this.showFailed(reason));
  }

  showSuccessAndGo(uCre: firebase.auth.UserCredential) {
    console.log('showSuccessAndGo uCre', uCre);
    this.log.show(uCre);
    uCre.user?.getIdTokenResult(true).then((r) => {
      this.claims = r.claims;
      if (this.claims && (this.claims.r as Array<number>).includes(3)) {
        this.log.show('Chuyển đến quản lý phiên khám');
        this.go.quan_ly_phien_kham();
      }
    });
    this.firebaseUser = uCre.user;
    this.uid = uCre.user!.uid;
    this.notifier.notify('success', 'Đăng nhập thành công!');
    this.notifier.notify(
      'info',
      `Chào mừng ${
        uCre.user!.displayName ? uCre.user!.displayName : 'bạn'
      } quay trở lại!`
    );
    this.go.home();
  }

  private showFailed(reason: any) {
    console.log('[AuthService]', reason.code);
    let message = '';
    let suggest = '';
    switch (reason.code) {
      case 'auth/wrong-password':
        message = 'Sai mật khẩu!';
        suggest = 'Hãy thử lại với một mật khẩu khác.';
        break;
      case 'auth/user-not-found':
        message = 'Email này không có trong hệ thống!';
        suggest = 'Hãy sử dụng một email khác hoặc đăng ký mới.';
        break;
      case 'auth/popup-closed-by-user':
        message = 'Cửa sổ đăng nhập đã bị đóng khi chưa hoàn thành đăng nhập.';
        suggest =
          'Hãy thử quá trình đăng nhập lại hoặc sử dụng một tài khoản khác.';
        break;
      default:
        message = 'Đăng nhập thất bại!';
        suggest = 'Vui lòng thử lại bằng tài khoản khác.';
        break;
    }
    this.notifier.notify('error', message);
    this.notifier.notify('warning', suggest);
  }

   public setupUserProfile(uid: string) {
    // let cityRef = this.afs.collection('userProfileID').doc(uid);
    this.afs
      .collection<UserProfileId>('userProfileID')
      .doc(uid)
      .get()
      .toPromise()
      .then((doc) => {
        if (!doc.exists) {
          this.notifier.notify('info', 'Khởi tạo hồ sơ mới cho bạn.');
          let newProfileData: User = {};
          if (this.firebaseUser) {
            if (this.firebaseUser.displayName)
              newProfileData.name = this.firebaseUser.displayName;
            if (this.firebaseUser.email)
              newProfileData.email = this.firebaseUser.email;
            if (this.firebaseUser.phoneNumber)
              newProfileData.mobile = [this.firebaseUser.phoneNumber];
            if (this.firebaseUser.photoURL)
              newProfileData.profile = this.firebaseUser.photoURL;
            newProfileData.role = [2];
          }
          this.afs
            .collection<User>('User')
            .add(Object.assign({}, newProfileData))
            .then((user) => {
              console.log('[AuthService]', 'Đã tạo user: ', user.id);
              this.afs
                .collection<UserProfileId>('userProfileID')
                .doc(uid)
                .set({ profileID: user.id })
                .then(() => this.setupUserProfile(uid));
            });
          // this.afs.collection<UserProfileId>('userProfileID').doc(uid).set()
        } else {
          this.profileID = (doc.data() as UserProfileId).profileID;
          this.afs
            .doc<User>('User/' + this.profileID)
            .valueChanges()
            .subscribe((user) => {
              this.user = user as User;
              // console.log("[AuthService]", 'Go first component');
              // this.go.first(user?.role);

              if (this.claims && (this.claims.r as Array<number>).includes(3)) {
                this.log.show('Chuyển đến quản lý phiên khám');
                this.go.quan_ly_phien_kham();
              }
            });
        }
      })
      .catch((err) => {
        console.log('[AuthService]', 'Error getting document', err);
      });
  }
}
