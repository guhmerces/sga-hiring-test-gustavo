require('dotenv').config({ path: '.env' })

module.exports = async (): Promise<void> => {
  //@ts-ignore
  if (!process.env.TEST_DB_DATABASE.includes('test')) {
    throw new Error(
      `Current database name is: ${process.env.TEST_DB_DATABASE}. Make sure database includes a word "test" as prefix or suffix, for example: "test_db" or "db_test" to avoid writing into a main database.`,
    );
  }
};
