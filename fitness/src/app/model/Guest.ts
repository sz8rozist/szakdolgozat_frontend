import { Trainer } from "./Trainer"

export interface Guest{
    id?:number
    email: string
    height: number
    first_name: string,
    gender: boolean,
    last_name: string
    age: number
    weight: number
    notifications: [],
    dietRecommedations?: [],
    trainer: Trainer
    diets: []
    workouts: []
    trainer_guest?: boolean
}