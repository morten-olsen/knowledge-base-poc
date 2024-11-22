import { createContext, useContext } from "react";
import { KnowledgeBaseWorker } from "@morten-olsen/knowledge-base";
import { MyBuilder } from "./store.builder";

type StoreContextValue = {
  store: KnowledgeBaseWorker<MyBuilder>;
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
