import { EventEmitter, Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export class TabNo {
  num: number;
  pnum: string;
  sid: string;
}

@Injectable()
export class ProductService {
  defaultTabNo: TabNo = { num: 1, pnum: '', sid: '' };
  TabNoEventer: EventEmitter<TabNo> = new EventEmitter();
  constructor() { }
}
