let poolData: any;

if (process.env.NODE_ENV === 'development') {
  poolData = {
    host: process.env.TEST_DB_HOST,
    user: process.env.TEST_DB_USER,
    password: process.env.TEST_DB_PASSWORD,
    database: process.env.TEST_DB_DATABASE,
    port: process.env.TEST_DB_PORT,
    connectionLimit: process.env.TEST_DB_CONNECTIONLIMIT,
  }
} else {
  poolData = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT,
    connectionLimit: process.env.DB_CONNECTIONLIMIT,
  }
}

export { poolData };
