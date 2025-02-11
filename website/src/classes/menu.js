class Menu {
    constructor(dishes=[], time = new Date()) {
      this.time = time; 
      this.dishes = dishes; 
      this.archive = false;
    } 
    archive_(){ 
      this.archive = true;
    }
  }
  
  // Export the classes to be used in other files
  module.exports = { Menu }; 

/*
class Menu {
    constructor(items = []) {
      this.items = items;
      this.archive = false;
    }
  
    archive_(){ 
      this.archive = true;
    }
  }
  
  // Export the classes to be used in other files
  module.exports = { Menu };
  */
