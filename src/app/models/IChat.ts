
export interface IChat{
  userId: string,
  roomId:string,
  vendorId: string,
  messages: {
    time: Date,
    sender: string,
    content:string
  }[]
}
