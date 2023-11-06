import { Role } from "./Role"

export interface User{
    id?: number
    username: string
    password: string,
    profilePictureName: string,
    roles: Role[]
}