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
            name: "ping",
            description: "Pong",
            function: f.ping
        },
        {
            name: "dice",
            description: "Role the dice!",
            options: [
                {
                    type: 4,
                    min_value: 1,
                    max_value: 6,
                    required: false,
                    name: "score",
                    description: "Try to predict it!"
                }
            ],
            function: f.dice
        },
        {
            name: "apex-statistics",
            description: "Shows apex stats by UID",
            options: [
                {
                    type: 4,
                    required: true,
                    name: "uid",
                    description: "Provide EA User ID"
                }
            ],
            function: f.apexStats
        }
    ]
}

c.once('ready', () => {
  console.log(`Logged in as ${c.user?.tag}!`);
  const commandsFromRoutes = routes.command.map((r) => {
    const { function:any, ...rest } = r;
    return rest;
  }) as Command[]
  f.registerCommands(c, commandsFromRoutes)
});

c.on("interactionCreate", async (e) => {
    await router(c, e, routes);
});

c.login(process.env.TOKEN);