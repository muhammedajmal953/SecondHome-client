import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { Hostels } from '../../../models/IHostel';
import { ToFirstCapitalPipe } from '../../../pipe/to-first-capital.pipe';

@Component({
  selector: 'app-view-hostel',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    ToFirstCapitalPipe,
    RouterModule
  ],
  templateUrl: './view-hostel.component.html',
  styleUrl: './view-hostel.component.css'
})
export class ViewHostelComponent implements OnInit{
 hostel$!:any
  constructor(private _router: Router, private _userService: UserService,private _activeRoute:ActivatedRoute) { }



spaceDetails: any;
selectedImageIndex: any;
averageRating: any;
ratingBreakdown: any;
similarSpaces: any;

ngOnInit(): void {
  this._activeRoute.params.subscribe(params => {
    this.fetchHostel(params['id'])
  })
  }

  fetchHostel(id:string) {
    this._userService.getHostel(id).subscribe({
      next: (res) => {
        if (res.success) {
          this.hostel$=res.data
        }
      },
      error: (err) => {
        console.log(err);

      },
      complete: () => {
        console.log('request completed');

      }
    })
  }

}
