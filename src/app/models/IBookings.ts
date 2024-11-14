export interface IBooking {
  bedType: string;
  bookedAt: Date;
  hostelDetails: any;
  isActive: boolean;
  isCancelled: boolean;
  numberOfGuests: number;
  userDetails: any;
  vendorDetails: any;
  totalAmount:number
}
