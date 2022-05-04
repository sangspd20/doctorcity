import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class ConsoleLogService {
  caller?: String
  constructor(
    callerName: String
  ) {
    if (callerName) this.caller = callerName;
  }
  public show(object1?: any,object2?: any){
    if(!environment.production){
      if (this.caller) console.log("["+this.caller+"]",object1,object2)
      else console.log(object1,object2);
    }
  }
  public str(text: String){
    if(!environment.production){
      if (this.caller) console.log("["+this.caller+"]",text)
      else console.log(text);
    }
  }
}
