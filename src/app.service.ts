import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
  getHealth(): object {
    return {
      status: 'OK',
      message: 'Server is running',
      timestamp: new Date().toISOString(),
    };
  }
}
