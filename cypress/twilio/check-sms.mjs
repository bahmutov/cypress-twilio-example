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

export async function getTwilioSms() {}
