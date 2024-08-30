Feature: Create Tutorial
  Scenario: can create a tutorial
    Given tutorial data
      | title          |
      | Tutorial title example |
    When I send request to create a Tutorial
    Then I receive my tutorial ID
