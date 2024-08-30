import { defineFeature, loadFeature } from "jest-cucumber";
import { Kysely, sql } from "kysely";
import { Database, db } from "src/boot/db";
import { getConnectionPool } from "tests/setup/jestSetup";
import { TestContext } from "tests/test-utils/TestContext";
import { ApiClient } from "tests/test-utils/ApiClient";
import { CreateTutorialTestContext, givenTutorialData, iReceiveAnErrorWithStatusCode, iSendRequestToCreateATutorial, iSendRequestToUpdateATutorial, UpdateTutorialTestContext } from "tests/steps";

const feature = loadFeature('tests/update-tutorial/update-tutorial.feature');

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

  test("I can update a Tutorial", ({ given, when, then, and }) => {
    const createTutorialCtx = new TestContext<CreateTutorialTestContext>();
    const updateTutorialCtx = new TestContext<UpdateTutorialTestContext>();

    givenTutorialData(given, createTutorialCtx);

    iSendRequestToCreateATutorial(when, createTutorialCtx);

    then('I receive my tutorial ID', () => {
      const response = createTutorialCtx.latestResponse;
      expect(typeof response).toBe('string');
      // check if is uuid
      expect((response as string).length).toBe(36);
    })

    iSendRequestToUpdateATutorial(when, updateTutorialCtx, createTutorialCtx)

    then('I can see with changes took place', async () => {
      const updatedTutorial = await db
        .selectFrom('tutorials')
        .select(['title'])
        .where('id', '=', createTutorialCtx.latestResponse as string)
        .executeTakeFirstOrThrow()

      const newTitle = updatedTutorial.title
      const oldTitle = createTutorialCtx.context.createTutorialDto.title

      expect(typeof newTitle).toBe('string')
      expect(typeof oldTitle).toBe('string')

      expect(
        newTitle === oldTitle
      ).toBeFalsy()
    })

  });

  test("I can not update a Tutorial with a title greater than 255 characters", ({ given, when, then, and }) => {
    const createTutorialCtx = new TestContext<CreateTutorialTestContext>();
    const updateTutorialCtx = new TestContext<UpdateTutorialTestContext>();

    givenTutorialData(given, createTutorialCtx);

    iSendRequestToCreateATutorial(when, createTutorialCtx);

    then('I receive my tutorial ID', () => {
      const response = createTutorialCtx.latestResponse;
      expect(typeof response).toBe('string');
      // check if is uuid
      expect((response as string).length).toBe(36);
    })

    iSendRequestToUpdateATutorial(when, updateTutorialCtx, createTutorialCtx)

    iReceiveAnErrorWithStatusCode(then, updateTutorialCtx)

  });
})
