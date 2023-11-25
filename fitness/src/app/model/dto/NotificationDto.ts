export interface NotificationDto{
    notificationId: number,
    message: string,
    trainerFirstName: string,
    trainerLastName: string,
    guestFirstName: string,
    guestLastName: string,
    viewed: boolean,
    notificationType: string,
    date: string
}