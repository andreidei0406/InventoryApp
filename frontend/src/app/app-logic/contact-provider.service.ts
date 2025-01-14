import { Injectable } from '@angular/core';
import {ContactData} from './contact-data';

@Injectable({
  providedIn: 'root'
})
export class ContactProviderService {
  providedData = <ContactData>{
    info: 'Inventory application',
    address: 'Strada Iuliu Maniu 50, Brașov 500091',
    openDays: 'Luni - Vineri',
    timeSlot: '09:00 - 17:00',
    phone: '+40 (268) 41 30 00'
  }

  constructor() { }

  getData(): ContactData {
    return this.providedData;
  }
}
