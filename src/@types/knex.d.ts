import { Knex } from 'knex';

declare module 'knex/types/tables' {
  export interface Tables {
    users: {
      id: string;
      name: string;
    };
    meals: {
      id: string;
      name: string;
      description: string;
      created_at: string;
      offDiet: boolean;
      userId: string;
    };
  }
}
