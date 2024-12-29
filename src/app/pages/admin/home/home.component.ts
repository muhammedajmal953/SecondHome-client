import { Component, OnInit } from '@angular/core';
import Chart, { Legend } from 'chart.js/auto'
import { AdminService } from '../../../services/admin.service';
import { IBooking } from '../../../models/IBookings';
import { getDailyData, getMonthlyData, getYearlyData } from '../../../shared/helpers/chartUpdate';
import { CommonModule } from '@angular/common';
import { UserDoc } from '../../../models/IUsers';
import { Hostels } from '../../../models/IHostel';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
   CommonModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit{
  chart!: Chart<"bar", number[], string>;
  montly: string[] = []
  allBookings!: IBooking[]
  totalUsers: number=0
  totalVendors: number=0
  totalRevenew:number=0
  totalHostels:number=0
  topSellingHostels!:Hostels[]
  constructor(private _adminService:AdminService,private _router:Router){}

  ngOnInit(): void {
    this.getsales()
  }

  showChart(labels:string[],data:number[]) {
    return this.chart = new Chart('canvas', {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Bookings',
            data: data,
            borderWidth: 1,
          },
        ]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              color: 'white'
            }
          },
          x: {
            ticks: {
              color: 'white'
            }
          }
        },
        plugins: {
          legend: {
            labels: {
              color: 'white',
              font: {
                size:18
              }
            }
          }
        },
        responsive:true
      },

    })

  }

  getsales() {
    this._adminService.getAllDatas().subscribe({
      next: (res) => {

        if (res.success) {
          this.allBookings = res.data.bookings
          this.allBookings.forEach((booking) => {
            this.totalRevenew += booking.totalAmount
          })

          res.data.users.forEach((item:any) => {
            if (item.Role === 'User') {
              this.totalUsers+=1
            }
            if (item.Role === 'Vendor') {
              this.totalVendors+=1
            }
          })


          this.topSellingHostels=this.getTopSellingHostels(this.allBookings,res.data.hostels)
          this.totalHostels=res.data.hostels.length
          this.showChart(getDailyData(this.allBookings).labels, getDailyData(this.allBookings).data)

          console.log(this.topSellingHostels);

        }
      },
      error: (err) => {
        if (err.error.message === 'Please login') {
          localStorage.removeItem('admin')
          this._router.navigate(['/admin'])
        }
      }
    })
  }



  filterChart(event: Event) {
    const target = event.target as HTMLSelectElement

    const ctx = document.getElementById('canvas') as HTMLCanvasElement

    if (this.chart) {
      this.chart.destroy()
    }

    if (target.value === 'yearly') {

      const labels = getYearlyData(this.allBookings).labels
      const data = getYearlyData(this.allBookings).data
      console.log(labels);
      console.log(data);

      this.showChart(labels,data)
    } else if (target.value === 'monthly') {
      const labels = getMonthlyData(this.allBookings).labels
      const data = getMonthlyData(this.allBookings).data
      console.log(labels);
      console.log(data);
      this.showChart(labels,data)
    } else if (target.value === 'daily') {
      const labels = getDailyData(this.allBookings).labels
      const data = getDailyData(this.allBookings).data
      console.log(labels);
      console.log(data);
      this.showChart(labels,data)
    }
  }

  getTopSellingHostels(booking: IBooking[], hostels: Hostels[]): Hostels[]{
    const bookingCount: { [key: string]: number } = {}

    booking.forEach((booking) => {
      if (!booking.isActive) {
        const hosteId = booking.hostelDetails?._id
        bookingCount[hosteId]=(bookingCount[hosteId]||0)+1
      }

    })
    const hostelWithCount = hostels.map((hostel) => ({
      ...hostel,
      bookingCount:bookingCount[hostel._id]
    }))

    hostelWithCount.sort((a,b)=>b.bookingCount-a.bookingCount)

    return hostelWithCount.slice(0,3)
  }
}
