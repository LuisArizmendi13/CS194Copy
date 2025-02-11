// Dish.js
class Dish {
    constructor(name, price, ingredients = []) {
      this.name = name;
      this.ingredients = ingredients; // List of ingredients for the dish
      this.price = price;
      this.sales = []; // List of sales made for this dish 
      this.archive = false;
    }
  
    made_sale(sale) {
      this.sales.push(sale); // Add a sale to the list
    }
  
    sale_count() {
      return this.sales.length; // Return the number of sales
    } 
    archive(){ 
      this.archive = true;
    }
  }
  
  class Sale {
    constructor(dish, location, time = new Date()) {
      this.time = time; // Time sale was made
      this.price = dish.price; // Price of the dish sold
      this.dish_name = dish.name; // Name of the dish sold
      this.location = location; 
    }
  }
  
  // Export the classes to be used in other files
  module.exports = { Dish, Sale };
  