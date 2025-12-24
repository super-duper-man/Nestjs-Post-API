import { Injectable, Logger } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { UserEnum } from "src/enums/user.enum";
import type { UserRegisteredEvent } from "src/models/userRegisteredEvent.model";

@Injectable()
export class UserRegisteredListener {
    constructor() { }

    private readonly logger = new Logger(UserRegisteredListener.name);

    @OnEvent(UserEnum.USER_REGISTERED_EVENT_KEY)
    handleUserRegistered(event: UserRegisteredEvent) {
        const { user, timestamp } = event;

        this.logger.log(`Welcome, ${user.email}!, Your account created at ${timestamp.toISOString()}`);
    }
}