const stripe = require("stripe")("sk_test_51HmJpYGYDDccV3BZiRXZWbD1sjhX3dUbdH05epGo5lYDe9tupDEhN4uY5R8OLGRpbPhflO2Q7H06A0Vcs4yf1QNn005Zgrgg3e");

exports.handler = (event, context, callback) => {
  // Only allow POST
  if (event.httpMethod !== "POST") {
    return callback(null, { statusCode: 405, body: "Action non authorisée." });
  }

  const data = JSON.parse(event.body);

  if (!data.token || parseInt(data.amount) < 1) {
    return callback(null, {
      statusCode: 400,
      body: JSON.stringify({
        message: "Il manque des informations pour effectuer le paiement."
      })
    });
  }

  stripe.charges
    .create({
      amount: parseInt(data.amount),
      currency: "eur",
      description: "Le Bouquin Mordu",
      source: data.token
    })
    .then(({ status }) => {
      return callback(null, {
        statusCode: 200,
        body: JSON.stringify({ status })
      });
    })
    .catch(err => {
      return callback(null, {
        statusCode: 400,
        body: JSON.stringify({
          message: `Error: ${err.message}`
        })
      });
    });
};
