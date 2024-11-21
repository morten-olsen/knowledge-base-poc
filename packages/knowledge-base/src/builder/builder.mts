type FetchOptions = {
  last?: Date;
  count: number
}

type BuilderDocument = {
  id: string;
  chunks: string[];
}

abstract class Builder<T = unknown> {
  public abstract fetch(options: FetchOptions): AsyncGenerator<T[], void>;
  public abstract process(item: T): BuilderDocument;
}

export { Builder, type FetchOptions, type BuilderDocument };
