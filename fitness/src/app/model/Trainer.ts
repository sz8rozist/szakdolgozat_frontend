import { User } from "./User"

export interface Trainer{
    id?: number
    email: string
    first_name: string
    last_name:string
    type: string
    notifications: []
    guests: []
    diets: []
    workouts: []
    user?: User
}