// Dish.js
class Dish {
  constructor(name, price, ingredients = []) {
    this.name = name;
    this.ingredients = ingredients; // List of ingredients for the dish
    this.price = price;SVGAnimatedLength
    this.sales = []; // List of sales made for this dish
    this.archive = false;
  }

  made_sale(sale) {
    this.sales.push(sale); // Add a sale to the list
  }

  sale_count() {
    return this.sales.length; // Return the number of sales
  }
  archive() {
    this.archive = true;
  }
}

class Sale {
  constructor(dish, location, time = new Date()) {
    this.time = time; // Time sale was made
    this.price = dish.price; // Price of the dish sold
    this.dish_name = dish.name; // Name of the dish sold

    // Enforce structured location format
    this.location = {
      name: location.name || "Unknown Location",
      address: location.address || "No Address Provided",
      city: location.city || "Unknown City",
      state: location.state || "Unknown State",
      zipcode: location.zipcode || "00000",
    };
  }
}

// Export the classes to be used in other files
module.exports = { Dish, Sale };
