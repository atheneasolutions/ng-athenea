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
    } else if (typeof value1 === 'object' && typeof value2 === 'object'){
      if(hasDifferences(value1, value2)) return true;
    } else if (value1 !== value2) {
      return true;
    }
  }

  return false;
}



type Diff<T> = {
  [K in keyof T]?: T[K];
};


/**
 * Compares two objects and returns an object containing the differences
 * in their common fields, with values taken from the second object.
 *
 * @template T The type of the objects being compared.
 * @param {T} obj1 The original object to compare.
 * @param {T} obj2 The object containing potential changes.
 * @returns {Partial<Diff<T>>} An object with the differences from the common fields.
 */
export function objectChanges<T extends Record<string, any>>(
    obj1: T,
    obj2: T,
  ): Partial<Diff<T>> {
    const differences: Partial<Diff<T>> = {};

    for (const key in obj1) {
      if (key in obj2) {
        const value1 = obj1[key];
        const value2 = obj2[key];

        // Check if both values are objects and not null
        if (
          value1 &&
          value2 &&
          typeof value1 === 'object' &&
          typeof value2 === 'object' &&
          !Array.isArray(value1) &&
          !Array.isArray(value2)
        ) {
          // Recursive call
          const nestedDiff = objectChanges(value1, value2);
          if (Object.keys(nestedDiff).length > 0) {
            // Cast nestedDiff to the correct type for the key
            differences[key] = nestedDiff as T[typeof key];
          }
        } else if (value1 !== value2) {
          differences[key] = value2;
        }
      }
    }

    return differences;
  }