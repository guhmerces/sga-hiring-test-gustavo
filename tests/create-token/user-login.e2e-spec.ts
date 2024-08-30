import { defineFeature, loadFeature } from "jest-cucumber";
import { Kysely, sql } from "kysely";
import { Database } from "src/boot/db";
import { getConnectionPool } from "tests/setup/jestSetup";
import { TestContext } from "tests/test-utils/TestContext";
import { ApiClient } from "tests/test-utils/ApiClient";
import jose from 'node-jose';
import keyset from '../../jwk.json'
import { givenUserLoginData, givenUserProfileData, iReceiveAnErrorWithStatusCode, iSendRequestToCreateAnUser, iSendRequestToGetAnAuthToken, SignupUserTestContext, UserLoginTestContext } from "tests/steps";

const feature = loadFeature('tests/create-token/user-login.feature');

defineFeature(feature, (test) => {
  let pool: Kysely<Database>;
  let apiClient: ApiClient

  beforeAll(() => {
    pool = getConnectionPool();
    apiClient = new ApiClient()
  });

  beforeEach(async () => {
    const truncateStatement = sql`
      TRUNCATE "users";
    `;
    await pool.executeQuery(truncateStatement.compile(pool));
  });

  test('can generate a auth token', ({ given, when, then, and }) => {
    const signupUserCtx = new TestContext<SignupUserTestContext>();
    const userLoginCtx = new TestContext<UserLoginTestContext>();

    givenUserProfileData(given, signupUserCtx);

    iSendRequestToCreateAnUser(when, signupUserCtx);

    then('I receive my user ID', () => {
      const response = signupUserCtx.latestResponse;
      expect(typeof response).toBe('string');
    });

    givenUserLoginData(given, userLoginCtx);

    iSendRequestToGetAnAuthToken(when, userLoginCtx);

    then('I receive a jwt token', async () => {
      const response = userLoginCtx.latestResponse;
      const token = response;
      expect(typeof response).toBe('string');

      // check it is a valid jwt
      const keystore = await jose.JWK.asKeyStore(keyset);
      await jose.JWS.createVerify(keystore).verify(token)

    })
  });

  test('cant generate a auth token if password is not correct', ({ given, when, then, and }) => {
    const signupUserCtx = new TestContext<SignupUserTestContext>();
    const userLoginCtx = new TestContext<UserLoginTestContext>();

    givenUserProfileData(given, signupUserCtx);

    iSendRequestToCreateAnUser(when, signupUserCtx);

    then('I receive my user ID', () => {
      const response = signupUserCtx.latestResponse;
      expect(typeof response).toBe('string');
    });

    givenUserLoginData(given, userLoginCtx);

    iSendRequestToGetAnAuthToken(when, userLoginCtx);

    iReceiveAnErrorWithStatusCode(then, userLoginCtx)
  })
})