import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-gender-selector',
  templateUrl: './gender-selector.component.html',
  styleUrls: ['./gender-selector.component.css']
})
export class GenderSelectorComponent implements OnInit {
  @Input("appModel") gender?: string;
  @Output("appModelChange") emiter = new EventEmitter<string>();
  constructor() { }

  ngOnInit(): void {
  }
  submit(gender:string){
    this.gender = gender;
    this.emiter.emit(gender);
  }
}
