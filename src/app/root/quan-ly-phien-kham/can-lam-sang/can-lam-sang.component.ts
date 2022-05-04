import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Component({
  selector: '[app-can-lam-sang]',
  templateUrl: './can-lam-sang.component.html',
  styleUrls: ['./can-lam-sang.component.css']
})
export class CanLamSangComponent implements OnInit {

  @Input('dvCanLamSang') dvCanLamSang: any;
  @Input('locked') locked = false;
  @Input('index') index: any;
  @Output("xoa_cls") emiter = new EventEmitter<any>();
  canLamSangOBS?: Observable<any>;

  constructor(readonly afs: AngularFirestore) { }

  ngOnInit(): void {
    // this.canLamSangOBS = this.afs.doc(this.dvCanLamSang.chiSo.path)
    // .valueChanges();
    // this.dvCanLamSang.thoiGianFormat = new Date(this.dvCanLamSang?.thoiGian);
  }

  xoa(index: any){
    this.emiter.emit(index);
  }

}
