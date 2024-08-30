Feature: Update Tutorial
  Background: given a existing Tutorial
    Given tutorial data
      | title                  |
      | Tutorial title example |
    When I send request to create a Tutorial
    Then I receive my tutorial ID
  Scenario: I can update a Tutorial
    When I send request to update a Tutorial
      | title                               |
      | Tutorial example with another title |
    Then I can see with changes took place
  Scenario: I can not update a Tutorial with a title greater than 255 characters
    When I send request to update a Tutorial
      | title                                                                                                                                                                                                                                                                                                                                      |
      | Changed title greater than 255 characters testTesttestTesttestTesttestTesttestTesttestTesttestTesttestTesttestTesttestTesttestTesttestTesttestTesttestTesttestTesttestTesttestTesttestTesttestTesttestTesttestTesttestTesttestTesttestTesttestTesttestTesttestTesttestTesttestTesttestTesttestTesttestTesttestTesttestTesttestTesttestTest |
    Then I receive an error "Unprocessable Entity" with status code 422
