import { User } from './../../models/user';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {
  selectedUser = new User();
  constructor() { }

  ngOnInit(): void {
  }
  // setUser(user: User){
  //   this.selectedUser = new User();
  //   this.selectedUser = user;
  // }
}
