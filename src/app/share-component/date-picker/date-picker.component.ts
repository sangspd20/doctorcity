import { NgbDateAdapter, NgbDateParserFormatter,NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { Component, OnInit, Input, Output, EventEmitter, Injectable } from '@angular/core';
import { faCalendarAlt } from '@fortawesome/free-regular-svg-icons';
import firebase from 'firebase/app';


@Injectable()
export class CustomNgbDateAdapterService {

  readonly DELIMITER = '-';

  fromModel(timestamp: firebase.firestore.Timestamp | null): NgbDateStruct | null {
    if (timestamp == null) {
      return null
    }else if(typeof(timestamp)=== 'object'){
      let theDate = timestamp!.toDate();
      return {
        day : theDate.getDate(),
        month : theDate.getMonth(),
        year : theDate.getFullYear()
      };
    }else return null;
  }
  toModel(date: NgbDateStruct | null): firebase.firestore.Timestamp  | null {
    return date? firebase.firestore.Timestamp.fromDate(new Date(date!.year,date!.month,date!.day)):null;
  }
}


@Injectable()
export class CustomNgbDateParserFormatterService extends NgbDateParserFormatter {
  readonly DELIMITER = '/';

  parse(value: string): NgbDateStruct | null {
    if (value) {
      let date = value.split(this.DELIMITER);
      return {
        day : parseInt(date[0], 10),
        month : parseInt(date[1], 10),
        year : parseInt(date[2], 10)
      };
    }
    return null;
  }

  format(date: NgbDateStruct | null): string {
    return date ? date.day + this.DELIMITER + date.month + this.DELIMITER + date.year : '';
  }
}


@Component({
  selector: 'app-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.css'],
  providers: [
    {provide: NgbDateAdapter, useClass: CustomNgbDateAdapterService},
    {provide: NgbDateParserFormatter, useClass: CustomNgbDateParserFormatterService}
  ]
})
export class DatePickerComponent implements OnInit {
  @Input("appModel") timestamp ?: firebase.firestore.Timestamp;
  @Output("appModelChange") emiter = new EventEmitter<firebase.firestore.Timestamp>();
  // @Output("appModelChange") emiter = new EventEmitter<string>();
  icon = {calendar:faCalendarAlt};
  date?:string;
  constructor() { }

  ngOnInit(): void {
  }
  submit(data: firebase.firestore.Timestamp | any){
    if(typeof(data)==='object') {
      this.emiter.emit(data)
    }
  }
}
