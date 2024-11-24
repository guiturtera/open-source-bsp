
const WEBHOOK_VERIFY_TOKEN = process.env.WEBHOOK_VERIFY_TOKEN;

export const getWebhook = async (event) => {
  const mode = event.queryStringParameters["hub.mode"];
  const token = event.queryStringParameters["hub.verify_token"];
  const challenge = event.queryStringParameters["hub.challenge"];

  console.log(mode)
  console.log(token)
  console.log(WEBHOOK_VERIFY_TOKEN)
  // check the mode and token sent are correct
  if (mode === "subscribe" && token === WEBHOOK_VERIFY_TOKEN) {
    return {
        statusCode: 200,
        body: challenge
    }
  } else {
    return {
        statusCode: 403
    }
  }
}