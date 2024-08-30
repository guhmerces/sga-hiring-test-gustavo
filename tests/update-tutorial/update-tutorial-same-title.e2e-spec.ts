import { defineFeature, loadFeature } from "jest-cucumber";
import { Kysely, sql } from "kysely";
import { Database, db } from "src/boot/db";
import { getConnectionPool } from "tests/setup/jestSetup";
import { TestContext } from "tests/test-utils/TestContext";
import { ApiClient } from "tests/test-utils/ApiClient";
import { CreateTutorialTestContext, givenAnotherTutorialData, givenTutorialData, iReceiveAnErrorWithStatusCode, iSendRequestToCreateATutorial, iSendRequestToUpdateATutorial, UpdateTutorialTestContext } from "tests/steps";

const feature = loadFeature('tests/update-tutorial/update-tutorial-same-title.feature');

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

  test("I can not update a Tutorial with a title equals to a title of an existing Tutorial", ({ given, when, then, and }) => {
    const createFirstTutorialCtx = new TestContext<CreateTutorialTestContext>();
    const createSecondTutorialCtx = new TestContext<CreateTutorialTestContext>();
    const updateFirstTutorialCtx = new TestContext<UpdateTutorialTestContext>();

    givenTutorialData(given, createFirstTutorialCtx);

    iSendRequestToCreateATutorial(when, createFirstTutorialCtx);

    then('I receive my Tutorial 1 ID', () => {
      const response = createFirstTutorialCtx.latestResponse;
      expect(typeof response).toBe('string');
      // check if is uuid
      expect((response as string).length).toBe(36);
    })

    givenAnotherTutorialData(and, createSecondTutorialCtx);

    iSendRequestToCreateATutorial(when, createSecondTutorialCtx);

    then('I receive my Tutorial 2 ID', () => {
      const response = createSecondTutorialCtx.latestResponse;
      expect(typeof response).toBe('string');
      // check if is uuid
      expect((response as string).length).toBe(36);
    })

    iSendRequestToUpdateATutorial(when, updateFirstTutorialCtx, createFirstTutorialCtx)

    iReceiveAnErrorWithStatusCode(then, updateFirstTutorialCtx)
  });
})
