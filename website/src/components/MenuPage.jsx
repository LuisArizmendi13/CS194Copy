import React, { useState, useEffect } from 'react';
    // Import the Dish class
    const { Dish } = require('./DishesPage.jsx');

    // Create some sample dishes
    const dishes = [
      new Dish("Spaghetti Carbonara", 12.99, ["Pasta", "Eggs", "Cheese", "Bacon"]),
      new Dish("Margherita Pizza", 10.99, ["Dough", "Tomato Sauce", "Mozzarella", "Basil"]),
      new Dish("Caesar Salad", 8.99, ["Lettuce", "Croutons", "Parmesan", "Caesar Dressing"]),
      new Dish("Beef Burger", 11.99, ["Beef Patty", "Bun", "Lettuce", "Tomato", "Cheese"])
    ];

const MenuPage = () => {


function createPropertyCard(dish) {
  const card = document.createElement('div');
  card.className = 'relative mx-auto w-full';

  const link = document.createElement('a');
  link.href = '#';
  link.className = 'relative inline-block duration-300 ease-in-out transition-transform transform hover:-translate-y-2 w-full';

  const cardContent = document.createElement('div');
  cardContent.className = 'shadow p-4 rounded-lg bg-white';

  // Image container (you might want to add actual images for dishes)
  const imageContainer = document.createElement('div');
  imageContainer.className = 'flex justify-center relative rounded-lg overflow-hidden h-52';

  const imageWrapper = document.createElement('div');
  imageWrapper.className = 'transition-transform duration-500 transform ease-in-out hover:scale-110 w-full';

  const imageDarkOverlay = document.createElement('div');
  imageDarkOverlay.className = 'absolute inset-0 bg-black opacity-10';

  imageWrapper.appendChild(imageDarkOverlay);
  imageContainer.appendChild(imageWrapper);

  // Dish details
  const detailsContainer = document.createElement('div');
  detailsContainer.className = 'absolute flex justify-center bottom-0 mb-3';

  const detailsWrapper = document.createElement('div');
  detailsWrapper.className = 'flex bg-white px-4 py-1 space-x-5 rounded-lg overflow-hidden shadow';

  const details = [
    { icon: 'ingredients', text: dish.ingredients.length },
    { icon: 'sales', text: dish.sale_count() },
    { icon: 'archive', text: dish.archive ? 'Yes' : 'No' }
  ];

  details.forEach(detail => {
    const detailElement = document.createElement('p');
    detailElement.className = 'flex items-center font-medium text-gray-800';
    detailElement.innerHTML = `<svg class="w-5 h-5 fill-current mr-2"></svg>${detail.text}`;
    detailsWrapper.appendChild(detailElement);
  });

  detailsContainer.appendChild(detailsWrapper);
  imageContainer.appendChild(detailsContainer);

  cardContent.appendChild(imageContainer);

  // Dish name and price
  const titleContainer = document.createElement('div');
  titleContainer.className = 'mt-4';

  const title = document.createElement('h2');
  title.className = 'font-medium text-base md:text-lg text-gray-800 line-clamp-1';
  title.textContent = dish.name;

  const price = document.createElement('p');
  price.className = 'mt-2 text-sm text-gray-800 line-clamp-1';
  price.textContent = `$${dish.price.toFixed(2)}`;

  titleContainer.appendChild(title);
  titleContainer.appendChild(price);
  cardContent.appendChild(titleContainer);

  // Additional dish features
  const featuresGrid = document.createElement('div');
  featuresGrid.className = 'grid grid-cols-2 grid-rows-2 gap-4 mt-8';

  const features = [
    { icon: 'ingredients', text: `${dish.ingredients.length} ingredients` },
    { icon: 'sales', text: `${dish.sale_count()} sales` },
    { icon: 'archive', text: dish.archive ? 'Archived' : 'Active' },
    { icon: 'price', text: `$${dish.price.toFixed(2)}` }
  ];

  features.forEach(feature => {
    const featureElement = document.createElement('p');
    featureElement.className = 'inline-flex flex-col xl:flex-row xl:items-center text-gray-800';
    featureElement.innerHTML = `<svg class="inline-block w-5 h-5 xl:w-4 xl:h-4 mr-3 fill-current text-gray-800"></svg><span class="mt-2 xl:mt-0">${feature.text}</span>`;
    featuresGrid.appendChild(featureElement);
  });

  cardContent.appendChild(featuresGrid);

  link.appendChild(cardContent);
  card.appendChild(link);

  return card;
}

function createPropertyGrid(dishes) {
  const grid = document.createElement('div');
  grid.className = 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full';

  dishes.forEach(dish => {
    const card = createPropertyCard(dish);
    grid.appendChild(card);
  });

  return grid;
}

// Usage
const propertyGrid = createPropertyGrid(dishes);
document.body.appendChild(propertyGrid);

}
export default MenuPage;