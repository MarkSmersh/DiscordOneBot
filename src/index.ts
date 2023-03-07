import { Client, GatewayIntentBits } from "discord.js"
import * as env from "dotenv"
import * as f from "./functions/index"
import router from "./routes/router";
import { Command, Routes } from "./types/basic";

env.config({ path: __dirname + "/.env" });
const c = new Client({ intents: [GatewayIntentBits.Guilds] });

const routes: Routes = {
    "command": [
        {
            data: "ping",
            description: "Answers with pong",
            function: f.ping
        },
        {
            data: "saymyname",
            description: "Says your name",
            function: f.sayMyName
        }
    ]
}

c.once('ready', () => {
  console.log(`Logged in as ${c.user?.tag}!`);
  f.registerCommands(c, routes.command.map((r) => ({ "name": r.data, "description": r.description })) as Command[])
});

c.on("interactionCreate", async (e) => {
    await router(c, e, routes);
});

c.login(process.env.TOKEN);