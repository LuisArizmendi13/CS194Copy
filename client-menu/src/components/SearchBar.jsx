const SearchBar = ({ restaurantSearch, setRestaurantSearch, handleRestaurantSearch }) => (
    <div className="bg-white rounded-md shadow-sm p-4 mb-6">
      <div className="md:flex md:items-center">
        <input
          type="text"
          placeholder="Enter restaurant name or ID..."
          value={restaurantSearch}
          onChange={(e) => setRestaurantSearch(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-1 focus:ring-blue-500"
        />
        <button
          className="w-full md:w-auto bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={handleRestaurantSearch}
        >
          Search
        </button>
      </div>
    </div>
  );
  
  export default SearchBar;
  