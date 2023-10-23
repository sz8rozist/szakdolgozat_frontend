import { Trainer } from "./Trainer"

export interface Guest{
    id?:number
    email: string
    height: number
    first_name: string
    last_name: string
    age: number
    weight: number
    notification: []
    trainer:Trainer
    diets: []
    workouts: []
}