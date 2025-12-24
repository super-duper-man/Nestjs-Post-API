export interface UserRegisteredEvent {
    user: {
        id: number,
        email: string,
        name: string
    },
    timestamp: Date
}