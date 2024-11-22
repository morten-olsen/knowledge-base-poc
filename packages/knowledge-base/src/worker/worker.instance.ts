import { Store } from "../exports.mjs"
import { WorkerRequests } from "./worker.requests.js";

type KnowledgeBaseWorkerOptions = {
  store: Store<any>;
}


function isMessageType<TKey extends keyof WorkerRequests>(type: TKey, message: unknown): message is {
  type: TKey;
  id: string;
  payload: WorkerRequests[TKey]['input']
} {
  if (typeof message !== 'object' || !message) {
    return false;
  }
  if ('type' in message && message.type === type) {
    return true;
  }
  return false;
}

class KnowledgeBaseWorkerInstance {
  #options: KnowledgeBaseWorkerOptions;
  constructor(options: KnowledgeBaseWorkerOptions) {
    this.#options = options;
    self.addEventListener('message', this.#handleMessage);
  }

  #respond = <TKey extends keyof WorkerRequests>(
    id: string,
    type: TKey,
    payload: WorkerRequests[TKey]['output'],
  ) => {
    console.log('response', id, type, payload);
    self.postMessage({
      type,
      id,
      payload,
    });
  }

  #handleMessage = async ({ data: message }: MessageEvent) => {
    const { store } = this.#options;
    if (isMessageType('update', message)) {
      await store.update();
      return this.#respond(message.id, message.type, {});
    }

    if (isMessageType('search', message)) {
      const results = await store.search(message.payload);
      return this.#respond(message.id, message.type, {
        results,
      });
    }

    if (isMessageType('getDocuments', message)) {
      const results = await store.getDocuments();
      return this.#respond(message.id, message.type, {
        results,
      });
    }

    if (isMessageType('add', message)) {
      await store.insert(message.payload.items);
      return this.#respond(message.id, message.type, {});
    }
  }
}

const createWorker = (options: KnowledgeBaseWorkerOptions) => {
  const worker = new KnowledgeBaseWorkerInstance(options);
  return worker;
}

export { createWorker }
