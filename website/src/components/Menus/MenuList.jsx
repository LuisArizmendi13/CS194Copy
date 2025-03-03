import React from "react";
import MenuBox from "./MenuBox";

const MenuList = ({ menus, onDelete }) => {
  return (
    <div className="mt-4">
      {menus.map(menu => (
        <MenuBox key={menu.menuID} menu={menu} onDelete={onDelete} />
      ))}
    </div>
  );
};

export default MenuList;
