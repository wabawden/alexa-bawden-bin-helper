const Alexa = require("ask-sdk-core");

const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === "LaunchRequest";
  },
  handle(handlerInput) {
    const today = Date.now();
    const bins =
      (today < new Date("October 15, 2021 06:00:00") &&
        today > new Date("October 08, 2021 06:00:00")) ||
      (today < new Date("October 29, 2021 06:00:00") &&
        today > new Date("October 22, 2021 06:00:00")) ||
      (today < new Date("November 12, 2021 06:00:00") &&
        today > new Date("November 05, 2021 06:00:00")) ||
      (today < new Date("Novembe r26, 2021 06:00:00") &&
        today > new Date("November 19, 2021 06:00:00"))
        ? "food, recycling and general rubbish"
        : "food and paper";

    const speakOutput =
      "Welcome to the bin bot, this friday it is " + bins + " collection.";
    return handlerInput.responseBuilder.speak(speakOutput).getResponse();
  },
};

const ChristmasHandler = {
  canHandle(handlerInput) {
    return (
      handlerInput.requestEnvelope.request.type === "IntentRequest" &&
      handlerInput.requestEnvelope.request.intent.name === "ChristmasIntent"
    );
  },
  handle(handlerInput) {
    const speakOutput =
      "The Christmas Timetable is not available yet, please check later. Jingle Bells!";

    return handlerInput.responseBuilder.speak(speakOutput).getResponse();
  },
};

const ShoppingHandler = {
  canHandle(handlerInput) {
    return (
      handlerInput.requestEnvelope.request.type === "LaunchRequest" ||
      (handlerInput.requestEnvelope.request.type === "IntentRequest" &&
        handlerInput.requestEnvelope.request.intent.name === "ShoppingIntent")
    );
  },
  async handle(handlerInput) {
    let outputSpeech = "This is the default message.";

    await getRemoteData(
      "https://bawden-shopping-list.herokuapp.com/api/v1/items.json"
    )
      .then((response) => {
        const data = JSON.parse(response);
        outputSpeech = `There are currently ${data.length} items on your shopping list. `;
        for (let i = 0; i < data.length; i += 1) {
          if (i === 0) {
            // first record
            outputSpeech = `${outputSpeech}The items are: ${data[i].name}, `;
          } else if (i === data.length - 1) {
            // last record
            outputSpeech = `${outputSpeech}and ${data[i].name}.`;
          } else {
            // middle record(s)
            outputSpeech = `${outputSpeech + data[i].name}, `;
          }
        }
      })
      .catch((err) => {
        console.log(`ERROR: ${err.message}`);
        // set an optional error message here
        // outputSpeech = err.message;
      });

    return handlerInput.responseBuilder.speak(outputSpeech).getResponse();
  },
};

const RecipeHandler = {
  canHandle(handlerInput) {
    return (
      handlerInput.requestEnvelope.request.type === "LaunchRequest" ||
      (handlerInput.requestEnvelope.request.type === "IntentRequest" &&
        handlerInput.requestEnvelope.request.intent.name === "RecipeIntent")
    );
  },
  async handle(handlerInput) {
    let outputSpeech = "This is the default message.";

    await getRemoteData(
      "https://bawden-shopping-list.herokuapp.com/api/v1/recipes.json"
    )
      .then((response) => {
        const data = JSON.parse(response);
        outputSpeech = `There are currently ${data.length} meals in your shopping list. `;
        for (let i = 0; i < data.length; i += 1) {
          if (i === 0) {
            // first record
            outputSpeech = `${outputSpeech}The meals are: ${data[i].name}, `;
          } else if (i === data.length - 1) {
            // last record
            outputSpeech = `${outputSpeech}and ${data[i].name}.`;
          } else {
            // middle record(s)
            outputSpeech = `${outputSpeech + data[i].name}, `;
          }
        }
      })
      .catch((err) => {
        console.log(`ERROR: ${err.message}`);
        // set an optional error message here
        // outputSpeech = err.message;
      });

    return handlerInput.responseBuilder.speak(outputSpeech).getResponse();
  },
};
const HelpHandler = {
  canHandle(handlerInput) {
    return (
      handlerInput.requestEnvelope.request.type === "IntentRequest" &&
      handlerInput.requestEnvelope.request.intent.name === "AMAZON.HelpIntent"
    );
  },
  handle(handlerInput) {
    const speakOutput = "I tell you what bins go out each week";

    return handlerInput.responseBuilder.speak(speakOutput).getResponse();
  },
};

const CancelAndStopHandler = {
  canHandle(handlerInput) {
    return (
      handlerInput.requestEnvelope.request.type === "IntentRequest" &&
      (handlerInput.requestEnvelope.request.intent.name ===
        "AMAZON.CancelIntent" ||
        handlerInput.requestEnvelope.request.intent.name ===
          "AMAZON.StopIntent")
    );
  },
  handle(handlerInput) {
    const speakOutput = "Goodbye!";

    return handlerInput.responseBuilder.speak(speakOutput).getResponse();
  },
};

const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === "SessionEndedRequest";
  },
  handle(handlerInput) {
    console.log(
      `Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`
    );

    return handlerInput.responseBuilder.getResponse();
  },
};

const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.log(`Error handled: ${error.message}`);
    console.log(error.trace);

    return handlerInput.responseBuilder
      .speak("Sorry, I can't understand the command. Please say again.")
      .getResponse();
  },
};

const getRemoteData = (url) =>
  new Promise((resolve, reject) => {
    const client = url.startsWith("https") ? require("https") : require("http");
    const request = client.get(url, (response) => {
      if (response.statusCode < 200 || response.statusCode > 299) {
        reject(new Error(`Failed with status code: ${response.statusCode}`));
      }
      const body = [];
      response.on("data", (chunk) => body.push(chunk));
      response.on("end", () => resolve(body.join("")));
    });
    request.on("error", (err) => reject(err));
  });

const skillBuilder = Alexa.SkillBuilders.custom();

exports.handler = skillBuilder
  .addRequestHandlers(
    LaunchRequestHandler,
    ChristmasHandler,
    ShoppingHandler,
    RecipeHandler,
    HelpHandler,
    CancelAndStopHandler,
    SessionEndedRequestHandler
  )
  .addErrorHandlers(ErrorHandler)
  .lambda();
