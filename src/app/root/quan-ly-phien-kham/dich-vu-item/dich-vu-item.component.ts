import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Component({
  selector: '[app-dich-vu-item]',
  templateUrl: './dich-vu-item.component.html',
  styleUrls: ['./dich-vu-item.component.css'],
})
export class DichVuItemComponent implements OnInit {
  @Input('index') index: any;
  @Input('dich_vu') dich_vu: any;

  @Input('locked') locked: boolean = false;

  dich_vu_OBS?: Observable<any>;
  nha_cung_cap_OBS?: Observable<any>;
  @Output('xoa_dich_vu') emiter = new EventEmitter<any>();

  @Output('danhGiaNcc') danhGiaNccEmitter = new EventEmitter<any>();
  @Output('baoCao') baoCaoEmitter = new EventEmitter<any>();
  // dichVuItem: any

  constructor(readonly afs: AngularFirestore) { }

  ngOnInit(): void {
    // console.log('dich_vu12', this.dich_vu);
    this.dich_vu_OBS = this.afs
      // .doc(this.dich_vu.info.dichVu.path)
      .doc(this.dich_vu.dichVu.path)
      .valueChanges();

    const res = this.dich_vu_OBS.subscribe((res) => {
      // console.log('dich_vu trong phien kham', res);
    });

    if (this.dich_vu?.nhaCungCap?.path) {
      this.nha_cung_cap_OBS = this.afs
        // .doc(this.dich_vu.info?.nhaCungCap.path)
        .doc(this.dich_vu?.nhaCungCap?.path)
        .valueChanges();
      const res_ncc = this.nha_cung_cap_OBS.subscribe((res) => {
        // console.log('nha_cung_cap trong phien kham', res);
      });
    }

    // console.log('this.dich_vu_OBS itemm', this.dich_vu_OBS);

    // let ichi = {};
    // this.test_OBS = this.fl_content_COLL.doc(idDichVu).valueChanges();
    // const test = this.dich_vu_OBS.subscribe(async (res) => {
    //   if (res) {
    //     let objIchi = await res.ichi.get();
    //     let jsonIchi = objIchi.data();
    //     res['jsonIchi'] = jsonIchi;

    //     this.dichVuItem = res
    //     // console.log('res', res);
    //     // ichi = res['ichi'];
    //     // ds_dich_vu_moi.push({
    //     //   uniqueKey: '' + Date.now(),
    //     //   info: {
    //     //     giaiDoan: 'ĐỀ XUẤT',
    //     //     info: res.jsonIchi.ichiCode,
    //     //     dichVu: this.fl_content_COLL.doc(idDichVu).ref,
    //     //   },
    //     // });
    //     console.log('this.dichVu', this.dichVuItem);
    //   }
    // });
  }

  trangThaiXuLy(Value: string): any {
    let trangThai = '';
    switch (Value) {
      case '1':
        trangThai = 'Chờ TIẾP NHẬN';
        break;
      case '2':
        trangThai = 'Chờ CHẤP NHẬN';
        break;
      case '3':
        trangThai = 'Chờ GẶP MẶT';
        break;
      case '4':
        trangThai = 'Đang THI HÀNH';
        break;
      case '5':
        trangThai = 'Hoàn thành';
        break;
      case 'recommend':
        trangThai = 'Đề xuất';
        break;
      case 'yes':
        trangThai = 'Chờ đặt dịch vụ';
        break;
      default:
        trangThai = Value;
    }
    return trangThai;
  }

  xoa(index: any) {
    this.emiter.emit(index);
  }

  onReviewModal() {
    const sub = this.nha_cung_cap_OBS?.subscribe(res => {
      this.danhGiaNccEmitter.emit({ ncc: res, dichVuOBS: this.dich_vu_OBS, dich_vu: this.dich_vu });
      sub?.unsubscribe();
    });
  }

  onReviewModalReport() {
    const sub = this.nha_cung_cap_OBS?.subscribe(res => {
      this.baoCaoEmitter.emit({ ncc: res, dichVuOBS: this.dich_vu_OBS, dich_vu: this.dich_vu });
      sub?.unsubscribe();
    });
  }
}
