import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UserLatestService {
  user: any =[]
  constructor(
  ) {}

  getLastestUser() {
    return this.user
  }

  setLatestUser(objUser :any = []) {
    this.user = objUser
  }
}
