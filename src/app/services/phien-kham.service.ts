import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { NotifierService } from 'angular-notifier';
import firebase from 'firebase/app';
import { CookieService } from 'ngx-cookie-service';
import { User } from 'src/app/models/user';
import { GoService } from './go.service';

@Injectable({
  providedIn: 'root',
})
export class PhienKhamService {
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
  ) { }

  getRecentPhienKham(uid?: string) {
    // return (this.afs.firestore.doc(`profiles/${uid}`).get())
    // return (this.afs.firestore.doc(`profiles`).)

    // return this.afs.collection('fl_content').valueChanges();
    // return this.afs.collection("fl_content", ref => ref.where("_fl_meta_.schema", "==", "profiles").where("email","==",`${email}`)).valueChanges()
    // return this.afs.collection("fl_content", ref => ref.where("_fl_meta_.schema", "==", "profiles")).valueChanges()
    return this.afs
      .collection<any[]>('fl_content', (ref) =>
        ref.where('_fl_meta_.schema', '==', 'phienKham')
      )
      .valueChanges();
  }

  getKhachHang(uid?: string) {
    return this.afs
      .collection<any[]>('fl_content', (ref) =>
        ref.where('_fl_meta_.schema', '==', 'profiles')
      )
      .valueChanges();
  }

  getDSYeuCau(uid?: string) {
    return this.afs
      .collection<any>('fl_content', (ref) =>
        ref.where('_fl_meta_.schema', '==', 'request')
      )
      .valueChanges();
  }

  getCoSoYte() {
    return this.afs
      .collection<any>('fl_content', (ref) =>
        ref.where('_fl_meta_.schema', '==', 'coSoYTe')
      )
      .valueChanges();
  }

  // getPhienKhamById
}
