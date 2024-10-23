import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UserDoc } from '../../../models/IUsers';
import { UserService } from '../../../services/user.service';

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
  user: UserDoc | null = null
  constructor(private _userService: UserService) {
  };
  toggleCollapse() {
    this.toggleShow = !this.toggleShow
  }

  ngOnInit(): void {

    this._userService.getUser().subscribe({
      next: (data) => {
        if (data?.success) {
          this.user = data?.data
        }
      },
      complete: () => {
        console.log('userDetails completed');
      },
      error: (error) => {
        console.error('Error fetching user details:', error);
      }
    })
  }


  logout() {
    localStorage.removeItem('user')
    localStorage.removeItem('userRefresh')
    window.location.replace('/user')
  }


}
