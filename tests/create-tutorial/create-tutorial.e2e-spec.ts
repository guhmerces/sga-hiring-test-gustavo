import { defineFeature, loadFeature } from "jest-cucumber";
import { Kysely, sql } from "kysely";
import { Database } from "src/boot/db";
import { getConnectionPool } from "tests/setup/jestSetup";
import { TestContext } from "tests/test-utils/TestContext";
import { ApiClient } from "tests/test-utils/ApiClient";
import { CreateTutorialTestContext, givenTutorialData, iSendRequestToCreateATutorial } from "tests/steps";

const feature = loadFeature('tests/create-tutorial/create-tutorial.feature');

defineFeature(feature, (test) => {
  let pool: Kysely<Database>;
  let apiClient: ApiClient

  beforeAll(() => {
    pool = getConnectionPool();
    apiClient = new ApiClient()
  });

  beforeEach(async () => {
    const truncateStatement = sql`
      TRUNCATE "tutorials";
    `;
    await pool.executeQuery(truncateStatement.compile(pool));
  });

  test('can create a tutorial', ({ given, when, then, and }) => {
    const createTutorialCtx = new TestContext<CreateTutorialTestContext>();

    givenTutorialData(given, createTutorialCtx);

    iSendRequestToCreateATutorial(when, createTutorialCtx);

    then('I receive my tutorial ID', () => {
      const response = createTutorialCtx.latestResponse;
      expect(typeof response).toBe('string');
      // check if is uuid
      expect((response as string).length).toBe(36);
    })
  });
})
