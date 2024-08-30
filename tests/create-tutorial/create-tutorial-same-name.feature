Feature: Create Tutorial
  Background: given a existing Tutorial
    Given tutorial data
      | title                  |
      | Tutorial title example |
    When I send request to create a Tutorial
    Then I receive my tutorial ID
  Scenario: I can not create a Tutorial with title equals to an existing Tutorial's title
    Given tutorial data
      | title                  |
      | Tutorial title example |
    When I send request to create a Tutorial
    Then I receive an error "Forbidden" with status code 403

