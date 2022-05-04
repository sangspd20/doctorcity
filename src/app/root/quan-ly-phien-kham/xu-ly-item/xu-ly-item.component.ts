import { Component, Input, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Component({
  selector: '[app-xu-ly-item]',
  templateUrl: './xu-ly-item.component.html',
  styleUrls: ['./xu-ly-item.component.css']
})
export class XuLyItemComponent implements OnInit {

  @Input('index') index: any;
  @Input('xu_tri') xu_tri: any;

  xy_ly_OBS?: Observable<any>;
  nguoiThucHien_OBS?: Observable<any>;

  constructor(
    readonly afs: AngularFirestore
  ) { }

  ngOnInit(): void {
    console.log('xu_tri_itemmmm', this.xu_tri)
    if (this.xu_tri?.info?.nguoiThucHien?.path) {
      this.nguoiThucHien_OBS = this.afs
        .doc(this.xu_tri?.info?.nguoiThucHien?.path)
        .valueChanges();
    }
  }

}
