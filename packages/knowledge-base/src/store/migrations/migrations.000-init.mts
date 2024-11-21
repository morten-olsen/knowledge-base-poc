import { Knex } from "knex";

const up = async (knex: Knex) => {
  await knex.schema.createTable('documents', (table) => {
    table.string('chunkId').primary();
    table.string('documentId').notNullable();
    table.specificType('embeddings', 'vector(1024)');
    table.string('body').notNullable();

    table.index(['documentId']);
    // table.index(knex.raw([`USING hnsw (vec vector_l2_ops)`]))
  })
}

const down = async (knex: Knex) => {
  await knex.schema.dropTable('documents');
}

const name = 'init';

export { up, down, name }
