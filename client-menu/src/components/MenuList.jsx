import MenuItem from "./MenuItem";

const MenuList = ({ menuItems, quantities, setQuantities }) => (
  <div className="bg-white rounded-md shadow-sm overflow-hidden mb-6">
    {menuItems.map((dish, index) => (
      <MenuItem
        key={index}
        dish={dish}
        quantity={quantities[dish.name]}
        setQuantities={setQuantities}
      />
    ))}
  </div>
);

export default MenuList;
