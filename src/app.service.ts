import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getString(text: string): string {
    return text;
  }
}
