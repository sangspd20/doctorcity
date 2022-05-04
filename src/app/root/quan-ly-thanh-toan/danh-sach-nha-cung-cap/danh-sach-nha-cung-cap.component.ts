import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-danh-sach-nha-cung-cap',
  templateUrl: './danh-sach-nha-cung-cap.component.html',
  styleUrls: ['./danh-sach-nha-cung-cap.component.css']
})
export class DanhSachNhaCungCapComponent implements OnInit {

  keywordFilter = '';
  optionsFilter: any[] = [];
  loading = true;
  initFirstTime = true;

  danhSachNccOBS: Observable<any>;
  requestOBS: Observable<any>;

  dsNhaCungCap: any[] = [];
  requests: any[] = [];
  NhaCungCapId: any;

  unsubscribe = new Subject();

  @Input() year: number = new Date().getFullYear();
  @Input() month: number = new Date().getMonth() + 1;
  @Output() emitterNhaCungCap = new EventEmitter<any>();
  @Output() emitterRequest = new EventEmitter<any>();

  constructor(private afs: AngularFirestore) { }

  ngOnInit(): void {
    this.danhSachNccOBS = this.afs
      .collection('fl_content', (ref) =>
        ref.where('_fl_meta_.schema', '==', 'profiles')
          .where('isSupplier', '==', true)
      ).valueChanges();
    this.requestOBS = this.afs
      .collection('fl_content', (ref) =>
        ref.where('_fl_meta_.schema', '==', 'request')
      ).valueChanges();
    this.loadData();
  }

  loadData(): void {
    this.loading = true;
    this.danhSachNccOBS.subscribe(ncc => {
      this.dsNhaCungCap = ncc;
      this.dsNhaCungCap.forEach(t => {
        t.tenNhaCungCap = t?.nhaCungCap?.tenNhaCungCap;
      });
      this.dsNhaCungCap = this.dsNhaCungCap.sort((a, b) => a.tenNhaCungCap.localeCompare(b.tenNhaCungCap));
      console.log('NCC', this.dsNhaCungCap);
      this.loading = false;
      if (this.requests) {
        this.khoiTaoBoLocNcc();
      }
    });
    this.requestOBS.subscribe(request => {
      this.requests = request;
      this.khoiTaoBoLocNcc();
      if (this.NhaCungCapId) {
        this.onNccFilterDate(this.NhaCungCapId);
      }
      // if (!this.initFirstTime && this.NhaCungCapId) {
      //   this.onNccFilter(this.NhaCungCapId);
      // } else {
      //   this.initFirstTime = false;
      // }
    });
  }

  khoiTaoBoLocNcc(): void {
    if (this.dsNhaCungCap) {
      for (const ncc of this.dsNhaCungCap) {
        const requestNcc = this.requests.filter((t: any) => t.nhaCungCap?.id === ncc.id);
        // hoan thanh dich vu
        ncc._filterHoanThanh = requestNcc.length > 0 && (requestNcc.filter((t: any) => t.trangThaiXuLy !== '7') || []).length === 0;

        // da thanh toan dich vu
        ncc._filterThanhToan = requestNcc.length > 0 && (requestNcc.filter((t: any) => !t.thanhToan) || []).length === 0;

        // da hoan tat thu phi dich vu
        ncc._filterThuPhi = (ncc.hoanTatThanhToan
          && (ncc.hoanTatThanhToan.filter((t: any) => t.thuPhi) || []).length > 0
        );
      }
    }
  }

  onNccFilter(NhaCungCapId: string): void {
    if (NhaCungCapId) {
      this.handleSearch();
      this.onNccFilterDate(NhaCungCapId);
    }
  }

  onNccFilterDate(NhaCungCapId: string): void {
    if (NhaCungCapId) {
      let cloneRequest = this.requestFilterByNcc(this.requests, this.NhaCungCapId);
      // orderby
      cloneRequest = cloneRequest.sort((a: any, b: any) => {
        return (new Date(b.thoiDiemTao).getTime() - new Date(a.thoiDiemTao).getTime()); // descending
      });
      this.emitterRequest.emit(cloneRequest);
    }
  }

  requestFilterByNcc(requests: any, NhaCungCapId: string): any {
    return (requests || []).filter((t: any) => t.nhaCungCap?.id === NhaCungCapId
      && ((new Date(t.thoiDiemTao)).getFullYear() === this.year)
      && (new Date(t.thoiDiemTao)).getMonth() + 1 === this.month);
  }

  handleSearch(): void {
    let cloneData = this.dsNhaCungCap;

    if (this.optionsFilter.includes('hoanThanh')) {
      cloneData = cloneData.filter(i => i._filterHoanThanh);
    }
    if (this.optionsFilter.includes('thanhToan')) {
      cloneData = cloneData.filter(i => i._filterThanhToan);
    }
    if (this.optionsFilter.includes('thuPhi')) {
      cloneData = cloneData.filter(i => i._filterThuPhi);
    }
    const keyword = this.keywordFilter.toLowerCase();
    if (keyword) {
      cloneData = cloneData.filter(data => {
        const index1 = data?.nhaCungCap?.tenNhaCungCap.toLowerCase().indexOf(keyword);
        if (index1 > -1) { return true; }
        const index2 = data?.phoneNumber.indexOf(keyword);
        if (index2 > -1) { return true; }
        return false;
      });
    }
    this.dsNhaCungCap = cloneData;
  }

  handleResetSearch(): void {
    this.keywordFilter = '';
    this.optionsFilter = [];
    this.loadData();
  }

  emitNhaCungCap(nhaCungCap: any): void {
    if (nhaCungCap) {
      this.NhaCungCapId = nhaCungCap.id;
      this.year = new Date().getFullYear();
      this.month = new Date().getMonth() + 1;
      this.onNccFilter(this.NhaCungCapId);
      this.emitterNhaCungCap.emit(nhaCungCap);
    }
  }
}
