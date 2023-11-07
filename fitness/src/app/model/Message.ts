import { User } from "./User";

export interface Message{
    senderUser: User | undefined
    receiverUser: User | undefined
    message: string
    dateTime: string
}