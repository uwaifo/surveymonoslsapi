var aws = require("aws-sdk");

var ses = new aws.SES();

async function confirmationEmail(event, context, callback) {
  console.log(event);

  if (event.request.userAttributes.email) {
    sendEmail(
      event.request.userAttributes.email,
      "Congratulations " + event.userName + ", you have been confirmed: ",
      function(status) {
        // Return to Amazon Cognito
        callback(null, event);
      }
    );
  } else {
    // Nothing to do, the user's email ID is unknown
    callback(null, event);
  }
}

export const handler = confirmationEmail;

////////
function sendEmail(to, body, completedCallback) {
  var eParams = {
    Destination: {
      ToAddresses: [to],
    },
    Message: {
      Body: {
        Text: {
          Data: body,
        },
      },
      Subject: {
        Data: "Cognito Identity Provider registration completed",
      },
    },

    // Replace source_email with your SES validated email address
    Source: "<source_email>",
  };

  var email = ses.sendEmail(eParams, function(err, data) {
    if (err) {
      console.log(err);
    } else {
      console.log("===EMAIL SENT===");
    }
    completedCallback("Email sent");
  });
  console.log("EMAIL CODE END");
}

//https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-lambda-post-authentication.html
/*
confirmationEmail:
    handler: src/handlers/users/confirmationEmail.handler
    events:
      - cognitoUserPool:
        pool: ircocom60e2ad3e_userpool_60e2ad3e
        trigger: PostConfirmation
*/
