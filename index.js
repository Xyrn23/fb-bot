const http = require("http");
const fs = require("fs");
const login = require("fb-chat-api-temp");
const API_KEY = "zu-2ff335cca13f867c11a93db2b15c19b9"; // Zuki API key

// HTTP server creation
http
  .createServer(function (req, res) {
    res.write("I'm still online!");
    res.end();
  })
  .listen(8080);

// Function to handle incoming messages
async function handleMessage(api, event) {
  // Log received message details
  console.log(
    `Received message\nuserID: ${event.senderID}\nthreadID: ${event.threadID}\nmessageID: ${event.messageID}\nmessageContents: ${event.body}\n- - - - -\n`
  );

  const message = event.body.toLowerCase();
  if (
    message.includes("who is your owner") ||
    message.includes("sino owner mo") ||
    message.includes("who made you") ||
    message.includes("who is your creator")
  ) {
    const ownerName = "Jersey Aaron Paul Reyes";
    const ownerProfileLink = "https://www.facebook.com/idkeitherhahaha";
    const response = `My owner is ${ownerName}. You can find more about him here: ${ownerProfileLink}`;
    api.sendMessage(response, event.threadID, (err, messageInfo) => {
      if (err) {
        console.error("Error while sending message:", err);
      } else {
        // Log sent message details
        console.log(
          `Sent message\nmessageID: ${messageInfo.messageID}\nmessageContents: ${response}\n- - - - -\n`
        );
      }
    });
  } else {
    // Handle other messages here
    // Check if the message starts with the prefix
    const prefix = "xi, ";
    const message = event.body.trim(); // Remove leading and trailing whitespaces
    if (!message.startsWith(prefix)) {
      // If the message doesn't start with the prefix, ignore it
      return;
    }
    // Remove the prefix from the message
    const command = message.substring(prefix.length);
    // Initialize ZukiCall
    const { ZukiCall } = await import("./zukiJS/Modules/ZukiCall.js");
    const zukiAI = new ZukiCall(API_KEY);
    // Send the command to Zuki for processing
    const chatResponse = (
      await zukiAI.zukiChat.sendMessage(event.senderID, message)
    ).replace(/hello! |hi! |/gi, "");
    // Get the user's first name
    const senderInfo = await api.getUserInfo(event.senderID);
    const firstName = senderInfo[event.senderID].firstName;

    // Send the response back to the user
    api.sendMessage(
      {
        body: `Hello ${firstName}, ${chatResponse}`,
        mentions: [
          {
            tag: `${firstName}`,
            id: event.senderID,
            fromIndex: 0,
          },
        ],
      },
      event.threadID,
      (err, messageInfo) => {
        if (err) {
          console.error("Error while sending message:", err);
        } else {
          // Log sent message details
          console.log(
            `Sent message\nmessageID: ${messageInfo.messageID}\nmessageContents: ${chatResponse}\n- - - - -\n`
          );
        }
      }
    );
  }
}

// Function to start listening for messages
function startListening() {
  login(
    { appState: JSON.parse(fs.readFileSync("fbstate.json", "utf-8")) },
    (err, api) => {
      if (err) {
        console.error("Login error:", err);
        return;
      }

      api.listen((err, event) => {
        if (err) {
          console.error("Listen error:", err);
          return;
        }

        // Handle incoming messages
        if (event.type === "message") {
          handleMessage(api, event);
        }
      });

      // Start the HTTP server
      console.log("HTTP server started at port 8080");
    }
  );
}

// Call the startListening function to start listening for messages
startListening();
