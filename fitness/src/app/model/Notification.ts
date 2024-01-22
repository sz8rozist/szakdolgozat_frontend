export interface Notification{
    notificationId: number,
    message: string,
    type: string,
    date: string,
    guestFirstName: string,
    guestLastName: string,
    trainerFirstName: string,
    trainerLastName: string,
    viewed: boolean
}