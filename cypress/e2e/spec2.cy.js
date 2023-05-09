/// <reference types="cypress" />

it('retrieves the last SMS using retryTwilioSms', () => {
  cy.log('Checking SMS')
  cy.task('retryTwilioSms', {
    timeout: 60_000, // let the task run up to 1 minute
  })
    // recurse yields the result of the command
    // which in our case is the result from the task
    // confirm the SMS text follows the expected format
    .should('match', /Hello \d{4}/)
    // extract the code from the string
    .invoke('match', /Hello (?<code>\d{4})/)
    .its('groups.code')
    .should('be.a', 'string')
})
