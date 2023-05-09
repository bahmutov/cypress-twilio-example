import { retryTwilioSms } from './check-sms.mjs'

retryTwilioSms()
  .then((messages) => {
    console.log(messages)
  })
  .catch((err) => {
    console.error(err)
  })
