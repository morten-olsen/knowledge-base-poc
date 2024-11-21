import { Builder, Store } from "@morten-olsen/knowledge-base";
import { ReactNode, useRef } from "react"
import { StoreContext } from "./store.context";

type StoreProviderProps = {
  children?: ReactNode;
}

class MyBuilder extends Builder<Document> {
  public process(item: Document) {
    return {
      id: item.id,
      chunks: [item.body],
    }
  }

  public async *fetch() {
    yield [{
      id: 'cow',
      body: 'The cow says muh',
    }, {
      id: 'cat',
      body: 'The cat says miauw',
    }, {
      id: 'kangaru',
      body: 'The kangaru says hello',
    }];
  }
}

type Document = {
  id: string;
  body: string;
};

const StoreProvider = ({ children }: StoreProviderProps) => {
  const store = useRef(new Store({
    builder: new MyBuilder(),
  }));

  return (
    <StoreContext.Provider value={{ store: store.current }}>
      {children}
    </StoreContext.Provider>
  )
}

export { StoreProvider };
