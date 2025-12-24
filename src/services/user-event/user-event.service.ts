import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UserEntity } from 'src/auth/entities/user.entity';
import { UserEnum } from 'src/common/enums/user.enum';
import { UserRegisteredEvent } from 'src/common/models/userRegisteredEvent.model';

@Injectable()
export class UserEventService {
    constructor(private readonly eventEmitter: EventEmitter2) {}

    emitUserRegister(user:UserEntity) {
        const userRegisteredEvent :UserRegisteredEvent = {
            user: {
                id: user.id,
                email: user.email,
                name: ''
            },
            timestamp: new Date()
        }

        this.eventEmitter.emit(UserEnum.USER_REGISTERED_EVENT_KEY , userRegisteredEvent);
    }
}
