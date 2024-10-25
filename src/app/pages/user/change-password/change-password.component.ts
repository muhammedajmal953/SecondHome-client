import { Component, OnDestroy } from '@angular/core';
import { CahangePasswordFormComponent } from "../../../components/cahange-password-form/cahange-password-form.component";
import { Router } from '@angular/router';
import { UserService } from '../../../services/user.service';
import Swal from 'sweetalert2';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [CahangePasswordFormComponent],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.css'
})
export class ChangePasswordComponent implements OnDestroy{

  private subscription$:Subscription=new Subscription()

  constructor(private _router: Router, private _userService: UserService) { }

  submitForm(event:Event) {
    if (event) {
      this.subscription$= this._userService.changePassword(event).subscribe({
        next: (res)=>{
          if (res.success) {
            Swal.fire({
              icon: 'success',
              title: res.message,
              position: 'top',
              toast: true,
              showConfirmButton: false,
              timer:1500
            })
            this._router.navigate(['/user/home/profile'])
          } else {
            Swal.fire({
              icon: 'error',
              title: res.message,
              position: 'top',
              toast: true,
              showConfirmButton: false,
              timer:1500
            })
          }
        },
        error: (res) => {
          Swal.fire({
            icon: 'error',
            title: res.message,
            position: 'top',
            toast: true,
            showConfirmButton: false,
            timer:1500
          })
        }
      })

    }
  }
 ngOnDestroy(): void {
   if (this.subscription$) {
    this.subscription$.unsubscribe()
  }
 }
}
