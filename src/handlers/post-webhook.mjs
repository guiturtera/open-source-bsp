import axios from "axios";

const token = process.env.GRAPH_API_TOKEN;

export const postWebhook = async (event) => {
  console.log("Raw event:", JSON.stringify(event, null, 2));

  let body;
  try {
    body = JSON.parse(event.body);
  } catch (err) {
    console.error("Failed to parse event.body:", err);
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Invalid JSON body" }),
    };
  }

  console.log("Parsed body:", JSON.stringify(body, null, 2));

  const message = body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
  console.log("Extracted message:", message);

  if (message?.type === "text") {
    const business_phone_number_id =
      body.entry?.[0]?.changes?.[0]?.value?.metadata?.phone_number_id;

    console.log("Business phone number ID:", business_phone_number_id);

    try {
      await axios({
        method: "POST",
        url: `https://graph.facebook.com/v18.0/${business_phone_number_id}/messages`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: {
          messaging_product: "whatsapp",
          to: message.from,
          text: { body: "Echo: " + message.text.body },
          context: {
            message_id: message.id,
          },
        },
      });
      console.log("Message sent successfully");
    } catch (err) {
      console.error("Error sending message:", err);
    }

    // Mark message as read
    try {
      await axios({
        method: "POST",
        url: `https://graph.facebook.com/v18.0/${business_phone_number_id}/messages`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: {
          messaging_product: "whatsapp",
          status: "read",
          message_id: message.id,
        },
      });
      console.log("Message marked as read");
    } catch (err) {
      console.error("Error marking message as read:", err);
    }
  } else {
    console.log("No valid text message found in the webhook payload");
  }

  return {
    statusCode: 202,
    body: JSON.stringify({ message: "Webhook handled" }),
  };
};
