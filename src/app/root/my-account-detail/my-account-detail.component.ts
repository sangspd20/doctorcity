import { NotifierService } from 'angular-notifier';
import { AngularFireAuth } from '@angular/fire/auth';
import { AuthService } from './../../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { User } from 'src/app/models/user';
import { faCalendarAlt } from '@fortawesome/free-regular-svg-icons';
@Component({
  selector: 'app-my-account-detail',
  templateUrl: './my-account-detail.component.html',
  styleUrls: ['./my-account-detail.component.css']
})
export class MyAccountDetailComponent implements OnInit {
  icon = {calendar:faCalendarAlt};
  newUser = new User();
  photoFile?: File|null;
  constructor(
    public authSv: AuthService,
    private afs: AngularFirestore,
    private afAuth: AngularFireAuth,
    private storage: AngularFireStorage,
    private notifier: NotifierService
  ) { 
  }

  ngOnInit(): void {
  }

  submit(){
    console.log("[MyAccountDetailComponent]",this.newUser)
    this.afs.doc<User>('User/'+this.authSv.profileID).update(Object.assign({}, this.newUser)).then(()=>{
      this.notifier.notify("success","Cập nhật thông tin hồ sơ thành công!")
    })
  }
  addToPreUpdate(name:any,value:any){
    // this.newUser[name] = value;
  }
  show(value:any){
    console.log(value)
  }
  uploadPhoto(event: any){
    console.log("[MyAccountDetailComponent]",event);
    const file = event.target?.files[0];
    if(file?.size > 2097152){
      this.notifier.notify("warning","File ảnh không được quá 2MB.")
    }else{
      if(file && this.authSv.profileID){
        const filePath = 'user-avatar/'+this.authSv.profileID;
        const ref = this.storage.ref(filePath);
        const task = ref.put(file);
        task.then(uploadTaskSnapshot=>{
          ref.getDownloadURL().toPromise().then(url=>{
            this.afs.doc<User>('User/'+this.authSv.profileID).update({profile:url as string}).then(()=>{
              this.notifier.notify("success","Cập nhật ảnh đại diện thành công")
            })
          })
          
        });
        task.catch(error=>{
          this.notifier.notify("error","Upload ảnh đại diện thất bại.")
        })
      }
    }
    
  }
}
