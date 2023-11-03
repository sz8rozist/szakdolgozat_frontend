import { Exercise } from "./Exercise"

export interface Workout{
    id?: number
    sets: number
    repetitions: number
    date: string
    exercise: Exercise
}