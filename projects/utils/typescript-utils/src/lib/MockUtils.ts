
/**
 * Function to get data from a mock file
 *
 * @export
 * @param {path} path Mock file relative path
 * @param {number} [delay=500] Delay on getting mock service in miliseconds
 * @return {*}  {Promise<any>}
 */
export function getMock(path:string, delay: number = 500): Promise<any> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        fetch(path)
          .then(response => {
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            return response.json();
          })
          .then(data => resolve(data))
          .catch(error => reject(error));
      }, delay);
    });
  }