// Dish.js
class Dish {
  constructor(name, description, price, ingredients = []) {
    this.name = name;
    this.description = description; // ✅ New Description Field
    this.ingredients = ingredients;
    this.price = price;
    this.sales = [];
    this.archive = false;
  }

  made_sale(sale) {
    this.sales.push(sale);
  }

  sale_count() {
    return this.sales.length;
  }

  archive() {
    this.archive = true;
  }
}

class Sale {
  constructor(dish, location, time = new Date()) {
    this.time = time;
    this.price = dish.price;
    this.dish_name = dish.name;
    this.description = dish.description; // ✅ Ensure Description is Available
    this.location = {
      name: location.name || "Unknown Location",
      address: location.address || "No Address Provided",
      city: location.city || "Unknown City",
      state: location.state || "Unknown State",
      zipcode: location.zipcode || "00000",
    };
  }
}

module.exports = { Dish, Sale };
