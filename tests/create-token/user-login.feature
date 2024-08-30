Feature: User login
  Background: user login
    Given user profile data
      | password | passwordConfirmation | name     | email             |
      | 12345678 | 12345678             | Jonh Doe | jonhdoe@email.com |
    When I send request to create an User
    Then I receive my user ID
  Scenario: can generate a auth token
    Given user login data
      | password | email             |
      | 12345678 | jonhdoe@email.com |
    When I send request to get an auth token
    Then I receive a jwt token
  Scenario: cant generate a auth token if password is not correct
    Given user login data
      | password          | email             |
      | differentPassword | jonhdoe@email.com |
    When I send request to get an auth token
    Then I receive an error "Unauthorized" with status code 401
