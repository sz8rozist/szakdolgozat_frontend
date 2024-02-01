import { Role } from "./Role"

export interface SignupUser{
    firstName: string
    lastName: string
    username: string
    password: string
    email: string
    role: Role,
    gender: number
}