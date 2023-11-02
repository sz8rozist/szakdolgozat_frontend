import { TargetedBodyPart } from "./TargetedBodyPartEnum";

export interface Exercise{
    id?: number
    name: string,
    description: string,
    targetedBodyPart: TargetedBodyPart,
}