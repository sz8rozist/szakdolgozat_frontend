import { Guest } from "./Guest";
import { Trainer } from "./Trainer";
import { User } from "./User";

export interface UserResponse{
    user:User
    trainer: Trainer
    guest: Guest
}