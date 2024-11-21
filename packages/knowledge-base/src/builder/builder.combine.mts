import { Builder, FetchOptions } from "./builder.mjs"

type CombineBuilderOptions<T extends Record<string, Builder>> = {
  builders: T;
}

type Item<T extends Record<string, Builder>, TKey extends keyof T> = {
  builder: T[TKey];
  item: T[TKey] extends Builder<infer U> ? U : never;
}

class CombineBuilder<T extends Record<string, Builder>> extends Builder<Item<T, keyof T>> {
  #options: CombineBuilderOptions<T>;

  constructor(options: CombineBuilderOptions<T>) {
    super();
    this.#options = options;
  }

  public process = ({ item, builder }: Item<T, keyof T>) => {
    return builder.process(item);
  }

  public async *fetch(options: FetchOptions) {
    const { builders } = this.#options;
    for (const [name, builder] of Object.entries(builders) as [keyof T, Builder<Item<T, keyof T>>][]) {
      for await (const items of builder.fetch(options)) {
        yield items.map((item) => ({
          item,
          builder: name,
        }) as unknown as Item<T, keyof T>);
      }
    }
  }
}

export { CombineBuilder };
