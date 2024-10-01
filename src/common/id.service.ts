import { Injectable } from '@nestjs/common';
import { v7 as uuid } from 'uuid';

@Injectable()
export class IdService {
  generateId(): string {
    return uuid();
  }
}
