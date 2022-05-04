import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { NotifierService } from 'angular-notifier';
import { Dialog } from 'primeng/dialog';
import { DanhSachNhaCungCapComponent } from './danh-sach-nha-cung-cap/danh-sach-nha-cung-cap.component';
import { environment as env} from '../../../environments/environment';
@Component({
  selector: 'app-quan-ly-thanh-toan',
  templateUrl: './quan-ly-thanh-toan.component.html',
  styleUrls: ['./quan-ly-thanh-toan.component.css']
})
export class QuanLyThanhToanComponent implements OnInit {

  active = 1;
  nhaCungCapSelected: any;
  hoanTatThanhToan = false;
  Request: any[] = [];

  yearFilter = new Date().getFullYear();
  yearsFilter = Array.from(Array(10).keys()).map(y => { return { label: this.yearFilter - y, value: this.yearFilter - y } });
  monthFilter = new Date().getMonth() + 1;

  khachHangModel: any = {};
  dlgKhachHangHienThi = false;

  tongTienPhiThang = 0;
  baoCaoTaiChinhThangData: any[] = [];
  baoCaoTaiChinhThangTongData: any[] = [];
  baoCaoTaiChinhThangCount = 0;
  tongTienTatCaNcc = 0;
  chiPhiHeThongTong = 0;
  BaoCaoSoNcc = 0;
  dlgBaoCao = false;
  loading = false;
  chiPhiHeThong = env.servicePrice;

  @ViewChild('cmpDanhSachNhaCungCap') cmpDanhSachNhaCungCap: DanhSachNhaCungCapComponent;
  @ViewChild('dlgKhachHang') dlgKhachHang: Dialog;

  constructor(private afs: AngularFirestore, private notifier: NotifierService) { }

  ngOnInit(): void {
    // console.log(this.yearsFilter);
  }

  onBackWard() {
    this.monthFilter = this.monthFilter - 1 === 0 ? 1 : this.monthFilter -= 1;
    if (this.cmpDanhSachNhaCungCap) {
      this.cmpDanhSachNhaCungCap.month = this.monthFilter;
      this.cmpDanhSachNhaCungCap.onNccFilterDate(this.nhaCungCapSelected.id);
    }
  }

  onForWard() {
    this.monthFilter = this.monthFilter + 1 > 12 ? 1 : this.monthFilter += 1;
    if (this.cmpDanhSachNhaCungCap) {
      this.cmpDanhSachNhaCungCap.month = this.monthFilter;
      this.cmpDanhSachNhaCungCap.onNccFilterDate(this.nhaCungCapSelected.id);
    }
  }

  onYearFilter(yearData: any) {
    if (yearData) {
      if (this.cmpDanhSachNhaCungCap) {
        this.cmpDanhSachNhaCungCap.year = yearData;
        this.cmpDanhSachNhaCungCap.onNccFilterDate(this.nhaCungCapSelected.id);
      }
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

  onhoanTatThanhToan(): void {
    if (!this.hoanTatThanhToan && this.nhaCungCapSelected) {
      let arrData: { year: number; month: number; thuPhi: boolean; ngayTao: string; }[] = [];
      if (this.nhaCungCapSelected?.hoanTatThanhToan) {
        arrData = this.nhaCungCapSelected?.hoanTatThanhToan;
        const index = this.nhaCungCapSelected?.hoanTatThanhToan
          .findIndex((t: any) => t.year === this.yearFilter && t.month === this.monthFilter);
        if (index > -1) {
          arrData[index].thuPhi = true;
        } else {
          arrData.push({
            year: this.yearFilter,
            month: this.monthFilter,
            thuPhi: true,
            ngayTao: this.get_vietnam_time()
          });
        }
      } else {
        arrData.push({
          year: this.yearFilter,
          month: this.monthFilter,
          thuPhi: true,
          ngayTao: this.get_vietnam_time()
        });
      }
      if (confirm('Bạn có muốn hoàn tất thanh toán Tháng: ' + this.monthFilter
        + ' Năm: ' + this.yearFilter + ' Nhà cung cấp: ' + this.nhaCungCapSelected?.nhaCungCap?.tenNhaCungCap + '?')) {
        this.afs.collection('fl_content').doc(this.nhaCungCapSelected.id).update({
          hoanTatThanhToan: arrData,
        }).then(res => {
          this.notifier.notify('success', 'Hoàn tất thanh toán thành công!');
          this.hoanTatThanhToan = true;
          this.nhaCungCapSelected.hoanTatThanhToan = arrData;
        }).catch(err => {
          console.error(err);
        });
      }
    }
  }

  handlerNhaCungCap(nhaCungCapData: any) {
    this.nhaCungCapSelected = nhaCungCapData;
    const soChungChi = nhaCungCapData?.nhaCungCap?.dichVuDuocCapPhep.find((t: any) => t.kichHoat)?.soChungChi;
    this.nhaCungCapSelected.soChungChi = soChungChi;
    this.yearFilter = new Date().getFullYear();
    this.monthFilter = new Date().getMonth() + 1;
    this.checkHoanTatThanhToan();
  }

  checkHoanTatThanhToan() {
    if (!this.nhaCungCapSelected?.hoanTatThanhToan
      || (this.nhaCungCapSelected?.hoanTatThanhToan && this.nhaCungCapSelected?.hoanTatThanhToan.length === 0)) {
      this.hoanTatThanhToan = false;
    } else {
      const index = this.nhaCungCapSelected?.hoanTatThanhToan
        .findIndex((t: any) => t.year === this.yearFilter && t.month === this.monthFilter && t.thuPhi);
      this.hoanTatThanhToan = index > -1;
    }
  }

  handlderRequest(requests: any) {
    if (requests && requests.length > 0) {
      this.Request = requests;
      this.tongTienPhiThang = this.chiPhiHeThong;
      for (const req of this.Request) {
        const dichVuOBS = this.afs
          .doc(req.dichVu.path)
          .valueChanges();
        if (dichVuOBS) {
          const sub = dichVuOBS.subscribe((dv: any) => {
            req['maDichVu'] = dv?.maDichVu;
            req['tenDichVu'] = dv?.tenDichVu;
            req['price'] = dv?.price;
            req['tyLeThu'] = dv?.tyLeThu;
            sub.unsubscribe();
            // tinh tong phi trong thang
            if (req?.thanhToan) {
              const phiHoTroChuyenMon = req.yeuCauHoTro ? req.price * 0.1 : 0; // 10% gia dich vu;
              const tongPhi = (req.price * (req.tyLeThu / 100)) + phiHoTroChuyenMon;
              req['tongPhi'] = tongPhi;
              this.tongTienPhiThang += tongPhi;
            }
          });
        }
        const khacHangOBS = this.afs
          .doc(req.khachHang.path)
          .valueChanges();
        if (khacHangOBS) {
          const sub = khacHangOBS.subscribe((dv: any) => {
            req['displayName'] = dv?.displayName;
            sub.unsubscribe();
          });
        }
        const phienKhamOBS = this.afs
          .doc(req.phienKham.path)
          .valueChanges();
        if (phienKhamOBS) {
          const sub = phienKhamOBS.subscribe((pk: any) => {
            req['maPhienKham'] = pk?.maPhienKham;
            sub.unsubscribe();
          });
        }
      }
      this.checkHoanTatThanhToan();
      console.log('REQ_HANLDER', this.Request);
      if (this.active === 2) {
        const t1 = setTimeout(() => {
          this.baoCaoTaiChinhThang();
          clearTimeout(t1);
        }, 500);
      }
    } else {
      this.tongTienPhiThang = 0;
      this.Request = [];
      this.baoCaoTaiChinhThangData = [];
    }
  }

  tinhTongPhiTrongThang() {
    if (this.Request) {
      this.tongTienPhiThang = this.chiPhiHeThong;
      for (const req of this.Request) {
        if (req?.thanhToan) {
          const phiHoTroChuyenMon = req.yeuCauHoTro ? req.price * 0.1 : 0; // 10% gia dich vu;
          const tongPhi = (req.price * (req.tyLeThu / 100)) + phiHoTroChuyenMon;
          req['tongPhi'] = tongPhi;
          this.tongTienPhiThang += tongPhi;
        }
      }
    }
  }

  baoCaoTaiChinhThang() {
    if (this.Request) {
      this.baoCaoTaiChinhThangData = [];
      const requestThanhToan = this.Request.filter(t => t.thanhToan);
      this.baoCaoTaiChinhThangCount = requestThanhToan.length;
      for (const req of requestThanhToan) {
        const index = this.baoCaoTaiChinhThangData.findIndex(t => t.maDichVu === req.maDichVu);
        if (index === -1) {
          const requests = requestThanhToan.filter((t: any) => t.maDichVu === req.maDichVu);
          const requestHoTro = requests.filter((t: any) => t.yeuCauHoTro);
          const requestKhongHoTro = requests.filter((t: any) => !t.yeuCauHoTro);
          this.baoCaoTaiChinhThangData.push({
            maDichVu: req.maDichVu,
            tenDichVu: req.tenDichVu,
            count: requests.length,
            tongPhi: requests.length > 0 ? requests.reduce((acc, obj) => { return acc + obj.tongPhi }, 0) : 0,
            data: [
              {
                title: 'Hỗ trợ chuyên môn',
                count: requestHoTro.length,
                tongPhi: requestHoTro.length > 0 ? requestHoTro.reduce((acc, obj) => { return acc + obj.tongPhi }, 0) : 0
              },
              {
                title: 'Không hỗ trợ chuyên môn',
                count: requestKhongHoTro.length,
                tongPhi: requestKhongHoTro.length > 0 ? requestKhongHoTro.reduce((acc, obj) => { return acc + obj.tongPhi }, 0) : 0
              }
            ]
          });
        }
      }
    }
  }

  hienThiKhachHang(req: any) {
    this.dlgKhachHangHienThi = true;
    this.khachHangModel = { request: req };
    console.log(req);
    const khacHangOBS = this.afs
      .doc(req.khachHang.path)
      .valueChanges();
    if (khacHangOBS) {
      const sub = khacHangOBS.subscribe((kh: any) => {
        // console.log('KHACH_HANg', kh);
        this.khachHangModel.avatarBase64 = kh?.avatarBase64;
        this.khachHangModel.displayName = kh?.displayName || '';
        this.khachHangModel.phoneNumber = kh?.phoneNumber || '';
        this.khachHangModel.title = `${req.maDichVu} - ${req.tenDichVu}`;
        this.khachHangModel.danhGia1 = req?.danhGia1 || '';
        this.khachHangModel.danhGia2 = req?.danhGia2 || '';
        this.khachHangModel.danhGia3 = req?.danhGia3 || '';
        this.khachHangModel.kienNghi = req?.kienNghi || '';
        sub.unsubscribe();
      });
    }
  }

  capNhatKienNghi() {
    if (!this.khachHangModel || !this.khachHangModel?.kienNghi) {
      this.notifier.notify('error', 'Vui lòng nhập thông tin kiến nghị');
      return;
    }

    if (this.khachHangModel.request) {
      this.afs.collection('fl_content').doc(this.khachHangModel.request.id).update({
        kienNghi: this.khachHangModel?.kienNghi,
      }).then((v) => {
        this.dlgKhachHangHienThi = false;
        this.khachHangModel.request.kienNghi = this.khachHangModel?.kienNghi;
        this.notifier.notify('success', 'Gửi kiến nghị thành công');
        console.log(
          'Gửi kiến nghị thành công'
        );
      });
    }
  }

  thuHoTienDichVu(request: any) {
    if (request && confirm(`Bạn có muốn xác nhận thu hộ dịch vụ: ${request.tenDichVu}. Với số tiền: ${new Intl.NumberFormat('de-DE').format(request.price)} ?`)) {
      this.afs.collection('fl_content').doc(request.id).update({
        thanhToan: true,
      }).then((v) => {
        request.thanhToan = true;
        this.tinhTongPhiTrongThang();
        this.notifier.notify('success', 'Xác nhận thu hộ thành công');
        console.log(
          'Xác nhận thu hộ thành công'
        );
      });
    }
  }

  baoCaoTaiChinhThangTong() {
    this.dlgBaoCao = true;
    this.loading = true;
    const requestOBS = this.afs
      .collection('fl_content', (ref) =>
        ref.where('_fl_meta_.schema', '==', 'request')
      ).valueChanges();
    const sub = requestOBS.subscribe(request => {
      let requestFilterDate: any[] = (request || []).filter((t: any) => t.thanhToan
        && ((new Date(t.thoiDiemTao)).getFullYear() === this.yearFilter)
        && (new Date(t.thoiDiemTao)).getMonth() + 1 === this.monthFilter);
      this.baoCaoTaiChinhThangTongData = [];
      for (const req of requestFilterDate) {
        if (req?.thanhToan) {
          const dichVuOBS = this.afs
            .doc(req.dichVu.path)
            .valueChanges();
          const subDv = dichVuOBS.subscribe((dv: any) => {
            subDv.unsubscribe();
            const phiHoTroChuyenMon = req.yeuCauHoTro ? dv.price * 0.1 : 0; // 10% gia dich vu;
            const tongPhi = (dv.price * (dv.tyLeThu / 100)) + phiHoTroChuyenMon;
            req['tongPhi'] = tongPhi;
            req['maDichVu'] = dv?.maDichVu;
            req['tenDichVu'] = dv?.tenDichVu;
          });
        }
      }
      const t1 = setTimeout(() => {
        console.log('aaaa', requestFilterDate);
        requestFilterDate = requestFilterDate.filter(t => t.maDichVu);
        this.tongTienTatCaNcc = requestFilterDate.reduce((acc, obj) => { return acc + obj.tongPhi }, 0) || 0;
        this.baoCaoTaiChinhThangCount = requestFilterDate.length;
        const arrNcc: any[] = [];
        for (const req of requestFilterDate) {
          if (!arrNcc.includes(req.nhaCungCap.id)) {
            arrNcc.push(req.nhaCungCap.id);
          }
          const index = this.baoCaoTaiChinhThangTongData.findIndex(t => t.maDichVu === req.maDichVu);
          if (index === -1) {
            const requests = requestFilterDate.filter((t: any) => t.maDichVu === req.maDichVu);
            const requestHoTro = requests.filter((t: any) => t.yeuCauHoTro);
            const requestKhongHoTro = requests.filter((t: any) => !t.yeuCauHoTro);
            this.baoCaoTaiChinhThangTongData.push({
              maDichVu: req.maDichVu,
              tenDichVu: req.tenDichVu,
              count: requests.length,
              tongPhi: requests.length > 0 ? requests.reduce((acc, obj) => { return acc + obj.tongPhi }, 0) : 0,
              data: [
                {
                  title: 'Hỗ trợ chuyên môn',
                  count: requestHoTro.length,
                  tongPhi: requestHoTro.length > 0 ? requestHoTro.reduce((acc, obj) => { return acc + obj.tongPhi }, 0) : 0
                },
                {
                  title: 'Không hỗ trợ chuyên môn',
                  count: requestKhongHoTro.length,
                  tongPhi: requestKhongHoTro.length > 0 ? requestKhongHoTro.reduce((acc, obj) => { return acc + obj.tongPhi }, 0) : 0
                }
              ]
            });
          }
        }
        this.BaoCaoSoNcc = arrNcc.length;
        this.chiPhiHeThongTong = arrNcc.length * this.chiPhiHeThong;
        sub.unsubscribe();
        clearTimeout(t1);
        this.loading = false;
      }, 500);
    });
  }

}
