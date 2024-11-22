import { nanoid } from "nanoid";
import { Builder } from '../builder/builder.mjs';
import { WorkerRequests } from "./worker.requests.js";

type WorkerProxyOptions = {
  worker: Worker;
}

class KnowledgeBaseWorker<TBuilder extends Builder = Builder> {
  #options: WorkerProxyOptions;

  constructor(options: WorkerProxyOptions) {
    this.#options = options;
  }

  public request = <TKey extends keyof WorkerRequests>(
    type: TKey,
    payload: WorkerRequests<TBuilder>[TKey]['input'],
  ) => new Promise<WorkerRequests<TBuilder>[TKey]['output']>((resolve) => {
    const { worker } = this.#options;
    const id = nanoid();

    const handleReponse = ({ data }: MessageEvent) => {
      console.log('get response', data);
      if (!data || !('id' in data)) {
        return
      }
      if (data.id !== id) {
        return
      }

      worker.removeEventListener('message', handleReponse);
      console.log('accepted response', data);
      resolve(data.payload);
    }
    worker.addEventListener('message', handleReponse);

    worker.postMessage({
      type,
      id,
      payload,
    })
  });
}

export { KnowledgeBaseWorker };
