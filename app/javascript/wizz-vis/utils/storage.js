/* jshint esversion: 6 */

export default {
  persistDetails(store, selector, content) {
    const storage = JSON.parse(localStorage.getItem(store)) || {};
    localStorage.setItem(store, JSON.stringify({...storage, [selector]: content}));
  },

  loadDetails(store, selector) {
    return (JSON.parse(localStorage.getItem(store)) || {})[selector];
  }
};
