import { PGlite } from '@electric-sql/pglite'
import { pipeline, env, FeatureExtractionPipeline } from '@huggingface/transformers';
import { vector } from "@electric-sql/pglite/vector";
import ClientPgLite from 'knex-pglite'
import { Builder } from '../builder/builder.mjs'
import knex, { Knex } from 'knex';
import { migrationSource } from './migrations/migrations.mjs';
import { nanoid } from 'nanoid';
import { toSql } from 'pgvector';

env.useBrowserCache = false;

type StoreOptions<T> = {
  builder: Builder<T>;
  location?: string;
}

type SearchOptions = {
  prompt: string;
  limit?: number;
}

type SearchResult = {
  documentId: string;
  chunkId: string;
  body: string;
  distance: number;
}

class Store<T> {
  #options: StoreOptions<T>;

  constructor(options: StoreOptions<T>) {
    this.#options = options;
  }

  #dbPromise?: Promise<Knex>;
  #extratorPromise?: Promise<FeatureExtractionPipeline>;

  #setupDb = async () => {
    const { location } = this.#options;
    const pglite = new PGlite({
      dataDir: location,
      extensions: {
        vector
      },
    });
    const db = knex({
      client: ClientPgLite as any,
      dialect: 'postgres',
      connection: { pglite } as any,
      migrations: {
        migrationSource,
      },
    });

    await db.raw(`CREATE EXTENSION IF NOT EXISTS vector;`)

    const migrations = await migrationSource.getMigrations([]);
    for (const migration of migrations) {
      await migration.up(db);
    }

    return db;
  }

  #setupExctractor = async () => {
    const extractor = await pipeline('feature-extraction', 'mixedbread-ai/mxbai-embed-large-v1', {
      dtype: 'q8',
    });
    return extractor;
  }


  #getExtractor = async () => {
    if (!this.#extratorPromise) {
      this.#extratorPromise = this.#setupExctractor();
    }
    return this.#extratorPromise;
  }

  #getDb = async () => {
    if (!this.#dbPromise) {
      this.#dbPromise = this.#setupDb();
    }
    return this.#dbPromise;
  }

  #extract = async (input: string[]) => {
    const extractor = await this.#getExtractor();
    const output = await extractor(input, { pooling: 'cls' });
    return output.tolist();
  }

  public insert = async (items: T[]) => {
    const db = await this.#getDb();
    const { builder } = this.#options;
    for (const item of items) {
      const document = builder.process(item);
      const vectors = await this.#extract(document.chunks);
      await db.transaction(async (trx) => {
        await trx('documents').delete().where({
          documentId: document.id,
        });
        await trx('documents').insert(
          document.chunks.map((chunk, i) => ({
            chunkId: nanoid(),
            documentId: document.id,
            body: chunk,
            embeddings: toSql(vectors[i]),
          }))
        )
      });
    }
  }

  public remove = async (documentIds: string[]) => {
    const db = await this.#getDb();
    await db('documents').delete().whereIn('documentId', documentIds);
  }

  public update = async () => {
    const { builder } = this.#options;
    for await (const items of builder.fetch({
      count: 1,
    })) {
      await this.insert(items);
    }
  }

  public search = async ({ prompt, limit }: SearchOptions): Promise<SearchResult[]> => {
    const db = await this.#getDb();
    const [vector] = await this.#extract([prompt]);
    const sqlVector = toSql(vector);
    let query = db('documents')
      .select([
        'documents.*',
        db.raw(`embeddings <-> '${sqlVector}' AS distance`),
      ])
      .orderByRaw(`embeddings <-> '${sqlVector}'`);
    if (limit) {
      query = query.limit(limit);
    }
    const results = await query;
    return results.map((item) => ({
      ...item,
      embeddings: undefined,
    }));
  }

  public close = async () => {
    if (!this.#dbPromise) {
      return;
    }

    const db = await this.#dbPromise;
    await db.destroy();
  }

  public getDocuments = async () => {
    const db = await this.#getDb();
    return await db('documents');
  }
}

export { Store, type SearchResult };
