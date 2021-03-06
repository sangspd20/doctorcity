import { Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { AuthService } from './../../../services/auth.service';
import { NotifierService } from 'angular-notifier';
import { User } from './../../../models/user';
import { ConsoleLogService } from './../../../services/console-log.service';
import { Component, Input, OnInit, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css']
})
export class UserDetailComponent implements OnInit {
  private log = new ConsoleLogService(this.constructor.name)
  newUser = new User();
  user$ = new Observable<User>();
  formPristine = true;
  selsectedImageFile?: File;
  imgSRC?:string;
  imgFile?: File;
  @ViewChild('profileForm') form:any;
  @ViewChild('imageSelector') imageSelector?: ElementRef;
  _collection = this.afs.collection<User>("User");

  @Input("user") set setUser(u:User){
    this.log.show("Set Input",u.docID)

    // Reset File Input
    this.resetInput();
    
    // Set userS Observable base on input
    if(u.docID) this.user$ = this._collection.doc(u.docID).valueChanges({idField: "docID"}) as Observable<User>;
    else this.user$ = new Observable<User>()
  }
  // @Output("appModelChange") emiter = new EventEmitter<User>();
  constructor(
    private notifier: NotifierService,
    private authSv: AuthService,
    private storage: AngularFireStorage,
    private afs: AngularFirestore,
  ) { }

  ngOnInit(): void {
    // this.user$ = new Observable<User>();
  }
  resetInput(){
    this.imgSRC = undefined;
    this.imgFile = undefined;
    if(this.imageSelector)this.imageSelector.nativeElement.value = "";
  }
  submit(docID?:string){
    this.log.show("Submit for docID:",docID)
    if(this.imgFile){
      this.storage.ref('user-avatar/'+ docID).put(this.imgFile)
      .then(snap=>{
        snap.ref.getDownloadURL().then(url=>{
          this.log.show("Download URL after PUT: ",url)
          this.newUser.profile = url
          this.updateNewUserData(docID)
        })
        this.notifier.notify("success","C???p nh???t ???nh ?????i di???n th??nh c??ng")
        this.resetInput()
      })
      .catch(error=>{
        this.notifier.notify("error","Upload ???nh ?????i di???n th???t b???i.")
        this.resetInput()
      })
    }else{
      this.updateNewUserData(docID)
    }
    // if(docID){ // If Edit 
    //   if(this.imgFile){
    //       this.storage.ref('user-avatar/'+ docID).put(this.imgFile)
    //       .then(snap=>{
    //         snap.ref.getDownloadURL().then(url=>{
    //           this.log.show("Download URL after PUT: ",url)
    //           this.newUser.profile = url
    //           this.updateNewUserData(docID)
    //         })
    //         this.notifier.notify("success","C???p nh???t ???nh ?????i di???n th??nh c??ng")
    //         this.resetInput()
    //       })
    //       .catch(error=>{
    //         this.notifier.notify("error","Upload ???nh ?????i di???n th???t b???i.")
    //         this.resetInput()
    //       })
    //   }else{
    //     this.updateNewUserData(docID)
    //   }
    // }else{ // If create new
    //   if(this.imgFile){
    //     this.storage.ref('user-avatar/'+ docID).put(this.imgFile)
    //     .then(snap=>{
    //       snap.ref.getDownloadURL().then(url=>{
    //         this.log.show("Download URL after PUT: ",url)
    //         this.newUser.profile = url
    //         this.updateNewUserData(docID)
    //       })
    //       this.notifier.notify("success","C???p nh???t ???nh ?????i di???n th??nh c??ng")
    //       this.resetInput()
    //     })
    //     .catch(error=>{
    //       this.notifier.notify("error","Upload ???nh ?????i di???n th???t b???i.")
    //       this.resetInput()
    //     })
    //   }else{
    //     this.updateNewUserData(docID)
    //   }
    // }
  }
  updateNewUserData(docID?:string){
    if(docID){
      this.log.show("User for update: ",this.newUser)
      this.afs.doc<User>('User/'+docID).update(Object.assign({}, this.newUser)).then(()=>{
        this.notifier.notify("success","C???p nh???t th??ng tin ng?????i d??ng th??nh c??ng!")
        this.formPristine = true;
      }).catch(e=>{
        this.notifier.notify("error","C?? l???i trong qu?? tr??nh c???p nh???t th??ng tin ng?????i d??ng");
      })
    }else{
      this.afs.collection<User>("User").add(Object.assign({}, this.newUser)).then(ref=>{
        this.formPristine = true;
        this.newUser.docID = ref.id;
        this.notifier.notify("success","Th??m ng?????i d??ng th??nh c??ng!")
      }).catch(e=>{
        this.notifier.notify("error","C?? l???i trong qu?? tr??nh th??m ng???i d??ng m???i");
      })
    }

  }
  uploadPhoto(docID:string){
    const filePath = 'user-avatar/'+ docID;
    const ref = this.storage.ref(filePath);
    const task = ref.put(this.imgFile);
    return task.then(uploadTaskSnapshot=>{
      ref.getDownloadURL().toPromise().then(url=>{
        this.afs.doc<User>('User/'+docID).update({profile:url as string}).then(()=>{
          this.notifier.notify("success","C???p nh???t ???nh ?????i di???n th??nh c??ng")
        })
      })
    }).catch(error=>{
      this.notifier.notify("error","Upload ???nh ?????i di???n th???t b???i.")
    })
  }
  selectFile(event:any){
    if(event.target.files && event.target.files.length >0){
      const file = event.target.files[0] as File;
      if (file.type.match(/image\/*/) == null) {
        this.notifier.notify("error","File v???a ch???n kh??ng ph???i file ???nh")
      } else if(file?.size > 2097152){
        this.notifier.notify("error","File ???nh kh??ng ???????c qu?? 2MB.")
      }else{
        this.imgFile = file;
        var reader = new FileReader();
        reader.readAsDataURL(file); 
        reader.onload = (_event) => { 
          this.imgSRC = reader.result as string; 
        }
        this.formPristine = false;
      }
    }
  }
}
