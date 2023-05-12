const Alexa = require("ask-sdk-core");

const binType = {
  PaperAndCard: "PaperAndCard",
  RubbishAndRecycling: "RubbishAndRecycling",
};

const getBinsText = (binType) => {
  switch (binType) {
    case "PaperAndCard":
      return "food and paper";
    case "RubbishAndRecycling":
      return "food, recycling, garden waste and general rubbish";
    default:
      return;
  }
};

const binsTimetable = [
  { date: new Date("May 12, 2023 06:00:00"), bin: binType.RubbishAndRecycling },
  { date: new Date("May 19, 2023 06:00:00"), bin: binType.PaperAndCard },
  { date: new Date("May 26, 2023 06:00:00"), bin: binType.RubbishAndRecycling },
  { date: new Date("June 02, 2023 06:00:00"), bin: binType.PaperAndCard },
  {
    date: new Date("June 09, 2023 06:00:00"),
    bin: binType.RubbishAndRecycling,
  },
  { date: new Date("June 16, 2023 06:00:00"), bin: binType.PaperAndCard },
  {
    date: new Date("June 23, 2023 06:00:00"),
    bin: binType.RubbishAndRecycling,
  },
  { date: new Date("June 30, 2023 06:00:00"), bin: binType.PaperAndCard },
  {
    date: new Date("July 07, 2023 06:00:00"),
    bin: binType.RubbishAndRecycling,
  },
  { date: new Date("July 14, 2023 06:00:00"), bin: binType.PaperAndCard },
  {
    date: new Date("July 21, 2023 06:00:00"),
    bin: binType.RubbishAndRecycling,
  },
  { date: new Date("July 28, 2023 06:00:00"), bin: binType.PaperAndCard },
  {
    date: new Date("August 04, 2023 06:00:00"),
    bin: binType.RubbishAndRecycling,
  },
  { date: new Date("August 11, 2023 06:00:00"), bin: binType.PaperAndCard },
  {
    date: new Date("August 18, 2023 06:00:00"),
    bin: binType.RubbishAndRecycling,
  },
  { date: new Date("August 25, 2023 06:00:00"), bin: binType.PaperAndCard },
  {
    date: new Date("September 01, 2023 06:00:00"),
    bin: binType.RubbishAndRecycling,
  },
  { date: new Date("September 08, 2023 06:00:00"), bin: binType.PaperAndCard },
  {
    date: new Date("September 15, 2023 06:00:00"),
    bin: binType.RubbishAndRecycling,
  },
  { date: new Date("September 22, 2023 06:00:00"), bin: binType.PaperAndCard },
  {
    date: new Date("September 29, 2023 06:00:00"),
    bin: binType.RubbishAndRecycling,
  },
  { date: new Date("October 06, 2023 06:00:00"), bin: binType.PaperAndCard },
  {
    date: new Date("October 13, 2023 06:00:00"),
    bin: binType.RubbishAndRecycling,
  },
  { date: new Date("October 20, 2023 06:00:00"), bin: binType.PaperAndCard },
  {
    date: new Date("October 27, 2023 06:00:00"),
    bin: binType.RubbishAndRecycling,
  },
  { date: new Date("November 03, 2023 06:00:00"), bin: binType.PaperAndCard },
  {
    date: new Date("November 10, 2023 06:00:00"),
    bin: binType.RubbishAndRecycling,
  },
  { date: new Date("November 17, 2023 06:00:00"), bin: binType.PaperAndCard },
  {
    date: new Date("November 24, 2023 06:00:00"),
    bin: binType.RubbishAndRecycling,
  },
];

const getBinDay = (index = 0) => {
  const today = Date.now();
  if (index === binsTimetable.length) {
    return null;
  }

  if (
    binsTimetable[index + 1] &&
    today > binsTimetable[index].date &&
    today < binsTimetable[index + 1].date
  ) {
    return binsTimetable[index + 1];
  }
  return getBinDay(index + 1);
};

const binDay = getBinDay();

const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === "LaunchRequest";
  },
  handle(handlerInput) {
    const speakOutput = `Welcome to the bin bot, your next collection of ${getBinsText(
      binDay.bin
    )} is on ${binDay.date.toString()}`;
    return handlerInput.responseBuilder.speak(speakOutput).getResponse();
  },
};

const BinsHandler = {
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

const ChristmasHandler = {
  canHandle(handlerInput) {
    return (
      handlerInput.requestEnvelope.request.type === "IntentRequest" &&
      handlerInput.requestEnvelope.request.intent.name === "BinsIntent"
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
    BinsHandler,
    CancelAndStopHandler,
    SessionEndedRequestHandler
  )
  .addErrorHandlers(ErrorHandler)
  .lambda();
