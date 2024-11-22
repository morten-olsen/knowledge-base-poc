import { ReactNode, useRef } from "react"
import { StoreContext } from "./store.context";
import WorkerInstance from './store.worker?worker';
import { KnowledgeBaseWorker } from "@morten-olsen/knowledge-base";

type StoreProviderProps = {
  children?: ReactNode;
}

const StoreProvider = ({ children }: StoreProviderProps) => {
  const store = useRef(new KnowledgeBaseWorker({
    worker: new WorkerInstance(),
  }));
  return (
    <StoreContext.Provider value={{ store: store.current }}>
      {children}
    </StoreContext.Provider>
  )
}

export { StoreProvider };
