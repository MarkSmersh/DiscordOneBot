import { Client, GatewayIntentBits } from "discord.js"
import * as env from "dotenv"
import database from "./database/database";
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
            name: "apex-stats",
            description: "Shows apex stats by user. If user not provided, shows stats for current user",
            options: [
                {
                    type: 6,
                    required: false,
                    name: "user",
                    description: "Provide user"
                },
            ],
            function: f.apexStats
        },
        {
            name: "apex-link",
            description: "Connect EA account to current user",
            options: [
                {
                    type: 3,
                    required: true,
                    name: "username",
                    description: "Provide EA ID (username)"
                }
            ],
            function: f.apexLink
        },
        {
            name: "apex-unlink",
            description: "Unlink EA Account from current user",
            function: f.apexUnlink
        },
        {
            name: "setup-roles",
            description: "Setups server roles, required for bot functions, that bind with...",
            defaultMemberPermissions: "Administrator",
            options: [
                {
                    type: 5,
                    required: false,
                    name: "apex-legends",
                    description: "...Apex: Legends"
                }
            ],
            function: f.setupRoles
        },
        {
            name: "coin",
            description: "Flips a coin!",
            options: [
                {
                    type: 4,
                    min_value: 1,
                    max_value: 2,
                    required: false,
                    name: "prediction",
                    description: "1 - for heads, 2 - for tails"
                }
            ],
            function: f.coin
        }
    ]
}

c.once('ready', () => {
  console.log(`Logged in as ${c.user?.tag}!`);
});

c.on("interactionCreate", async (e) => {
    await router(c, e, routes);
});

(async () => {
    const commandsFromRoutes = routes.command.map((r) => {
        const { function:any, ...rest } = r;
        return rest;
      }) as Command[]
    await f.registerCommands(c, commandsFromRoutes);
    await database.authenticate();
    await database.sync();
    await c.login(process.env.TOKEN);
})()