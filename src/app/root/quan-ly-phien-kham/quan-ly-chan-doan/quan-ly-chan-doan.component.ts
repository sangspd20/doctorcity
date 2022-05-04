import { Observable } from 'rxjs';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: '[app-quan-ly-chan-doan]',
  templateUrl: './quan-ly-chan-doan.component.html',
  styleUrls: ['./quan-ly-chan-doan.component.css']
})
export class QuanLyChanDoanComponent implements OnInit {
  @Input() trieu_chung2: any;
  @Input() index2: any;
  @Input() locked: boolean = false;
  @Output("xoachandoan") emitercd = new EventEmitter<any>();
  tt_trieu_chung_OBS2 ?: Observable<any>
  constructor(
    readonly afs: AngularFirestore
  ) { }

  ngOnInit(): void {
    this.tt_trieu_chung_OBS2 = this.afs.doc(this.trieu_chung2.icd_ref.path).valueChanges()
  }

  xoacd(index2: any) {
    this.emitercd.emit(index2);
  }


}
