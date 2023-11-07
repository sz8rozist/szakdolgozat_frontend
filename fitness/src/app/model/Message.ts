import { User } from "./User";

export interface Message{
    senderUser: User | null
    receiverUser: User | null
    message: string
    dateTime: string
}