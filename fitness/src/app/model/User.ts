import { Guest } from "./Guest"
import { Role } from "./Role"
import { Trainer } from "./Trainer"

export interface User{
    id?: number
    username: string
    password: string,
    profilePictureName: string,
    roles: Role[]
    trainer: Trainer,
    guest: Guest
}