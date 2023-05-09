import twilio from 'twilio'
import { DateTime } from 'luxon'
import { retry } from 'cypress-recurse/src/retry.js'

export function getTwilioInfo() {
  // load up twilio info
  const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID
  if (!TWILIO_ACCOUNT_SID) {
    throw new Error('TWILIO_ACCOUNT_SID is not defined')
  }
  const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN
  if (!TWILIO_AUTH_TOKEN) {
    throw new Error('TWILIO_AUTH_TOKEN is not defined')
  }

  const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER
  if (!TWILIO_PHONE_NUMBER) {
    throw new Error('TWILIO_PHONE_NUMBER is not defined')
  }
  return { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER }
}

export async function getTwilioSms() {
  const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER } =
    getTwilioInfo()
  const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)

  // retrieve one message sent in the last minute
  const now = DateTime.now()
  const prev = now.minus({ minutes: 1 })
  const messages = await client.messages.list({
    to: TWILIO_PHONE_NUMBER,
    limit: 1,
    dateSent: prev.toJSDate(),
  })
  // assume there is at least one message
  return messages[0]?.body || null
}

export async function retryTwilioSms() {
  const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER } =
    getTwilioInfo()
  const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)

  // retrieve one message sent in the last minute
  const now = DateTime.now()
  const prev = now.minus({ minutes: 1 }).toJSDate()

  // the result we will return after retries
  let lastMessage

  await retry(
    // the first argument is a function to retry
    // in our case it yields the list of messages
    () =>
      client.messages.list({
        to: TWILIO_PHONE_NUMBER,
        limit: 1,
        dateSent: prev,
      }),
    // the second function is the predicate
    // checking the value resolved by the first function
    (messages) => {
      if (!messages.length) {
        // retry again
        return false
      }
      // success!
      lastMessage = messages[0].body
      return true
    },
    // retrying options
    {
      limit: 20, // retry 20 times
      delay: 5_000, // with 5 second pauses between attempts
      log: true, // log basic info about each attempt
    },
  )

  return lastMessage
}
