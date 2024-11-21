import { Store } from "@morten-olsen/knowledge-base"
import { createContext, useContext } from "react";

type StoreContextValue = {
  // eslint-disable-next-line
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
