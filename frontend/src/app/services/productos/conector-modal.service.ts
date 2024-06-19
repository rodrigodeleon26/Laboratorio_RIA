// conector-modal.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConectorModalService {
  private data = new BehaviorSubject(null);
  data$ = this.data.asObservable();

  changeData(newData: any) {
    this.data.next(newData);
  }
}
