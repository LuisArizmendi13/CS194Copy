import React from "react";
import MenuBox from "./MenuBox";

const MenuList = ({ menus, onDelete, setLiveMenu }) => {
  return (
    <div className="mt-4">
      {menus.map(menu => (
        <MenuBox key={menu.menuID} menu={menu} onDelete={onDelete} setLiveMenu={setLiveMenu} />
      ))}
    </div>
  );
};

export default MenuList;
