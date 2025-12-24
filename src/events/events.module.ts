import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { UserEventService } from 'src/services/user-event/user-event.service';
import { UserRegisteredListener } from './listeners/user-register.listener';

@Module({
    imports: [
        EventEmitterModule.forRoot({
            global: true,
            wildcard: false,
            maxListeners: 20,
            verboseMemoryLeak: true
        })
    ],
    providers: [UserEventService, UserRegisteredListener],
    exports: [UserEventService]
})
export class EventsModule {}
