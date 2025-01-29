Feature: Show/Hide Event Details

  Scenario: An event element is collapsed by default
    Given the user has opened the app
    Then the event details should be hidden

  Scenario: User can expand event details
    Given the user has opened the app
    When the user clicks the "Show Details" button
    Then the event details should be visible

  Scenario: User can collapse event details
    Given the event details are visible
    When the user clicks the "Hide Details" button
    Then the event details should be hidden

    