import { AuthService } from './../../../services/auth.service';
import { NotifierService } from 'angular-notifier';
import { ConsoleLogService } from './../../../services/console-log.service';
import { User } from './../../../models/user';
import { Observable } from 'rxjs';
import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { AngularFireFunctions } from '@angular/fire/functions';
import firebase from 'firebase/app';
@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  @Output("selectAUser") emiter = new EventEmitter<User>();
  private log = new ConsoleLogService(this.constructor.name)
  users?: Observable<User[]>;
  _usersCollection = this.afs.collection<User>('User');

  constructor(
    private readonly afs: AngularFirestore,
    private fns: AngularFireFunctions,
    private notifier: NotifierService,
    public authSv: AuthService,
  ) {
    this.users = this._usersCollection.valueChanges({ idField: 'docID' });
  }

  ngOnInit(): void {
  }
  select(user: any){
    this.emiter.emit(user);
  }
  createNewUser(){
    this.emiter.emit(new User());
  }
  delete(user?: User){
    this.log.show("Delete",user?.docID)
    this._usersCollection.doc(user?.docID).delete()
    .then(()=>this.notifier.notify("success","Xóa người dùng thành công."))
    .catch(r=>this.notifier.notify("error","Xóa người thất bại."))
    
  }
  test(uid?:string){
    this.log.show("Click")
    // const create_ready_secsion = this.fns.httpsCallable('provider_create_ready_secsion');
    // create_ready_secsion({current_position: {
    //   lat: 10.8355299,
    //   lng: 106.8076572
    // }}).subscribe(result=>this.log.show(result))
    const newDoc = this.afs.collection("fl_content").doc().ref.id
  }
}
