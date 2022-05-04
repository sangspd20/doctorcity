// import { firebase } from 'firebase/app';
import { Observable } from 'rxjs';
import { Component, OnInit, ViewChild } from '@angular/core';

import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument,
  DocumentData,
} from '@angular/fire/firestore';
import { ConsoleLogService } from 'src/app/services/console-log.service';
import { NgbRatingConfig } from '@ng-bootstrap/ng-bootstrap';
import firebase from 'firebase/app';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
} from 'rxjs/operators';
import { PhienKham } from 'src/app/models/phien-kham';
import { AppConstants } from 'src/app/constant/app.constant';
import { DanhSachPhienKhamComponent } from './danh-sach-phien-kham/danh-sach-phien-kham.component';
import { Dialog } from 'primeng/dialog';
import { NotifierService } from 'angular-notifier';
import { AngularFireStorage } from '@angular/fire/storage';


@Component({
  selector: 'app-quan-ly-phien-kham',
  templateUrl: './quan-ly-phien-kham.component.html',
  styleUrls: ['./quan-ly-phien-kham.component.css'],
  providers: [NgbRatingConfig],
})
export class QuanLyPhienKhamComponent implements OnInit {

  constructor(
    readonly afs: AngularFirestore,
    private notifier: NotifierService,
    private storage: AngularFireStorage,
  ) { }

  active = 1;
  currentUser: any;
  isDoctorcity: boolean = false;
  phienKhamSelected: any

  request_OBS?: Observable<any>;
  readyProvider_OBS?: Observable<any>;

  private log = new ConsoleLogService(this.constructor.name);
  fl_content_COLL = this.afs.collection('fl_content');
  phien_kham_duoc_chon: any;
  phien_kham_duoc_chon1: any;
  phiem_kham_DOC?: AngularFirestoreDocument<unknown>;
  phiem_kham_DOC1?: AngularFirestoreDocument<unknown>;
  phien_kham_OBS?: Observable<any>;

  // dich vu - service
  ds_dich_vu_OBS?: Observable<any>;
  query_tim_dich_vu: any;
  ds_dich_vu: Array<any> = [];
  idUserSelected: any;
  idPhienKhamSelected: any;

  //ds xu ly tai cho
  themYLenh: any;
  ds_xy_ly_OBS?: Observable<any>;
  ds_xu_ly: any[] = [];

  khach_hang_DOC?: AngularFirestoreDocument<unknown>;
  khach_hang_OBS?: Observable<any>;

  yeu_cau_DOC?: AngularFirestoreDocument<unknown>;
  yeu_cau_OBS?: Observable<any>;
  tsyeu_cau_OBS?: Observable<any>;
  tsyeu_cau_OBS1: any;
  tsyeu_cau_OBS2: any;
  dsyeucau_OBS?: Observable<any>;
  dsyeucau: Array<any> = [];

  dsncc_OBS?: Observable<any>;
  dsncc: Array<any> = [];

  ds_mau_trieu_chung_OBS?: Observable<any>;
  ds_yeucau_OBS?: Observable<any>;
  ds_yeucau: any[] = [];
  ds_mau_trieu_chung: Array<any> = [];

  query_tim_trieu_chung: any;

  //co so y te
  ds_coSoYTe_OBS?: Observable<any>;
  ds_coSoYTe: Array<any> = [];
  selectedTrungTamCoSo: any = '';
  chuyeVienSelectedPK_DOC?: AngularFirestoreDocument<unknown>;
  chuyeVienSelectedPK_OBS?: Observable<any>;

  //cuong
  ds_mau_don_thuoc_OBS?: Observable<any>;
  ds_mau_don_thuoc: Array<any> = [];
  query_tim_don_thuoc: any;
  query_tim_don_thuoc2: any;
  query_tim_don_thuoc3: any;

  //Phan Anh them
  ds_mau_chan_doan_OBS?: Observable<any>;
  ds_mau_chan_doan: Array<any> = [];
  query_tim_chan_doan: any;
  huongdan: any;
  phuongdan: any;
  so_luong: any;
  id_donthuoc: any;
  donvi: any;
  test: any;
  huongdan1: Array<any> = [];

  don_vi_DOC?: AngularFirestoreDocument<unknown>;
  don_vi_OBS?: Observable<any>;

  checkPhienKhamKetThuc: boolean = false;

  danhGiaNccModal: boolean = false;
  // vu-lh
  phieuKetQua: any;
  baoCaoModal: boolean = false;
  filelist: Array<any> = [];
  fileSelectedImage: any;
  fileSelectedOther: any;
  fileExt: any;
  fileType: any;
  tienSuBenh: any;
  dienBienSucKhoe: any;
  //hop dong
  hopDongSelectedPK_DOC?: AngularFirestoreDocument<unknown>;
  hopDongSelectedPK_OBS?: Observable<any>;
  selectedHopDong: any = '';

  nhaCungCapModel: any;
  // tslint:disable-next-line:max-line-length
  nhaCungCapDanhGiaDropdown: any[] = [{ value: 1, label: 'A' }, { value: 2, label: 'B' }, { value: 3, label: 'C' }, { value: 4, label: 'D' }, { value: 5, label: 'E' }, { value: 6, label: 'F' }, { value: 7, label: 'G' }, { value: 8, label: 'H' }, { value: 9, label: 'I' }, { value: 10, label: 'J' }, { value: 11, label: 'K' }, { value: 12, label: 'L' }, { value: 13, label: 'M' }];
  danhGiaSelected = this.nhaCungCapDanhGiaDropdown.find(t => t.value === 5);

  ketThucKhamEnabled = false;
  canlamsang_OBS?: Observable<any>;
  dv_canlamsangs: any[] = [];
  nhomdv_canlamsangs: any[] = [];
  query_canlamsang: any;
  query_nhomcanlamsang: any;
  dvpk_canlamsang: any[] = [];
  loading = false;

  @ViewChild('cmpDanhSachPhienKham') cmpDanhSachPhienKham: DanhSachPhienKhamComponent;
  @ViewChild('dlgDanhGiaNcc') dlgDanhGiaNcc: Dialog;
  @ViewChild('dlgPhieuKetQua') dlgPhieuKetQua: Dialog;
  formatter_service = (dich_vu: any) => dich_vu.tenDichVu;
  formatter = (trieu_chung: any) => trieu_chung.tenTrieuChung;
  formatter7 = (trieu_chung4: any) => trieu_chung4.tenTrieuChung;
  formatterdt = (don_thuoc: any) => don_thuoc.maThuoc + " / " + (don_thuoc.hoatChatChinh) + " / " + (don_thuoc.tenThuoc);
  formatterdtsl = (don_thuoc: any) => don_thuoc.lieuThuongDung;
  //cuong2
  formatterdt2 = (don_thuoc: any) => don_thuoc.hoatChatChinh;
  formatterdt3 = (don_thuoc: any) => don_thuoc.maThuoc;
  formatter1 = (trieu_chung2: any) => trieu_chung2.maIcd + " / " + trieu_chung2.tenChanDoan;
  formatter2 = (yeu_cau: any) => yeu_cau.tenDichVu;
  formatter3 = (dvcls: any) => dvcls.tenThongDung;
  formatter4 = (nhomdv: any) => nhomdv.value;

  ngOnInit(): void {
    this.huongdan = '';
    this.so_luong = '';
    this.donvi = '';
    this.phuongdan = '';
    this.test = "toi khong yeu em";
    this.tienSuBenh = '';
    this.dienBienSucKhoe = '';

    //get current user online
    let jsonUser = localStorage.getItem('jsonUser');
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

    // get list services
    this.ds_dich_vu_OBS = this.afs
      .collection('fl_content', (ref) =>
        ref.where('_fl_meta_.schema', '==', 'services')
      )
      .valueChanges();
    const sub_dv = this.ds_dich_vu_OBS.subscribe((ds_dv) => {
      sub_dv.unsubscribe();
      this.ds_dich_vu = ds_dv;
      console.log('this.ds_dich_vu', this.ds_dich_vu);
    });

    this.ds_mau_trieu_chung_OBS = this.afs
      .collection('fl_content', (ref) =>
        ref.where('_fl_meta_.schema', '==', 'c22Symptom')
      )
      .valueChanges();
    const sub = this.ds_mau_trieu_chung_OBS.subscribe((ds_mau_tc) => {
      sub.unsubscribe();
      this.ds_mau_trieu_chung = ds_mau_tc;
    });

    this.ds_mau_don_thuoc_OBS = this.afs
      .collection('fl_content', (ref) =>
        ref.where('_fl_meta_.schema', '==', 'c24KhoThuoc')
      )
      .valueChanges();
    const subdt = this.ds_mau_don_thuoc_OBS.subscribe((ds_mau_dt) => {
      subdt.unsubscribe();
      this.ds_mau_don_thuoc = ds_mau_dt;
    });

    this.dsyeucau_OBS = this.afs
      .collection('fl_content', (ref) =>
        ref.where('_fl_meta_.schema', '==', 'request')
      )
      .valueChanges();
    const sub11 = this.dsyeucau_OBS.subscribe((dsyeucau_OBStc) => {
      sub11.unsubscribe();
      this.dsyeucau = dsyeucau_OBStc;
      this.tsyeu_cau_OBS = this.afs
        .doc(this.dsyeucau[0].khachHang.path)
        .valueChanges();
      this.tsyeu_cau_OBS1 = this.dsyeucau[0].id;
    });

    this.dsncc_OBS = this.afs
      .collection('fl_content', (ref) =>
        ref.where('_fl_meta_.schema', '==', 'readyProviders')
      )
      .valueChanges();
    const sub111 = this.dsncc_OBS.subscribe((dsncc_OBStc) => {
      sub111.unsubscribe();
      this.dsncc = dsncc_OBStc;

      this.tsyeu_cau_OBS2 = this.dsncc[0].id;
    });

    //Phan Anh them
    this.ds_mau_chan_doan_OBS = this.afs
      .collection('fl_content', (ref) =>
        ref.where('_fl_meta_.schema', '==', 'c23DuLieuIcd')
      )
      .valueChanges();
    const sub1 = this.ds_mau_chan_doan_OBS.subscribe((ds_mau_cd) => {
      sub1.unsubscribe();
      this.ds_mau_chan_doan = ds_mau_cd;
    });

    //cuong Phan Anh them
    this.ds_yeucau_OBS = this.afs
      .collection('fl_content', (ref) =>
        ref.where('_fl_meta_.schema', '==', 'request')
      )
      .valueChanges();

    const sub2 = this.ds_yeucau_OBS.subscribe((ds_yeucau_cd) => {
      // console.log(ds_yeucau_cd);
      // sub2.unsubscribe();
      this.ds_yeucau = ds_yeucau_cd;
      if (this.idPhienKhamSelected) {
        // TuanBui: Lay thong tin request theo maPhienKham
        this.dsyeucau = this.ds_yeucau.filter(t => t.phienKham?.id === this.idPhienKhamSelected && t.trangThaiXuLy);
        console.log('ds yeu cau ', this.dsyeucau);
        if (this.dsyeucau.filter((yc: any) => yc.trangThaiXuLy !== '7' && yc.nhaCungCap).length > 0) {
          this.ketThucKhamEnabled = false;
        } else {
          this.ketThucKhamEnabled = true;
        }
        //vu-lh: tính thời gian hoàn thành
        this.dsyeucau.map(e => {
          let tongThoiGianXuLy = ''
          if (!!e.thoiDiemHoanThanh && !!e.thoiDiemXacNhanGap) {
            const difference = new Date(e.thoiDiemHoanThanh).getTime() - new Date(e.thoiDiemXacNhanGap).getTime()

            if (difference > 0) {
              const seconds = Math.floor((difference / 1000) % 60)
              const minutes = Math.floor((difference / 1000 / 60) % 60)
              const hours = Math.floor((difference / (1000 * 60 * 60)) % 24)
              const days = Math.floor(difference / (1000 * 60 * 60 * 24))

              if (days > 0) tongThoiGianXuLy += `${String(days)}d`
              if (hours > 0) tongThoiGianXuLy += `${String(hours)}h`
              if (minutes > 0) tongThoiGianXuLy += `${String(minutes)}m`
              if (seconds > 0) tongThoiGianXuLy += `${String(seconds)}s`
            }
          }
          e.tongThoiGianXuLy = tongThoiGianXuLy
          return e
        })
      }
      // sub2.unsubscribe() vu-lh fixbug dịch vụ không realtime
    });

    //get list co so y te
    this.ds_coSoYTe_OBS = this.afs
      .collection('fl_content', (ref) =>
        ref.where('_fl_meta_.schema', '==', 'coSoYTe')
      )
      .valueChanges();
    const sub_coSoYTe = this.ds_coSoYTe_OBS.subscribe((ds_coSoYTe_cd) => {
      sub_coSoYTe.unsubscribe();
      this.ds_coSoYTe = ds_coSoYTe_cd;
      // console.log('this.ds_coSoYTe', this.ds_coSoYTe);
    });

    this.canlamsang_OBS = this.afs
      .collection('fl_content', (ref) =>
        ref.where('_fl_meta_.schema', '==', 'labo')
      ).valueChanges();

    this.canlamsang_OBS.subscribe((dv) => {
      this.dv_canlamsangs = dv;
      this.nhomDichVuCanLamSang();
    });
  }

  nhomDichVuCanLamSang() {
    if (this.dv_canlamsangs) {
      this.nhomdv_canlamsangs = [];
      for (const dv of this.dv_canlamsangs) {
        if (dv.nhom) {
          const index = this.nhomdv_canlamsangs.findIndex((t) => t.value === dv.nhom);
          if (index === -1) {
            this.nhomdv_canlamsangs.push({
              label: dv.nhom,
              value: dv.nhom
            });
          }
        }
      }
    }
  }

  sapXepDichVuCanLamSang(dvCanLamSang: any) {
    if (dvCanLamSang) {
      this.loading = true;
      this.dvpk_canlamsang = [];
      for (const dv of dvCanLamSang) {
        const sub: Observable<any> = this.afs.doc(dv.chiSo.path).valueChanges();
        sub.subscribe((item: any) => {
          if (this.dvpk_canlamsang.findIndex(t => t.maChiSo === item.maChiSo && t.ngayTao.getTime() === new Date(dv.ngayTao).getTime()) === -1) {
            this.dvpk_canlamsang.push({
              maChiSo: item.maChiSo,
              index: dvCanLamSang.findIndex((t: any) => t.chiSo.id === dv.chiSo.id && t.thoiGian === dv.thoiGian),
              nhom: item.nhom,
              tenThongDung: item.tenThongDung,
              giaTri: dv.giaTri || '',
              unit: item.unit,
              ngayTao: dv.ngayTao ? new Date(dv.ngayTao) : null,
              thoiGian: dv.thoiGian ? new Date(dv.thoiGian) : null,
              nguoiNhap: dv.nguoiNhap
            });
          }
        });
      }
      const t1 = setTimeout(() => {
        this.dvpk_canlamsang = this.dvpk_canlamsang.sort((a, b) => {
          return (a.maChiSo.localeCompare(b.maChiSo) || (b.ngayTao.getTime() - a.ngayTao.getTime()));
        });
        this.loading = false;
        console.log(this.dvpk_canlamsang);
        clearTimeout(t1);
      }, 300);
    }
  }

  chon_phien_kham_moi(phien_kham: any) {
    this.phienKhamSelected = phien_kham
    let id_phien_kham = phien_kham.id;
    this.idPhienKhamSelected = phien_kham.id;

    if (phien_kham['ketThuc'] == 1) {
      this.checkPhienKhamKetThuc = true;
    } else {
      this.checkPhienKhamKetThuc = false;
    }
    this.phien_kham_duoc_chon = id_phien_kham;
    this.phiem_kham_DOC = this.fl_content_COLL.doc(this.phien_kham_duoc_chon);

    this.phien_kham_OBS = this.phiem_kham_DOC.valueChanges();

    const sub = this.phien_kham_OBS.subscribe((pk) => {
      sub.unsubscribe();
      console.log('pk', pk);
      this.idUserSelected = pk.khachHang.id;
      this.khach_hang_DOC = this.fl_content_COLL.doc(pk.khachHang.id);
      this.khach_hang_OBS = this.khach_hang_DOC.valueChanges();

      if (pk.khachHang) {
        this.khach_hang_OBS.subscribe((res) => {
          this.selectedHopDong = ''
          if (res && res.hopDong) {
            this.hopDongSelectedPK_DOC = this.fl_content_COLL.doc(res.hopDong.id);
            this.hopDongSelectedPK_OBS = this.hopDongSelectedPK_DOC.valueChanges();
            this.hopDongSelectedPK_OBS.subscribe((res2) => {
              if (res2) {
                this.selectedHopDong = `${res2['tenHopDong']}`;
              }
            });
          }
          if (res && res.tienSuBenh) {
            this.tienSuBenh = ''
            if (res.tienSuBenh) {
              if (res.tienSuBenh.length > 0) {
                this.tienSuBenh = res.tienSuBenh
              }
            }
          }
        });
      }

      if (pk.chuyenVien) {
        this.chuyeVienSelectedPK_DOC = this.fl_content_COLL.doc(
          pk.chuyenVien.id
        );
        this.chuyeVienSelectedPK_OBS =
          this.chuyeVienSelectedPK_DOC.valueChanges();
        this.chuyeVienSelectedPK_OBS.subscribe((res) => {
          if (res) {
            this.selectedTrungTamCoSo = res['maCoSo'];
          }
        });
      }

      if (this.idPhienKhamSelected) {
        // TuanBui: Lay thong tin request theo maPhienKham
        this.dsyeucau = this.ds_yeucau.filter(t => t.phienKham?.id === this.idPhienKhamSelected && t.trangThaiXuLy);
        if (this.dsyeucau.filter((yc: any) => yc.trangThaiXuLy !== '7' && yc.nhaCungCap).length > 0) {
          this.ketThucKhamEnabled = false;
        } else {
          this.ketThucKhamEnabled = true;
        }
        //vu-lh: tính thời gian hoàn thành
        this.dsyeucau.map(e => {
          let tongThoiGianXuLy = ''
          if (!!e.thoiDiemHoanThanh && !!e.thoiDiemXacNhanGap) {
            const difference = new Date(e.thoiDiemHoanThanh).getTime() - new Date(e.thoiDiemXacNhanGap).getTime()

            if (difference > 0) {
              const seconds = Math.floor((difference / 1000) % 60)
              const minutes = Math.floor((difference / 1000 / 60) % 60)
              const hours = Math.floor((difference / (1000 * 60 * 60)) % 24)
              const days = Math.floor(difference / (1000 * 60 * 60 * 24))

              if (days > 0) tongThoiGianXuLy += `${String(days)}d`
              if (hours > 0) tongThoiGianXuLy += `${String(hours)}h`
              if (minutes > 0) tongThoiGianXuLy += `${String(minutes)}m`
              if (seconds > 0) tongThoiGianXuLy += `${String(seconds)}s`
            }
          }
          e.tongThoiGianXuLy = tongThoiGianXuLy
          return e
        })
        console.log('ds yeu cau ', this.dsyeucau);
      }
      if (pk?.canLamSang) {
        this.sapXepDichVuCanLamSang(pk.canLamSang);
      } else {
        this.dvpk_canlamsang = [];
        this.loading = false;
      }
      if (pk?.phieuKetQua) {
        this.onSearchReport(pk.phieuKetQua)
      } else {
        this.filelist = []
        this.fileSelectedImage = null
        this.fileSelectedOther = null
        this.fileExt = null
      }
    });
    // realtime order canLamSang
    this.phien_kham_OBS.subscribe((pk: any) => {
      if (pk?.canLamSang) {
        if (pk?.canLamSang.length > 0) {
          this.sapXepDichVuCanLamSang(pk.canLamSang);
        } else {
          this.dvpk_canlamsang = [];
          this.loading = false;
        }
      }
      this.dienBienSucKhoe = ''
      if (pk?.dienBienSucKhoe) {
        if (pk?.dienBienSucKhoe.length > 0) {
          this.dienBienSucKhoe = pk?.dienBienSucKhoe
        }
      }
    });
  }

  ketThucPhienKham() {
    if (this.phienKhamSelected) {
      if (confirm('Bạn có chắc chắn muốn kết thúc phiên khám?')) {
        // Save it!
        let phien_kham_duoc_chon = this.phienKhamSelected.id;
        console.log('phien_kham_duoc_chon', phien_kham_duoc_chon);

        const dvKhongNhaCungCap = this.dsyeucau.filter(t => !t.nhaCungCap);
        console.log('dvKhongNhaCungCap', dvKhongNhaCungCap);

        this.phiem_kham_DOC = this.fl_content_COLL.doc(phien_kham_duoc_chon);
        this.phiem_kham_DOC
          ?.update({ ketThuc: '1' })
          .then(() => {
            console.log('update ket thuc phien cam thanh cong');
            //  this.deleteRequest(this.phienKhamSelected.maPhienKham);
            this.deleteReadyProvider(this.phienKhamSelected.maPhienKham);

            // xoa toan bo dich vu khong co nha cung cap
            if (dvKhongNhaCungCap && dvKhongNhaCungCap.length > 0) {
              for (const dv of dvKhongNhaCungCap) {
                this.afs
                  .collection('fl_content')
                  .doc(dv.id)
                  .delete()
                  .then(() => { })
                  .catch((error) => {
                    console.error('Error removing Request: ', error);
                  });
              }
            }
          })
          .catch((error) => {
            console.error('Error writing document: ', error);
          });
      } else {
        // Do nothing!
        console.log('Thing was not saved to the database.');
      }
    }
  }

  deleteRequest(maPhienKhamUser: any) {
    this.request_OBS = this.afs
      .collection('fl_content', (ref) =>
        ref.where('_fl_meta_.schema', '==', 'request')
      )
      .valueChanges();
    const sub1 = this.request_OBS.subscribe(async (res) => {
      sub1.unsubscribe();
      if (res) {
        let leng = res.length;
        for (let i = 0; i < leng; i++) {
          let objPhienKham = await res[i].phienKham.get();
          let jsonPhienKham = objPhienKham.data();
          res[i]['jsonPhienKham'] = jsonPhienKham;
        }

        console.log('ress schema request', res);
        let objRequest = null;
        for (let i = 0; i < leng; i++) {
          if (res[i]['jsonPhienKham'].maPhienKham == maPhienKhamUser) {
            objRequest = res[i];
            break;
          }
        }

        // console.log('objRequest to del', objRequest);

        //del phien Kham
        if (objRequest) {
          this.afs
            .collection('fl_content')
            .doc(objRequest.id)
            .delete()
            .then(() => {
              console.log('Request successfully deleted!');
            })
            .catch((error) => {
              console.error('Error removing Request: ', error);
            });
        }
      }
    });
  }

  deleteReadyProvider(maPhienKhamUser: any) {
    this.readyProvider_OBS = this.afs
      .collection('fl_content', (ref) =>
        ref.where('_fl_meta_.schema', '==', 'readyProviders')
      )
      .valueChanges();
    const sub2 = this.readyProvider_OBS.subscribe(async (res) => {
      sub2.unsubscribe();
      if (res) {
        let leng = res.length;
        for (let i = 0; i < leng; i++) {
          let objPhienKham = await res[i].phienKham.get();
          let jsonPhienKham = objPhienKham.data();
          res[i]['jsonPhienKham'] = jsonPhienKham;
        }

        console.log('ress schema readyProviders', res);
        let objRequest = null;
        for (let i = 0; i < leng; i++) {
          if (res[i]['jsonPhienKham'].maPhienKham == maPhienKhamUser) {
            objRequest = res[i];
            break;
          }
        }

        // console.log('objReadyProviders to del', objRequest);

        //del phien Kham
        if (objRequest) {
          this.afs
            .collection('fl_content')
            .doc(objRequest.id)
            .delete()
            .then(() => {
              console.log('Ready Provider successfully deleted!');
            })
            .catch((error) => {
              console.error('Error removing Ready Provider: ', error);
            });
        }
      }
    });
  }

  doiTrungTamHoTroCuaPhienKham() {
    if (confirm('Bạn có muốn thay đổi trung tâm hỗ trợ?')) {
      // Save it!

      let objResult = [];
      objResult = this.ds_coSoYTe.filter((item) => {
        return item.maCoSo == this.selectedTrungTamCoSo;
      });
      // console.log('co so Selected', objResult);
      if (objResult.length > 0) {
        this.phiem_kham_DOC?.update({
          chuyenVien: this.fl_content_COLL.doc(objResult[0].id).ref,
        });
      } else {
        this.phiem_kham_DOC?.update({ chuyenVien: null });
      }

      this.khach_hang_OBS = undefined;
      this.phien_kham_OBS = undefined;
      this.phiem_kham_DOC = undefined;
    } else {
      // Do nothing!
      // console.log('Thing was not saved to the database.');
    }
  }

  tinh_tuoi(nam_sinh: any) {
    if (nam_sinh) {
      return 2021 - nam_sinh;
    } else {
      return undefined;
    }
  }
  get_vietnam_time() {
    function pad(number: number) {
      if (number < 10) {
        return '0' + number;
      }
      return number;
    }
    const now = new Date();
    return (
      pad(now.getFullYear()) +
      '-' +
      pad(now.getMonth() + 1) +
      '-' +
      pad(now.getDate()) +
      'T' +
      pad(now.getHours()) +
      ':' +
      pad(now.getMinutes())
    );
  }

  update_dien_bien(value: any) {
    this.phiem_kham_DOC?.update({ dienBienSucKhoe: value });
    // this.log.show(value);
    // this.log.show(value)
  }
  update_huongdan(value: any) {
    this.phiem_kham_DOC?.update({ huongDanSuDung: value });

    // this.log.show(value)
  }

  search_service = (text$: Observable<any>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      filter((term) => term.length >= 2),
      map((term) =>
        this.ds_dich_vu
          ?.filter((dich_vu) => new RegExp(term, 'mi').test(dich_vu.tenDichVu))
          .slice(0, 10)
      )
    );
  search = (text$: Observable<any>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      filter((term) => term.length >= 2),
      map((term) =>
        this.ds_mau_trieu_chung
          ?.filter((trieu_chung) =>
            new RegExp(term, 'mi').test(trieu_chung.tenTrieuChung)
          )
          .slice(0, 10)
      )
    );

  searchdt = (text$: Observable<any>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      filter((term) => term.length >= 1),
      map((term) =>
        this.ds_mau_don_thuoc
          ?.filter((don_thuoc) =>
            new RegExp(term, 'mi').test(don_thuoc.maThuoc + don_thuoc.hoatChatChinh + don_thuoc.tenThuoc)

          )
          .slice(0, 10)
      )
    );
  //cuong 2
  searchdt2 = (text$: Observable<any>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      filter((term) => term.length >= 1),
      map((term) =>
        this.ds_mau_don_thuoc
          ?.filter((don_thuoc) =>
            new RegExp(term, 'mi').test(don_thuoc.hoatChatChinh)
          )
          .slice(0, 10)
      )
    );
  searchdt3 = (text$: Observable<any>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      filter((term) => term.length >= 1),
      map((term) =>
        this.ds_mau_don_thuoc
          ?.filter((don_thuoc) =>
            new RegExp(term, 'mi').test(don_thuoc.maThuoc)
          )
          .slice(0, 10)
      )
    );

  search1 = (text$: Observable<any>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      filter((term) => term.length >= 1),
      map((term) =>
        this.ds_mau_chan_doan
          ?.filter((trieu_chung2) =>
            new RegExp(term, 'mi').test(trieu_chung2.maIcd + trieu_chung2.tenChanDoan)
          )
          .slice(0, 10)
      )
    );
  // vu-lh
  // cập nhật tiền sử bệnh từ trung tâm
  suaTienSuBenh() {
    if (this.khach_hang_DOC && this.khach_hang_OBS) {
      const sub_xl = this.khach_hang_OBS.subscribe((pk) => {
        sub_xl.unsubscribe();

        this.khach_hang_DOC!.update({
          tienSuBenh: this.tienSuBenh,
        }).then((v) => {
          console.log('cập nhật tiền sử bệnh thành công');
          this.notifier.notify("success", "Cập nhật tiền sử bệnh thành công")
          this.tienSuBenh = null
        });
      });
    }
  }

  // vu-lh
  // cập nhật diễn biến sức khoẻ từ trung tâm
  suaDienBienSucKhoe() {
    if (this.phiem_kham_DOC && this.phien_kham_OBS) {
      const sub_xl = this.phien_kham_OBS.subscribe((pk) => {
        sub_xl.unsubscribe();

        this.phiem_kham_DOC!.update({
          dienBienSucKhoe: this.dienBienSucKhoe,
        }).then((v) => {
          console.log('cập nhật diễn biến sức khoẻ thành công');
          this.dienBienSucKhoe = null
          this.notifier.notify("success", "Cập nhật diễn biến sức khoẻ thành công")
        });
      });
    }
  }

  them_y_lenh() {
    let d = new Date();
    let dformat =
      [d.getFullYear(), d.getMonth() + 1, d.getDate()].join('-') +
      'T' +
      [d.getHours(), d.getMinutes()].join(':');
    if (this.themYLenh && this.phiem_kham_DOC && this.phien_kham_OBS) {
      const sub_xl = this.phien_kham_OBS.subscribe((pk) => {
        sub_xl.unsubscribe();
        let ds_xu_tri_moi: Array<any> = pk.ds_xu_tri ? pk.ds_xu_tri : [];
        console.log('ds_xu_tri_moi', ds_xu_tri_moi);
        console.log('this.themYLenh', this.themYLenh);
        ds_xu_tri_moi.push({
          uniqueKey: '' + Date.now(),
          info: {
            yLenh: this.themYLenh,
            hoanThanh: '0',
            // thoiDiemThucHien: dformat,
            // nguoiThucHien: this.fl_content_COLL.doc(this.currentUser['id']).ref,
          },
        });

        this.phiem_kham_DOC!.update({
          ds_xu_tri: ds_xu_tri_moi,
        }).then((v) => {
          console.log('thêm xu ly moi thanh cong');
          this.themYLenh = null
        });
      });
    }
  }

  them_dich_vu(idDichVu: any) {
    // console.log('id_DichVu', idDichVu);
    if (idDichVu && this.phiem_kham_DOC && this.phien_kham_OBS) {
      const sub_dv = this.phien_kham_OBS.subscribe((pk) => {
        sub_dv.unsubscribe();
        /*let ds_dich_vu_moi: Array<any> = pk.dichVu ? pk.dichVu : [];
        // console.log('ds_dich_vu_moi', ds_dich_vu_moi);
        ds_dich_vu_moi.push({
          uniqueKey: '' + Date.now(),
          info: {
            giaiDoan: 'ĐỀ XUẤT',
            dichVu: this.fl_content_COLL.doc(idDichVu).ref,
          },
        });
        // console.log('ds_dich_vu_moi',ds_dich_vu_moi)
        this.phiem_kham_DOC!.update({
          dichVu: ds_dich_vu_moi,
        }).then((v) => {
          console.log('them dich vu moi thanh cong');
          this.query_tim_dich_vu = null;

          // them dịch vu trong bang yeu cau
          if (this.khach_hang_DOC && this.khach_hang_OBS) {
            const data = {
              trangThaiXuLy: 'ĐỀ XUẤT',
              khachHang: this.fl_content_COLL.doc(this.idUserSelected).ref,
              dichVu: this.fl_content_COLL.doc(idDichVu).ref,
              phienKham: this.fl_content_COLL.doc(this.idPhienKhamSelected).ref,
            };

            this.fl_content_COLL.add(data).then((result) => {
              if (result) {
                console.log('them yeu cau thanh cong:', result.id);
                result
                  .update({
                    _fl_meta_: this.genfl_meta(this.idUserSelected, result.id),
                    id: result.id,
                  })
                  .then(() => {
                    // console.log('yeuCau: ', result.id);
                    // update yeuCauId trong phienKham.dichVu
                    ds_dich_vu_moi[ds_dich_vu_moi.length - 1].info.yeuCauId =
                      result.id;
                    this.phiem_kham_DOC!.update({
                      dichVu: ds_dich_vu_moi,
                    }).then((v) => {
                      console.log(
                        'update yeu cau id in phien kham -> dich vu thanh cong'
                      );
                    });
                  });
              }
            });
          }
        });*/

        // them dịch vu trong bang yeu cau
        if (this.khach_hang_DOC && this.khach_hang_OBS) {
          const data = {
            trangThaiXuLy: 'ĐỀ XUẤT',
            khachHang: this.fl_content_COLL.doc(this.idUserSelected).ref,
            dichVu: this.fl_content_COLL.doc(idDichVu).ref,
            phienKham: this.fl_content_COLL.doc(this.idPhienKhamSelected).ref,
          };

          this.fl_content_COLL.add(data).then((result) => {
            if (result) {
              console.log('them yeu cau thanh cong:', result.id);
              this.query_tim_dich_vu = null;
              result
                .update({
                  _fl_meta_: this.genfl_meta(this.idUserSelected, result.id),
                  id: result.id,
                })
                .then(() => {
                  // console.log('yeuCau: ', result.id);
                  // update yeuCauId trong phienKham.dichVu
                  // ds_dich_vu_moi[ds_dich_vu_moi.length - 1].info.yeuCauId =
                  //   result.id;
                  // this.phiem_kham_DOC!.update({
                  //   dichVu: ds_dich_vu_moi,
                  // }).then((v) => {
                  //   console.log(
                  //     'update yeu cau id in phien kham -> dich vu thanh cong'
                  //   );
                  // });
                });
            }
          });
        }
      });
    }
  }

  genfl_meta(uid: any, docId: any) {
    // const time = firestore.Timestamp.fromDate(new Date());
    let data = {
      createdBy: uid ? uid : '',
      createdDate: Date.now(),
      docId: docId,
      env: 'production',
      fl_id: docId,
      lastModifiedBy: uid ? uid : 'abc',
      lastModifiedDate: Date.now(),
      locale: 'vi',
      schema: 'request',
      // schemaRef: this.afs.doc('fl_content/' + 'mCginNvnYJwGE0VQR92R'),
      schemaType: 'collection',
    };
    return data;
  }

  them_trieu_chung(id: any) {
    // this.log.show("Triệu chứng mới: ", this.trieu_chung_moi)
    if (id && this.phiem_kham_DOC && this.phien_kham_OBS) {
      const sub = this.phien_kham_OBS.subscribe((pk) => {
        sub.unsubscribe();
        // this.log.show("Danh sách phiên khám hiện tại: ", pk.ds_trieu_chung)
        // this.trieu_chung_moi.thoiDiem = this.get_vietnam_time()
        let ds_trieu_chung_moi: Array<any> = pk.ds_trieu_chung
          ? pk.ds_trieu_chung
          : [];
        ds_trieu_chung_moi.push({
          uniqueKey: '' + Date.now(),
          info: {
            mucDo: 1,
            thoiDiem: this.get_vietnam_time(),
            trieu_chung_ref: this.fl_content_COLL.doc(id).ref,
          },
        });
        // this.trieu_chung_moi = { mucDo: "1" }
        // this.muc_do_da_chon = 1
        // this.mau_trieu_chung_da_chon_dropdow_show = "Chọn triệu chứng"
        this.phiem_kham_DOC!.update({
          ds_trieu_chung: ds_trieu_chung_moi,
        }).then((v) => {
          this.query_tim_trieu_chung = null;
        });
      });
    }
  }

  them_don_thuoc(id: any) {
    // this.log.show("Triệu chứng mới: ", this.trieu_chung_moi)
    if (id && this.phiem_kham_DOC && this.phien_kham_OBS) {
      this.id_donthuoc = id;
      //this.so_luong= this.phiem_kham_DOC = this.fl_content_COLL.doc(id).
      this.so_luong = '';
      this.don_vi_DOC = this.fl_content_COLL.doc(id);
      this.don_vi_OBS = this.don_vi_DOC.valueChanges();
      const subdt1 = this.don_vi_OBS.subscribe((ds_mau_dt1) => {
        subdt1.unsubscribe();
        this.huongdan1 = ds_mau_dt1;
        this.phuongdan = this.huongdan1;

      });
    }
  }
  nhapdonthuoc() {
    // this.log.show("Triệu chứng mới: ", this.trieu_chung_moi)

    if (this.id_donthuoc && this.phiem_kham_DOC && this.phien_kham_OBS) {
      const sub = this.phien_kham_OBS.subscribe((pk) => {
        sub.unsubscribe();
        // this.log.show("Danh sách phiên khám hiện tại: ", pk.ds_trieu_chung)
        // this.trieu_chung_moi.thoiDiem = this.get_vietnam_time()
        let ds_don_thuoc_moi: Array<any> = pk.donThuoc ? pk.donThuoc : [];
        //ds_don_thuoc_moi.push({ uniqueKey: "" + Date.now(), info: {soLuong:this.so_luong,duyet:'Chờ',  huongDanSuDung:this.huongdan, nhapThuoc:this.fl_content_COLL.doc(this.id_donthuoc).ref} })
        ds_don_thuoc_moi.push({
          uniqueKey: '' + Date.now(),
          info: {
            soLuong: this.so_luong,
            duyet: 'Chờ',
            huongDanSuDung: this.huongdan,
            nhapThuoc: this.fl_content_COLL.doc(this.id_donthuoc).ref,
          },
        });

        // this.trieu_chung_moi = { mucDo: "1" }
        // this.muc_do_da_chon = 1
        // this.mau_trieu_chung_da_chon_dropdow_show = "Chọn triệu chứng"
        this.phuongdan = [];
        this.huongdan = '';
        this.so_luong = '';
        this.phiem_kham_DOC!.update({ donThuoc: ds_don_thuoc_moi }).then(
          (v) => {
            this.query_tim_don_thuoc = null;
            this.query_tim_don_thuoc2 = null;
            this.query_tim_don_thuoc3 = null;
          }
        );
      });
    }
  }
  //Phan Anh them
  them_chan_doan(id: any) {
    // this.log.show("Chẩn đoán mới: ", this.chan_doan_moi)
    if (id && this.phiem_kham_DOC && this.phien_kham_OBS) {
      const sub = this.phien_kham_OBS.subscribe((pk) => {
        sub.unsubscribe();
        // this.log.show("Danh sách phiên khám hiện tại: ", pk.ds_chan_doan)
        // this.chan_doan_moi.thoiDiem = this.get_vietnam_time()
        let ds_chan_doan_moi: Array<any> = pk.ds_chan_doan
          ? pk.ds_chan_doan
          : [];
        ds_chan_doan_moi.push({
          uniqueKey: '' + Date.now(),
          icd_ref: this.fl_content_COLL.doc(id).ref,
        });
        // this.chan_doan_moi = { mucDo: "1" }
        // this.muc_do_da_chon = 1
        // this.mau_chan_doan_da_chon_dropdow_show = "Chọn chẩn đoán"

        this.phiem_kham_DOC!.update({ ds_chan_doan: ds_chan_doan_moi }).then(
          (v) => {
            this.query_tim_chan_doan = null;
          }
        );
      });
    }
  }

  xoadonthuoc(index: any) {
    const subdt1 = this.phien_kham_OBS?.subscribe((pk) => {
      if (pk) {
        subdt1?.unsubscribe();
        pk.donThuoc.splice(index, 1);
        this.phiem_kham_DOC!.update({ donThuoc: pk.donThuoc });
      }
    });
  }

  xoachandoan(index: any) {
    const subdt123 = this.phien_kham_OBS?.subscribe((pk) => {
      if (pk) {
        subdt123?.unsubscribe();

        pk.ds_chan_doan.splice(index, 1);
        this.phiem_kham_DOC!.update({ ds_chan_doan: pk.ds_chan_doan });
      }
    });
  }

  suadonthuoc(index: any) {
    const subdt1 = this.phien_kham_OBS?.subscribe((pk) => {
      if (pk) {
        subdt1?.unsubscribe();
        this.phiem_kham_DOC!.update({ donThuoc: pk.donThuoc });
      }
    });
  }
  xoa_trieu_chung5(index: any) {
    this.log.show('Xóa triệu chứng có index = ', index);
    const sub = this.phien_kham_OBS?.subscribe((pk) => {
      if (pk) {
        sub?.unsubscribe();
        pk.ds_trieu_chung.splice(index, 1);
        this.phiem_kham_DOC!.update({ ds_trieu_chung: pk.ds_trieu_chung });
      }
    });
  }

  xoa_dich_vu(index: any) {
    this.log.show('Xóa dịch vụ có index = ', index);
    // TuanBui: kiem tra phien kham da ket thuc thi khong thuc hien xoa
    if (this.checkPhienKhamKetThuc) {
      confirm('Phiên khám đã kết thúc. Không thể xóa yêu cầu');
      return;
    }

    const sub = this.phien_kham_OBS?.subscribe((pk) => {
      if (pk) {
        sub?.unsubscribe();
        console.log('pk', pk);
        let delDichVu = pk.dichVu[index];
        // console.log('delDivhVu', delDichVu);

        pk.dichVu.splice(index, 1);
        this.phiem_kham_DOC!.update({ dichVu: pk.dichVu });

        //xoa data trong bang yeu cau
      }
    });
  }

  xoa_trieu_chung(index: any) {
    this.log.show('Xóa triệu chứng có index = ', index);
    const sub = this.phien_kham_OBS?.subscribe((pk) => {
      if (pk) {
        sub?.unsubscribe();
        pk.ds_trieu_chung.splice(index, 1);
        this.phiem_kham_DOC!.update({ ds_trieu_chung: pk.ds_trieu_chung });
      }
    });
  }

  xoa_chan_doan(index: any) {
    this.log.show('Xóa triệu chứng có index = ', index);
    this.test = "khong khong khong";
    const subxoa12 = this.phien_kham_OBS?.subscribe((pk) => {
      if (pk) {
        subxoa12?.unsubscribe();
        pk.ds_chan_doan.splice(index, 1);
        this.phiem_kham_DOC!.update({ ds_chan_doan: pk.ds_chan_doan });
      }
    });
  }


  //Phan Anh them

  // TuanBui: backward, forward phien kham
  onBackWard(): void {
    if (this.phienKhamSelected?.id && this.cmpDanhSachPhienKham) {
      const khachHangId = this.phienKhamSelected?.jsonKhachHang?.id || this.phienKhamSelected?.khachHang?.id;

      const { ds_phien_kham } = this.cmpDanhSachPhienKham;
      if (!ds_phien_kham?.length) return;

      let start = -1, next = -2;
      ds_phien_kham.forEach((item, index) => {
        if (item.khachHang?.id === khachHangId) {
          if (start === -1) start = index;
          if (next === -1) next = index;
          if (item.id === this.phienKhamSelected.id) next = -1;
        }
      })
      if (next < 0) next = start;
      if (this.phienKhamSelected.id === ds_phien_kham[next].id) return;

      this.cmpDanhSachPhienKham.emitPhienKham(ds_phien_kham[next]);
    }
  }

  onForWard(): void {
    if (this.phienKhamSelected?.id && this.cmpDanhSachPhienKham) {
      const khachHangId = this.phienKhamSelected?.jsonKhachHang?.id || this.phienKhamSelected?.khachHang?.id;

      const { ds_phien_kham } = this.cmpDanhSachPhienKham;
      if (!ds_phien_kham?.length) return;

      let end = -1, current = -1, pre = -2;
      ds_phien_kham.forEach((item, index) => {
        if (item.khachHang?.id === khachHangId) {
          end = index;
          if (item.id === this.phienKhamSelected.id) current = index;
          if (current === -1) pre = index;
        }
      })
      if (pre < 0) pre = end;
      if (this.phienKhamSelected.id === ds_phien_kham[pre].id) return;
      this.cmpDanhSachPhienKham.emitPhienKham(ds_phien_kham[pre]);
    }
  }

  onReviewVendor(nhaCungCapData: any) {
    if (nhaCungCapData) {
      this.danhGiaNccModal = true;
      const sub = nhaCungCapData.dichVuOBS.subscribe((dv: any) => {
        console.log('DANH_GIA_DICH_VU', dv);
        this.nhaCungCapModel = nhaCungCapData.ncc;
        this.nhaCungCapModel.dich_vu = nhaCungCapData.dich_vu;
        console.log('YEU_CAU', this.nhaCungCapModel.dich_vu);
        const chungChiHanhNghe = this.nhaCungCapModel?.nhaCungCap?.dichVuDuocCapPhep.find((t: any) => t.kichHoat)['soChungChi'] || '';
        this.nhaCungCapModel.chungChiHanhNghe = chungChiHanhNghe;
        this.nhaCungCapModel.tenDichVu = dv?.tenDichVu;
        this.nhaCungCapModel.maDichVu = this.nhaCungCapModel?.dich_vu?.id;
        this.nhaCungCapModel.ViTri = nhaCungCapData.dich_vu?.viTri?.address;
        this.danhGiaSelected = this.nhaCungCapDanhGiaDropdown.find(t => t.value === (this.nhaCungCapModel?.dich_vu?.danhGia2 || 5));
        this.nhaCungCapModel.coSoDangKyHanhNgheOBS = this.afs.doc(this.nhaCungCapModel?.nhaCungCap?.coSoDangKyHanhNghe?.path)
          .valueChanges();
        if (this.nhaCungCapModel.coSoDangKyHanhNgheOBS) {
          const cssub = this.nhaCungCapModel.coSoDangKyHanhNgheOBS.subscribe((cs: any) => {
            this.nhaCungCapModel.coSoHanhNghe = cs?.tenThongDung;
            cssub.unsubscribe();
          });
        }
        sub.unsubscribe();
      });
    } else {
      console.error('Không tìm thấy thông tin nhà cung cấp');
    }
  }

  onSubmitReviewVendor() {
    if (!this.danhGiaSelected) {
      this.notifier.notify('error', 'Bạn chưa chọn đánh giá');
      return;
    }
    if (this.nhaCungCapModel) {
      this.fl_content_COLL.doc(this.nhaCungCapModel.maDichVu).update({
        danhGia2: this.danhGiaSelected?.value || 5,
      }).then((v) => {
        this.danhGiaNccModal = false;
        this.notifier.notify('success', 'Gửi đánh giá thành công');
        console.log(
          'Them danh gia thanh cong'
        );
      });
    }
  }

  onSearchReport(phieuKetQua: any) {
    this.filelist = [];
    if (phieuKetQua) {
      const reference = this.storage.ref(`${phieuKetQua}`);
      // console.log('reference', reference)
      const sub = reference.listAll().subscribe(async (result) => {
        // console.log('result', result)
        const reads = result.items.map(async (ref) => {
          // console.log('ref', ref)
          const fileName = ref.name
          const downloadURL = await ref.getDownloadURL()
          const metaData = await ref.getMetadata();
          const metaDataStr = String(metaData.size / 1024 / 1024)
          const metaType = metaData.contentType.split('/')[0] || ' '
          const re = /(?:\.([^.]+))?$/
          const ext = re.exec(ref.name)![1] || ' '
          // console.log({ metaData, metaType })
          return {
            downloadURL: downloadURL,
            fileName: fileName,
            size: `${parseFloat(metaDataStr).toFixed(2)}(MB)`,
            ext: ext,
            type: metaType
          }
        });
        this.filelist = await Promise.all(reads)
        console.log(this.filelist)
        sub.unsubscribe();
      });
    } else {
      console.error('Không tìm thấy phiếu kết quả');
    }
  }

  onReviewReport() {
    this.baoCaoModal = true;
  }

  onCloseReviewReport() {
    this.fileSelectedImage = null
    this.fileSelectedOther = null
    this.baoCaoModal = false;
  }

  emitPhieuKetQua(file: any): void {
    console.log('emitPhieuKetQua', file)
    this.fileSelectedImage = null
    this.fileSelectedOther = null

    if (file.type == 'image') {
      this.fileSelectedImage = file.downloadURL
    } else {
      this.fileSelectedOther = file.downloadURL
    }
    console.log('this.fileSelectedOther', this.fileSelectedOther)
    this.fileExt = file.ext
  }

  themCanLamSang(canLamSangId: string) {
    if (canLamSangId && this.phiem_kham_DOC && this.phien_kham_OBS) {
      const sub = this.phien_kham_OBS.subscribe((pk) => {
        sub.unsubscribe();
        const dsCanLamSang: Array<any> = pk.canLamSang ? pk.canLamSang : [];
        dsCanLamSang.push({
          chiSo: this.fl_content_COLL.doc(canLamSangId).ref,
          ngayTao: new Date().toString()
        });
        this.phiem_kham_DOC!.update({ canLamSang: dsCanLamSang }).then(
          (v) => { this.query_canlamsang = null; this.query_nhomcanlamsang = null; }
        );
      });
    }
  }

  themNhomCanLamSang(nhomCanLamSang: string) {
    if (nhomCanLamSang && this.phiem_kham_DOC && this.phien_kham_OBS) {
      const sub = this.phien_kham_OBS.subscribe((pk) => {
        sub.unsubscribe();
        let dsCanLamSang: Array<any> = pk.canLamSang ? pk.canLamSang : [];
        const dvNhom = this.dv_canlamsangs.filter((dv) => dv.nhom === nhomCanLamSang);
        if (dvNhom && dvNhom.length > 0) {
          const dvNhomThem = [];
          for (const dv of dvNhom) {
            dvNhomThem.push({
              chiSo: this.fl_content_COLL.doc(dv.id).ref
            });
          }
          dsCanLamSang = dsCanLamSang.concat(dvNhomThem);
          this.phiem_kham_DOC!.update({ canLamSang: dsCanLamSang }).then(
            (v) => { this.query_canlamsang = null; this.query_nhomcanlamsang = null; }
          );
        }
      });
    }
  }

  searchCanLamSang = (text$: Observable<any>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      filter((term) => term.length >= 2),
      map((term) =>
        this.dv_canlamsangs
          ?.filter((dv) => new RegExp(term, 'mi').test(dv.tenThongDung))
          .slice(0, 10)
      )
    )

  searchNhomCanLamSang = (text$: Observable<any>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      filter((term) => term.length >= 2),
      map((term) =>
        this.nhomdv_canlamsangs
          ?.filter((dv) => new RegExp(term, 'mi').test(dv.value))
          .slice(0, 10)
      )
    )

  xoa_cls(index: any) {
    this.log.show('Xóa cận lâm sàng có index = ', index);
    const sub = this.phien_kham_OBS?.subscribe((pk) => {
      if (pk) {
        sub?.unsubscribe();
        pk.canLamSang.splice(index, 1);
        this.phiem_kham_DOC!.update({ canLamSang: pk.canLamSang });
      }
    });
  }

  selectFile(event: any) {
    // console.log('[selectFile-phieuketqua]', event.target.files)
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0] as File;
      if (file.type.match(/image\/*|application\/pdf/) == null) {
        this.notifier.notify("error", "File vừa chọn không phải file ảnh/file pdf")
      } else if (file?.size > 2097152) {
        this.notifier.notify("error", "File ảnh không được quá 2MB.")
      } else {
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (_event) => {
          const filePath = `mobileUpload/${this.phienKhamSelected.maPhienKham}/${file?.name}`;
          const ref = this.storage.ref(filePath);
          const task = ref.put(file);
          return task.then(uploadTaskSnapshot => {
            // console.log('[uploadTaskSnapshot]', uploadTaskSnapshot)
            this.phiem_kham_DOC!.update({ phieuKetQua: `mobileUpload/${this.phienKhamSelected.maPhienKham}` });
            this.notifier.notify("success", "Upload file thành công")
            this.onSearchReport(this.phienKhamSelected.phieuKetQua)
          }).catch(error => {
            this.notifier.notify("error", "Upload ảnh đại diện thất bại.")
          })
        }
      }
    }
  }
}
