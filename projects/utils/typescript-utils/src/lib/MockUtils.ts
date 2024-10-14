export interface GetMockOptions {
  path: string,
  delay: number,
  default_value: any
}

/**
 * Function to get data from a mock file
 *
 * @export
 * @param {path} path Mock file relative path
 * @param {number} [delay=500] Delay on getting mock service in miliseconds
 * @return {*}  {Promise<any>}
 */
export function getMock(options:GetMockOptions): Promise<any> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        fetch(options.path)
          .then(response => {
            if (!response.ok) {
              let style = `font-weight: bold; background-color: #FD8C73; color:white; padding: 3px 7px 3px 7px ; border-radius: 3px 3px 3px 3px;`;
                console.error(`%cMockUtils`, style, "No mock file found, returning default value:", options.default_value);
              return options.default_value;
            }
            return response.json();
          })
          .then(data => resolve(data))
          .catch(error => reject(error));
      }, options.delay);
    });
  }