
export const patters = {
  EMAIL: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$',
  FIRST_NAME: '^[a-zA-Z]{5,}$',
  LAST_NAME: '^[a-zA-Z]{3,}$',
  PASSWORD: '^(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{8,}$',
  PHONE: '^[5-9][0-9]{9}$',
  PLACE: '^[a-zA-Z0-9]{3,}$',
  TEXT_CONTENT: '^[a-zA-Z0-9]+( [a-zA-Z0-9]+)*$',
  RATE: '^[1-9][0-9]*$',
  PINCODE:'^[1-9][0-9]{5}$'
}
