import { Exercise } from "./Exercise"
import { Trainer } from "./Trainer"

export interface Workout{
    workoutId?: number
    sets: number
    repetitions: number
    date: string
    exercise: Exercise,
    trainer?: Trainer,
    done: boolean
}