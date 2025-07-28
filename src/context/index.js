"use client";

import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";

const { createContext, useState, useEffect } = require("react");

export const GlobalContext = createContext(null);

export const GlobalState = ({ children }) => {
  const [sideBarOpen, setSideBarOpen] = useState(false);
  const {status} = useSession()
  const pathName = usePathname()
  const router = useRouter()

  useEffect(()=>{
    if(status==='unauthenticated' && (pathName.includes('/' || '/products' || "/visitors"))){
      router.push("/unauth-page")
    }
  },[status])
  return (
    <GlobalContext.Provider value={{ sideBarOpen, setSideBarOpen }}>
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalState;
