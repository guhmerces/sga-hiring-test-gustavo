import { defineFeature, loadFeature } from "jest-cucumber";
import { Kysely, sql } from "kysely";
import { Database } from "src/boot/db";
import { getConnectionPool } from "tests/setup/jestSetup";
import { TestContext } from "tests/test-utils/TestContext";
import { ApiClient } from "tests/test-utils/ApiClient";
import { givenUserProfileData, iReceiveAnErrorWithStatusCode, iSendRequestToCreateAnUser, SignupUserTestContext } from "tests/steps";

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
    const signupUserCtx = new TestContext<SignupUserTestContext>();

    givenUserProfileData(given, signupUserCtx);

    iSendRequestToCreateAnUser(when, signupUserCtx);

    then('I receive my user ID', () => {
      const response = signupUserCtx.latestResponse;
      expect(typeof response).toBe('string');
    })
  });
})
