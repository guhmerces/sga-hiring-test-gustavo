Feature: User Signup
  Scenario: user signup
    Given user profile data
      | password | passwordConfirmation | name     | email             |
      | 12345678 | 12345678             | Jonh Doe | jonhdoe@email.com |
    When I send request to create an User
    Then I receive my user ID
