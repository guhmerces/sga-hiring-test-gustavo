Feature: Update Tutorial
  Background: given a existing Tutorial
    Given tutorial data
      | title                    |
      | Tutorial 1 title example |
    When I send request to create a Tutorial
    Then I receive my Tutorial 1 ID
    And given another tutorial data
      | title                    |
      | Tutorial 2 title example |
    When I send request to create a Tutorial
    Then I receive my Tutorial 2 ID
  Scenario: I can not update a Tutorial with a title equals to a title of an existing Tutorial
    When I send request to update a Tutorial
      | title                    |
      | Tutorial 2 title example |
    Then I receive an error "Forbidden" with status code 403