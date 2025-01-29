class Menu {
    constructor(dishes=[], time = new Date()) {
      this.time = time; 
      this.dishes = dishes; 
    }
  }
  
  // Export the classes to be used in other files
  module.exports = { Menu };