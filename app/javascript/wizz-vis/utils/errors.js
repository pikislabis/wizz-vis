/* jshint esversion: 6 */

export default {
  handleErrors(response) {
    const data = response.data;
    if (response.statusText !== "OK") {
      return data.then(err => { throw err; });
    }
    return data;
  }
};
