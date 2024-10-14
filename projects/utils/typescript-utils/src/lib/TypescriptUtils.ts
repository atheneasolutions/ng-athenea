/**
 * Function that returns a clone of any given data
 * @param data{ any } Data to clone
 * @returns { any }
 */
export function clone(data:any){
    let result = JSON.parse(JSON.stringify(data)) ?? null;
    return result;
}

/**
 * Function to check if two arrays have the same value
 *
 * @param {Array<any>} arr1 First array to compare
 * @param {Array<any>} arr2 Second array to compare
 * @return {*}  {boolean}
 */
export function arraysEqual(arr1: Array<any>, arr2: Array<any>): boolean {
    if (arr1.length !== arr2.length) return false;
  
    for (let i = 0; i < arr1.length; i++) {
      if (arr1[i] !== arr2[i]) return false;
    }
  
    return true;
  }
  

/**
 * Function that checks common keys differences between two objects
 *
 * @export
 * @param {*} object1
 * @param {*} object2
 * @return {*}  {boolean}
 */
export function hasDifferences(object1: any, object2: any): boolean {
  const commonKeys = Object.keys(object1).filter(key => key in object2);

  for (const key of commonKeys) {
    const value1 = object1[key];
    const value2 = object2[key];

    if (Array.isArray(value1) && Array.isArray(value2)) {
      if (!arraysEqual(value1, value2)) {
        return true;
      }
    } 
    else if (value1 !== value2) {
      return true;
    }
  }

  return false;
  }