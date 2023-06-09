/// <reference types="cypress" />

import { recurse } from 'cypress-recurse'

it('retrieves the last SMS', () => {
  cy.log('Checking SMS')
  // call the first function that calls cy.task
  // until the second predicate function returns true
  recurse(() => cy.task('getTwilioSms'), Cypress._.isString, {
    log: false, // no need to log every iteration
    timeout: 60_000, // retry for up to 1 minute
    delay: 5_000, // wait 5 seconds between the tries
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
