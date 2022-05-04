import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument,
} from '@angular/fire/firestore';
import { Observable, combineLatest } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
} from 'rxjs/operators';
import { AppConstants } from 'src/app/constant/app.constant';
import { ConsoleLogService } from 'src/app/services/console-log.service';
import { PhienKhamService } from 'src/app/services/phien-kham.service';


interface StringMap {
  [key: string]: boolean;
}

@Component({
  selector: 'app-danh-sach-phien-kham',
  templateUrl: './danh-sach-phien-kham.component.html',
  styleUrls: ['./danh-sach-phien-kham.component.css'],
})
export class DanhSachPhienKhamComponent implements OnInit {
  currentUser: any;
  ds_phien_kham: any[] = [];
  ds_phien_kham_1: any[] = [];
  ds_phien_kham_2: any[] = [];
  ds_phien_kham_2_clone: any[] = [];
  isDoctorcity: boolean = false;
  phiem_kham_DOC?: AngularFirestoreDocument<unknown>;
  fl_content_COLL = this.afs.collection('fl_content');
  phienKhamId: string;
  loading: boolean = true;
  keywordFilter: string = "";
  optionsFilter: any[] = [];
  // [
  //   { code: 'yeuCauHoTro', name: 'Cần hỗ trợ' },
  //   { code: 'thanhToan', name: 'Đã thanh toán' },
  //   { code: 'trangThaiXuLy', name: 'Đã hoàn thành' },
  //   { code: 'ketThuc', name: 'Đã kết thúc' },
  // ]

  // @Input() ds_coSoYTe: any[] = [];
  ds_coSoYTe: any[] = [];
  // @Input() ds_yeucau: any[] = [];
  @Output('chon_phien_kham') emiter = new EventEmitter<any>();
  private log = new ConsoleLogService(this.constructor.name);
  private phienKhamCollection?: AngularFirestoreCollection;

  public claims?: any;

  request_OBS?: Observable<any>;
  readyProvider_OBS?: Observable<any>;

  constructor(
    private phienKhamService: PhienKhamService,
    readonly afs: AngularFirestore
  ) {
    // this.phienKhamCollection = this.afs.collection('fl_content', ref => ref.where("_fl_meta_.schema", "==", "phienKham").where("ds_trung_tam","array-contains-any",ref.doc(authSv.claims.c[0])))
    // this.ds_phien_kham = this.phienKhamCollection.valueChanges()
  }
  // vu-lh
  ds_mau_hop_dong_OBS?: Observable<any>;
  ds_yeucau_OBS?: Observable<any>;
  ds_yeucau: any[] = [];
  ds_mau_hop_dong: Array<any> = [];
  query_tim_hop_dong: any;

  formatter = (hop_dong: any) => `${hop_dong.maHopDong}-${hop_dong.tenHopDong}`;
  tenHopDongformatter = (hop_dong: any) => hop_dong.tenHopDong;
  keywordHopDongFilter: string = "";

  async ngOnInit() {
    this.ds_phien_kham = [];
    this.ds_phien_kham_1 = [];
    this.ds_phien_kham_2 = [];
    await this.getCurrentUser();
    await this.getPhiemKham();
    // await this.sessionInfoService.init().then(resolve => {
    //   return resolve;
    // })
    // console.log('alooooooooo');
    // let arrTemp11 = JSON.parse(JSON.stringify(this.ds_phien_kham));
    // console.log('arrTemp11', arrTemp11);
    // console.log('ngOnInit', this.ds_phien_kham)
    // const sub = this.afAuth.user.subscribe((user) => {
    //   if (user) {
    //     console.log('user', user);
    //     this.log.show('Có user');
    //     user.getIdTokenResult(true).then(async (token) => {
    //       if (token.claims) {
    //         this.log.show('Có claims');
    //         this.claims = token.claims;
    //         console.log('this.claims', this.claims);

    //         // this.phienKhamCollection = this.afs.collection(
    //         //   'fl_content',
    //         //   ref => ref
    //         //    .where("_fl_meta_.schema", "==", "phienKham")

    //         // )

    //         await this.phienKhamService
    //           .getRecentPhienKham()
    //           .subscribe((res) => {
    //             if (res) {
    //               console.log('res', res);
    //               this.ds_phien_kham = res;
    //               console.log('this.ds_phien_kham', this.ds_phien_kham);

    //               if (this.ds_phien_kham.length > 0) {
    //                 this.convertDataDsPhienKham();
    //               }
    //             }
    //           });

    //         // console.log('this.ds_phien_kham',this.phienKhamCollection.valueChanges())

    //         // this.ds_phien_kham = this.phienKhamCollection.valueChanges()
    //         sub.unsubscribe();
    //       }
    //     });
    //   }
    // });
    //vu-lh: lấy danh sách schema hợp đồng
    this.ds_mau_hop_dong_OBS = this.afs
      .collection('fl_content', (ref) =>
        ref.where('_fl_meta_.schema', '==', 'contract')
      )
      .valueChanges();
    const sub = this.ds_mau_hop_dong_OBS.subscribe((ds_mau_tc) => {
      sub.unsubscribe();
      this.ds_mau_hop_dong = ds_mau_tc;
    });
  }

  getPhiemKham() {

    combineLatest([
      this.phienKhamService.getRecentPhienKham(),
      this.phienKhamService.getKhachHang(),
      this.phienKhamService.getDSYeuCau(),
      this.phienKhamService.getCoSoYte(),
    ]).subscribe(async ([dsPhienKham, dsKhachHang, dsYeuCau, coSoYTe]) => {
      console.log("res ===============", { dsPhienKham, dsKhachHang, dsYeuCau })

      this.ds_phien_kham = [];
      this.ds_phien_kham_1 = [];
      this.ds_phien_kham_2 = [];
      // console.log('res', res);

      // xu ly data bi trung
      //   let result = res.reduce(function (r, a:any) {
      //     r[a.maPhienKham] = r[a.maPhienKham] || [];
      //     r[a.maPhienKham].push(a);
      //     return r;
      // }, Object.create(null));

      //  console.log('result',result);

      this.ds_phien_kham = dsPhienKham;
      this.ds_coSoYTe = coSoYTe;

      // sort by createdDate
      this.ds_phien_kham.sort((a, b) => {
        if (b._fl_meta_.createdDate.seconds > a._fl_meta_.createdDate.seconds) return 1;
        if (b._fl_meta_.createdDate.seconds < a._fl_meta_.createdDate.seconds) return -1;
        return 0;
      })

      if (this.currentUser['jsonCoSoHanhNghe']) {
        console.log('phien kham co chuyen vien');

        this.ds_phien_kham.forEach((item) => {
          if (item['chuyenVien'] && item['chuyenVien'].length != 0) {
            this.ds_phien_kham_1.push(item);
          }
        });
      } else {
        console.log('phien kham khong co chuyen vien');
        this.ds_phien_kham.forEach((item) => {
          if (!item['chuyenVien'] || item['chuyenVien'] == null || item['chuyenVien'].length == 0) {
            this.ds_phien_kham_1.push(item);
          }
        });
      }

      // console.log('this.ds_phien_kham1', this.ds_phien_kham_1);

      //convert data khach hang
      let leng = this.ds_phien_kham_1.length;
      for (let i = 0; i < leng; i++) {
        // let objKhachHang = await this.ds_phien_kham_1[i].khachHang.get();
        let jsonKhachHang = dsKhachHang.find((kh: any) => kh.id === this.ds_phien_kham_1[i].khachHang.id);
        this.ds_phien_kham_1[i]['jsonKhachHang'] = jsonKhachHang;
      }

      if (this.currentUser['jsonCoSoHanhNghe']) {
        let leng = this.ds_phien_kham_1.length;

        for (let i = 0; i < leng; i++) {
          let jsonChuyenVien = this.ds_coSoYTe.find((kh: any) => kh.id === this.ds_phien_kham_1[i].chuyenVien.id);
          this.ds_phien_kham_1[i]['jsonChuyenVien'] = jsonChuyenVien;
        }
      }

      // console.log('this.ds_phien_kham1 lan1', this.ds_phien_kham_1);
      //loc nhung phien kham thoa man dieu kien trung tam ho tro
      if (this.currentUser['jsonCoSoHanhNghe']) {
        let leng = this.ds_phien_kham_1.length;
        let maCoSoHanhNgheOfUser = this.currentUser.jsonCoSoHanhNghe.maCoSo;
        // console.log('maCoSoHanhNgheOfUser', maCoSoHanhNgheOfUser);
        this.ds_phien_kham_2 = []
        for (let i = 0; i < leng; i++) {
          let maChuyenVien = this.ds_phien_kham_1[i]?.jsonChuyenVien?.maCoSo;
          if (maChuyenVien == maCoSoHanhNgheOfUser) {
            this.ds_phien_kham_2.push(this.ds_phien_kham_1[i]);
          }
        }
      }

      if (!this.currentUser['jsonCoSoHanhNghe']) {
        this.ds_phien_kham_2 = []
        this.ds_phien_kham_2 = this.ds_phien_kham_1;
      }

      if (!dsYeuCau.length) {
        this.loading = false;
        return;
      }

      this.ds_phien_kham_2.forEach(item => {
        item._filterYeuCauHoTro = false;
        item._filterThanhToan = true;
        item._filterTrangThaiXuLy = true;

        dsYeuCau.forEach(yeucau => {
          if (yeucau.phienKham?.id === item?.id) {
            if (yeucau.yeuCauHoTro === '1' && yeucau.trangThaiXuLy !== '7') item._filterYeuCauHoTro = true;
            if (!yeucau.thanhToan) item._filterThanhToan = false;
            if (yeucau.trangThaiXuLy !== '7') item._filterTrangThaiXuLy = false;
          }
        })
      })

      this.ds_phien_kham_2_clone = this.ds_phien_kham_2;
      this.loading = false;
      console.log('this.ds_phien_kham2 lan2', this.ds_phien_kham_2);
    });

  }

  async getCurrentUser() {
    // this.currentUser = await this.userService.getLastestUser();
    this.currentUser = {};
    let jsonUser = localStorage.getItem('jsonUser');
    // console.log('jsonUser', jsonUser);
    if (jsonUser) {
      this.currentUser = JSON.parse(jsonUser);
      if (this.currentUser['jsonCoSoHanhNghe']) {
        if (
          this.currentUser.jsonCoSoHanhNghe.maCoSo ==
          AppConstants.MA_CO_SO_DOCTORCITY
        ) {
          this.isDoctorcity = true;
        }
      }
    }
    console.log('this.getCurrentUserrrrr', this.currentUser);
  }

  emitPhienKham(phien_kham: any): void {
    this.emiter.emit(phien_kham);
    this.phienKhamId = phien_kham.id;
  }

  //vh-lh: search hợp đồng theo text 
  searchHopDong = (text$: Observable<any>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      filter((term) => term.length >= 2),
      map((term) =>
        this.ds_mau_hop_dong
          ?.filter((hop_dong) =>
            new RegExp(term, 'mi').test(hop_dong.tenHopDong)
          )
          .slice(0, 10)
      )
    );
      
  selected_hop_dong(id: any) {
    console.log('selected_hop_dong', id)
    this.keywordHopDongFilter = id
  }

  handleSearch(): void {
    let cloneData = this.ds_phien_kham_2_clone;

    if (this.optionsFilter.includes('yeuCauHoTro')) {
      cloneData = cloneData.filter(i => i._filterYeuCauHoTro);
    }
    if (this.optionsFilter.includes('thanhToan')) {
      cloneData = cloneData.filter(i => i._filterThanhToan);
    }
    if (this.optionsFilter.includes('trangThaiXuLy')) {
      cloneData = cloneData.filter(i => i._filterTrangThaiXuLy);
    }
    if (this.optionsFilter.includes('ketThuc')) {
      cloneData = cloneData.filter(i => i.ketThuc === '1');
    }

    const keyword = this.keywordFilter.toLowerCase();

    if (keyword) {
      cloneData = cloneData.filter(data => {
        const index1 = data.jsonKhachHang?.displayName?.toLowerCase().indexOf(keyword);
        if (index1 > -1) return true;
        const index2 = data.maPhienKham.indexOf(keyword);
        if (index2 > -1) return true;

        return false;
      })
    }

    //vu-lh: filter dữ liệu theo mã hợp đồng(nếu có)
    if (this.keywordHopDongFilter) {
      cloneData = cloneData.filter(data => {
        if (data.jsonKhachHang?.hopDong?.id) {
          const indexOf = data.jsonKhachHang?.hopDong?.id.indexOf(this.keywordHopDongFilter);
          if (indexOf > -1) return true;
        }
        return false;
      })
    }

    this.ds_phien_kham_2 = cloneData;
  }

  handleResetSearch(): void {
    this.ds_phien_kham_2 = this.ds_phien_kham_2_clone;
    this.keywordFilter = "";
    this.keywordHopDongFilter = "";
    this.query_tim_hop_dong = null;
    this.optionsFilter = [];
  }

}
