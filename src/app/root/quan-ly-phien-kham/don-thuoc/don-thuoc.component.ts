import { Observable } from 'rxjs';
import { Component, Input, OnInit, Output,EventEmitter } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { NgbRatingConfig } from '@ng-bootstrap/ng-bootstrap';
import { fas } from '@fortawesome/free-solid-svg-icons';
@Component({
  selector: 'app-don-thuoc',
  templateUrl: './don-thuoc.component.html',
  styleUrls: ['./don-thuoc.component.css'],
  providers: [NgbRatingConfig]
})
export class DonThuocComponent implements OnInit {
  @Input() trieu_chung4: any;
  @Input() index1: any;
  @Input() locked: boolean = false;
  @Output("xoadonthuoc") emiterdt = new EventEmitter<any>();
  @Output("update_huongdan") emitersuadt = new EventEmitter<any>();
  tt_trieu_chung_OBS4 ?: Observable<any>
  value = 'Clear me'
  constructor(
    readonly afs: AngularFirestore
  ) { }

  ngOnInit(): void {
    this.tt_trieu_chung_OBS4 = this.afs.doc(this.trieu_chung4.info.nhapThuoc.path).valueChanges();
  }
  xoadt(value: any) {
    this.emiterdt.emit(value);
  }
  suadt(value: any) {
    this.emitersuadt.emit(value);
  }

}
