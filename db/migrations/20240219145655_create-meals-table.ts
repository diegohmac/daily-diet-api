import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('meals', (table) => {
    table.uuid('id').primary();
    table.string('name').notNullable();
    table.string('description').nullable();
    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable();
    table.boolean('offDiet').notNullable();
    table.uuid('userId').notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('meals');
}
