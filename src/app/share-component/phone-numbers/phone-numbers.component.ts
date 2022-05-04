import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { faWindowClose } from '@fortawesome/free-regular-svg-icons';

@Component({
  selector: 'app-phone-numbers',
  templateUrl: './phone-numbers.component.html',
  styleUrls: ['./phone-numbers.component.css']
})
export class PhoneNumbersComponent implements OnInit {
  icon = {close:faWindowClose};
  newPhoneNo ?: string;
  
  phoneNos:string[] = [];
  @Input("appModel") set setPhoneNos(list:string[]|undefined){
    if(list) this.phoneNos=list;
    else this.phoneNos = []
  };
  @Output("appModelChange") emitPhoneNos = new EventEmitter<Array<string>>();
  constructor() { }

  ngOnInit(): void {
  }
  submit(){
    this.newPhoneNo = this.newPhoneNo?.trim();
    if(this.newPhoneNo?.length){
      this.phoneNos.push(this.newPhoneNo);
      this.emitPhoneNos.emit(this.phoneNos);
      this.newPhoneNo = "";
    }
  }
  delete(i:number){
    this.phoneNos!.splice(i,1);
    this.emitPhoneNos.emit(this.phoneNos);
  }
 
}
