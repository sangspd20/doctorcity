import { Observable } from 'rxjs';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: '[app-trieu-chung-item]',
  templateUrl: './trieu-chung-item.component.html',
  styleUrls: ['./trieu-chung-item.component.css']
})
export class TrieuChungItemComponent implements OnInit {
  @Input() trieu_chung: any;
  @Input() index: any;

  @Input() locked: boolean = false;

  @Output("xoa_trieu_chung") emiter = new EventEmitter<any>();
  tt_trieu_chung_OBS ?: Observable<any>;
  constructor(
    readonly afs: AngularFirestore
  ) { }

  ngOnInit(): void {
    this.tt_trieu_chung_OBS = this.afs.doc(this.trieu_chung.info.trieu_chung_ref.path).valueChanges();
  }
  xoa(index:any){
    this.emiter.emit(index)
  }
}
