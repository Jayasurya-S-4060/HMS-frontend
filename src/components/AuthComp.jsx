import React from "react";
import { useAuth } from "../context/AuthContext";

const MenuAuthComp = ({ children, compName }) => {
  const { permissions, user } = useAuth();
  const role = user?.role;
  const isAuth = permissions[role];

  if (!isAuth?.includes(compName)) return null;
  return <>{children}</>;
};

export default MenuAuthComp;
