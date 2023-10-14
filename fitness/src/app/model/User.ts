import { Guest } from "./Guest"
import { Role } from "./Role"
import { Trainer } from "./Trainer"

export interface User{
    id?: number
    username: string
    password: string
    roles: Role[]
    guest: Guest
    trainer: Trainer
}