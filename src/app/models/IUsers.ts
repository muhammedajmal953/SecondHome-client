

export interface RegisterUser {
  First_name: string;
  Last_name: string;
  Email: string;
  Phone: number;
  Gender: 'Male'|'Female'|'Others'
  Password: string | null;
}

export interface LoginUser{
  Email: string|null;
  Password: string | null;
  fcmToken: string | null;
}

export interface UserDoc{
  _id: string;
  token: string;
  First_name: string;
  Email: string;
  Token: string;
  Phone: number;
  Gender: 'Male' | 'Female' | 'Others';
  IsActive: boolean;
  isKYCVerified: boolean;
  lisence: string
  Avatar:string
}


