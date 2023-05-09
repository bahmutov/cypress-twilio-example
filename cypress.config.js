// @ts-check
import { defineConfig } from 'cypress'

import {
  getTwilioInfo,
  getTwilioSms,
  retryTwilioSms,
} from './cypress/twilio/check-sms.mjs'

export default defineConfig({
  e2e: {
    // baseUrl, etc
    supportFile: false,
    fixturesFolder: false,
    setupNodeEvents(on, config) {
      // make sure we have Twilio account values
      getTwilioInfo()

      on('task', {
        getTwilioSms, // no retries
        retryTwilioSms, // with retries
      })
    },
  },
})
