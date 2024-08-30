Feature: User Signup with registered email
  Background: Existing user account with email jonhdoe@email.com
    Given user profile data
      | password | passwordConfirmation | name     | email             |
      | 12345678 | 12345678             | Jonh Doe | jonhdoe@email.com |
    When I send request to create an User
    Then I receive my user ID
  Scenario: user cant signup with a already registered email
    Given user profile data
      | password        | passwordConfirmation | name      | email             |
      | anotherpassword | anotherpassword      | Alice Doe | jonhdoe@email.com |
    When I send request to create an User
    Then I receive an error "Forbidden" with status code 403



