import React from "react";
import MenuBox from "./MenuBox";

const MenuList = ({ menus, onDelete, setLiveMenu }) => { // ✅ Accept setLiveMenu
  return (
    <div className="mt-4">
      {menus.map(menu => (
        <MenuBox key={menu.menuID} menu={menu} onDelete={onDelete} setLiveMenu={setLiveMenu} /> // ✅ Pass it down
      ))}
    </div>
  );
};

export default MenuList;
