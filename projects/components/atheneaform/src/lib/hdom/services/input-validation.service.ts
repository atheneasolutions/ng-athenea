import { Injectable } from '@angular/core';
import { HdomService } from './hdom.service';

@Injectable({
  providedIn: 'root'
})
export class InputValidationService {

  constructor(public hdom: HdomService) { }


  /**
   * Funció per validar si l'input és només numéric
   * 
   * @param val Valor a validar
   * @returns boolean
   */
  isOnlyNumeric(val: any, canBeNull = true) {
    var reg = /^[0-9]{0,4}?$/i;
    if (canBeNull && (val === null || val === '')) return true;
    return reg.test(val);
  }

  /**
   * Funció per validar si l'input és només número enter
   * 
   * @param val Valor a validar
   * @returns boolean
   */
  isInteger(val: any, canBeNull = false) {
    var reg = /^[0-9]\d*$/i;
    if (canBeNull && (val === null || val === '')) return true;
    return reg.test(val);
  }

  /**
   * Funció per validar si l'input és només numéric acceptant decimals
   * 
   * @param val Valor a validar
   * @returns boolean
   */
  isNumberDecimal(val: any, canBeNull = false) {
    var reg = /^[1-9]\d*(\.\d+)?$/i;
    if (canBeNull && (val === null || val === '')) return true;
    return reg.test(val);
  }

  /**
   * Funció per validar si el valor de la temperatura és correcte
   * 
   * @param val Valor a validar
   * @returns boolean
   */
  isTemperature(val: any) {
    let number = this.isNumberDecimal(val, false);
    if (!number) return { valid: false, error: "not_number" };
    if (val > 44) return { valid: false, error: "invalid_range" };
    if (val < 16) return { valid: false, error: "invalid_range" };
    return { valid: true }
  }

  /**
   * Funció per validar si el valor de la bàscula és correcte
   * 
   * @param val Valor a validar
   * @returns boolean
   */
  isWeight(val: any) {
    let number = this.isNumberDecimal(val, false);
    if (!number) return { valid: false, error: "not_number" };
    if (val > 299) return { valid: false, error: "invalid_range" };
    if (val < 0) return { valid: false, error: "invalid_range" };
    return { valid: true }
  }

  /**
    * Funció per validar si el valor de la bàscula és correcte
    * 
    * @param val Valor a validar
    * @returns boolean
    */
  isRespiratoryRate(val: any, unit: any) {
    if (unit != this.hdom.UNITS_LABELS.rpm) return { valid: false, error: "invalid_unit" };
    let number = this.isInteger(val, false);
    if (!number) return { valid: false, error: "not_number" };
    if (val > 45) return { valid: false, error: "invalid_range" };
    if (val < 0) return { valid: false, error: "invalid_range" };
    return { valid: true }
  }

  /**
    * Funció per validar si el valor de la bàscula és correcte
    * 
    * @param val Valor a validar
    * @returns boolean
    */
  isOxygenSat(val: any, unit: any) {
    if (unit != this.hdom.UNITS_LABELS.percentage) return { valid: false, error: "invalid_unit" };
    let number = this.isInteger(val, false);
    if (!number) return { valid: false, error: "not_number" };
    if (val > 100) return { valid: false, error: "invalid_range" };
    if (val < 0) return { valid: false, error: "invalid_range" };
    return { valid: true }
  }

  /**
  * Funció per validar si el valor de la bàscula és correcte
  * 
  * @param val Valor a validar
  * @returns boolean
  */
  isHeartRate(val: any) {
    let number = this.isInteger(val, false);
    if (!number) return { valid: false, error: "not_number" };
    if (val > 199) return { valid: false, error: "invalid_range" };
    if (val < 0) return { valid: false, error: "invalid_range" };
    return { valid: true }
  }

  /**
  * Funció per validar si el valor de la bàscula és correcte
  * 
  * @param val Valor a validar
  * @returns boolean
  */
  isBloodPressure(val: any, diastolic = false) {
    let number = this.isInteger(val, false);
    if (!number) return { valid: false, error: "not_number" };
    if (val > 299) return { valid: false, error: "invalid_range" };
    if(diastolic && val > 149) return {valid: false, error: 'invalid_range'};
    if (val < 0) return { valid: false, error: "invalid_range" };
    return { valid: true }
  }


  /**
  * Funció per validar si el valor de la bàscula és correcte
  * 
  * @param val Valor a validar
  * @returns boolean
  */
   isBloodGlucose(val: any) {
    let number = this.isInteger(val, false);
    if (!number) return { valid: false, error: "not_number" };
    if (val > 999) return { valid: false, error: "invalid_range" };
    if (val < 1) return { valid: false, error: "invalid_range" };
    return { valid: true }
  }
  
}
