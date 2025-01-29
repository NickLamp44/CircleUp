Feature: Specify Number of Events

  Scenario: Default number of events is 32
    Given the user has opened the app
    Then the number of events displayed should be 32

  Scenario: User can change the number of events
    Given the user has opened the app
    When the user sets the number of events to 10
    Then 10 events should be displayed

    