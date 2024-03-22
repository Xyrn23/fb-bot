const API_KEY = "zu-2ff335cca13f867c11a93db2b15c19b9";

async function startZukiChat() {
    try {
        const { ZukiCall } = await import("./Modules/ZukiCall.js");
        const zukiAI = new ZukiCall(API_KEY);
        const chatResponse = await zukiAI.zukiChat.sendMessage("Hey, how's it going?");
        console.log("Chat Response: ", chatResponse);
    } catch (error) {
        console.error("Error while starting Zuki chat:", error);
    }
}

startZukiChat();
