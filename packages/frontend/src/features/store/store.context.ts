import { createContext, useContext } from "react";
import { Store } from "@morten-olsen/knowledge-base";

type StoreContextValue = {
  store: Store<any>;
}

const StoreContext = createContext<StoreContextValue | undefined>(undefined);

const useStoreContext = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('Missing store context');
  }
  return context;
}

export { StoreContext, useStoreContext };
