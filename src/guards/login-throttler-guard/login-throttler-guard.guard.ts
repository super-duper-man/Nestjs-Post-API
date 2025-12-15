import { Injectable } from '@nestjs/common';
import { ThrottlerException, ThrottlerGuard } from '@nestjs/throttler';

@Injectable()
export class LoginThrottlerGuardGuard extends ThrottlerGuard {
  protected async getTracker(req: Record<string, any>): Promise<string> {
    const email = req.body?.email || 'anonymous';
    return `login-${email}`;
  }

  protected getLimit(): Promise<number> {
    return Promise.resolve(5);
  }

  protected getTtl(): Promise<number> {
    return Promise.resolve(60000);
  }

  protected throwThrottlingException(): Promise<void>{
    throw new ThrottlerException('Too many attempts. please try again after 1 minute')
  }
}
