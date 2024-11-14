import { IBooking } from '../../models/IBookings';

export function getDailyData(booking: IBooking[]): {
  labels: string[];
  data: number[];
} {
  const labels = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];

  const weekdayCounts = new Array(7).fill(0);

  booking.forEach((booking) => {
    const today = new Date();
    const booked = new Date(booking.bookedAt);
    const daydif = Math.floor(
      (today.getTime() - booked.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daydif <= 7 && daydif >= 0) {
      const dayOfWeek = new Date(booking.bookedAt).getDay();
      weekdayCounts[dayOfWeek]+=booking.numberOfGuests
    }
  });


  return {
    labels: labels,
    data:weekdayCounts
  }
}

export function getMonthlyData(booking: IBooking[]): {
  labels: string[];
  data: number[];
} {
  const labels = [
   "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  const montlyCounts = new Array(12).fill(0)

  booking.forEach((booking) => {


    let year = new Date().getFullYear()
    const bookedyear=new Date(booking.bookedAt).getFullYear()
    if (bookedyear === year) {
      const bookedMonth=new Date(booking.bookedAt).getMonth()
      montlyCounts[bookedMonth]+=booking.numberOfGuests
    }
  });


  return {
    labels: labels,
    data:montlyCounts
  }
}


export function getYearlyData(bookings: IBooking[]): { labels: string[], data: number[] } {
  const yearlyCounts: { [year: number]: number } = {};

  bookings.forEach(booking => {
    const year = new Date(booking.bookedAt).getFullYear();
    yearlyCounts[year] = (yearlyCounts[year] || 0) + booking.numberOfGuests;
  });

  return {
    labels: Object.keys(yearlyCounts).map(year => year.toString()),
    data: Object.values(yearlyCounts),
  };
}

