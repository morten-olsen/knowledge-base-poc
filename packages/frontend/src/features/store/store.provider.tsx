import { ReactNode } from "react"
import { StoreContext } from "./store.context";
import { store } from "./store.worker";

type StoreProviderProps = {
  children?: ReactNode;
}

const StoreProvider = ({ children }: StoreProviderProps) => {
  return (
    <StoreContext.Provider value={{ store: store }}>
      {children}
    </StoreContext.Provider>
  )
}

export { StoreProvider };
