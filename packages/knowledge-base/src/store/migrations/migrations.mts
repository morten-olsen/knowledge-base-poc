import { Knex } from 'knex';
import * as init from './migrations.000-init.mjs'

const migrations = [
  init,
];

const migrationSource: Knex.MigrationSource<typeof migrations[number]> = {
  getMigrations: async () => migrations,
  getMigration: async migration => migration,
  getMigrationName: (migration) => migration.name,
}

export { migrationSource };
