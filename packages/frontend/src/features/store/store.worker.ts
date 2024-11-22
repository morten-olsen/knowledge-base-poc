import { createWorker, Store } from "@morten-olsen/knowledge-base";
import { MyBuilder } from "./store.builder";

const store = new Store({
  builder: new MyBuilder(),
});

createWorker({
  store,
});
