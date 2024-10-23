
export interface Hostels{
  _id:string
  name: string;
    address: {
        street: string;
        city: string;
        district: string;
        state: string;
        pincode: number;
    }
    phone: string;
    email: string;
    description: string;
    facilities: string[];
    policies: string;
    nearbyPlaces: string[];
    photos: string[];
    rates: {type:string,price:number}[]
    foodRate: number;
    createdAt: Date;
    updatedAt: Date;
    isDeleted: boolean;
    isActive: boolean;
    category: string;
    owner: {};
    advance: number;
}
