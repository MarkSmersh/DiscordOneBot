import { Client, GatewayIntentBits } from "discord.js"
import * as env from "dotenv"
import { commands } from "./commands.json"
import * as f from "./functions/index"

env.config({ path: __dirname + "/.env" });
const c = new Client({ intents: [GatewayIntentBits.Guilds] });

c.on('ready', () => {
  console.log(`Logged in as ${c.user?.tag}!`);
  f.registerCommands(c, commands)
});

c.on("interactionCreate", async (e) => {
    if (!e.isCommand()) return

    if (e.commandName === "ping") {
        await e.reply("sex is nothing but a usurper a false idol my eyes have been opened let me help you to see virgin")
    }
});

c.login(process.env.TOKEN);