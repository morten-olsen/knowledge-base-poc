import { Builder, SearchResult, StoreDocument } from "../exports.mjs";

type WorkerRequests<TBuilder extends Builder = Builder> = {
  search: {
    input: {
      prompt: string;
    };
    output: {
      results: SearchResult[];
    }
  };
  add: {
    input: {
      items: TBuilder extends Builder<infer U> ? U[] : never;
    };
    output: Record<string, never>;
  };
  update: {
    input: Record<string, never>;
    output: Record<string, never>;
  };
  getDocuments: {
    input: Record<string, never>;
    output: {
      results: StoreDocument[];
    }
  }
}

export { type WorkerRequests }
