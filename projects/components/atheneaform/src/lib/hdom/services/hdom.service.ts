
import { BaseConstants } from './BaseConstants';

import { Injectable } from '@angular/core';


const MOCK = false;
const RANDOM = false;
export interface Endpoint {
  route:string,
  method:string
}

@Injectable({
  providedIn: 'root'
})
export class HdomService extends BaseConstants {

}
