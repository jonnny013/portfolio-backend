const migrationsConfig = {
  migrationStorage: 'sequelize',
  migrationStorageTableName: 'migrations',
}

export default {
  development: {
    username: Deno.env.get('DB_USER'),
    password: Deno.env.get('DB_PASS'),
    database: Deno.env.get('DB_NAME'),
    host: Deno.env.get('DB_HOST'),
    port: Deno.env.get('DB_PORT'),
    dialect: 'postgres',
    url: Deno.env.get('DATABASE_URL'),
    ...migrationsConfig,
  },
  production: {
    username: Deno.env.get('DB_USER'),
    password: Deno.env.get('DB_PASS'),
    database: Deno.env.get('DB_NAME'),
    host: Deno.env.get('DB_HOST'),
    port: Deno.env.get('DB_PORT'),
    dialect: 'postgres',
    db_url: Deno.env.get('DATABASE_URL'),
    ...migrationsConfig,
  },
  test: {
    username: Deno.env.get('DB_USER'),
    password: Deno.env.get('DB_PASS'),
    database: Deno.env.get('DB_NAME'),
    host: Deno.env.get('DB_HOST'),
    port: Deno.env.get('DB_PORT'),
    dialect: 'postgres',
    url: Deno.env.get('DATABASE_URL'),
    ...migrationsConfig,
  },
}
