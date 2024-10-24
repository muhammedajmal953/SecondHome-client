import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UserDoc } from '../../../models/IUsers';
import { UserService } from '../../../services/user.service';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import * as UserActions from '../../../state/user/user.actions';
import * as UserSelectors from '../../../state/user/user.selector';


@Component({
  selector: 'app-user-home',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,

  ],
  templateUrl: './user-home.component.html',
  styleUrl: './user-home.component.css'
})
export class UserHomeComponent implements OnInit {
  toggleShow: boolean = false
  user$: Observable<UserDoc | null>
  user: UserDoc | null = null

  constructor(private store: Store) {
    this.user$=this.store.select(UserSelectors.selectUser)
  };
  toggleCollapse() {
    this.toggleShow = !this.toggleShow
  }

  ngOnInit(): void {
    this.store.dispatch(UserActions.loadUserActions())
  }

  logout() {
   this.store.dispatch(UserActions.logout())
  }


}
