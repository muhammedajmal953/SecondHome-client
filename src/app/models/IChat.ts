import { UserDoc } from "./IUsers"

export interface IChat{
  userId: string,
  roomId:string,
  vendorId: string,
  messages: {
    time: Date,
    sender: string,
    content:string
  }[]
  user:any
}

export interface IChatResponse{
  chat: IChat
  vendor:UserDoc
}
