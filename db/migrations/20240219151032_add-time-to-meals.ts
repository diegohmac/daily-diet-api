import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.table('meals', (table) => {
    table.string('time').notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.table('meals', (table) => {
    table.dropColumn('time');
  });
}
