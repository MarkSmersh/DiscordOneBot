import { Client, GatewayIntentBits } from "discord.js"
import * as env from "dotenv"
import database from "./database/database";
import * as f from "./functions/index"
import router from "./routes/router";
import { Command, Routes } from "./types/basic";
import { balance as balanceConfig } from "./config.json"

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
                },
                {
                    type: 10,
                    min_value: 1,
                    max_value: 100000000,
                    required: false,
                    name: "bet",
                    description: "If win -> *2 of bet"
                }
            ],
            function: f.coin
        },
        {
            name: "balance",
            description: "Provides balance for current user",
            function: f.balance
        },
        {
            name: "zapomoga",
            description: `Give a possibility to take ${balanceConfig.grantAmount} every ${balanceConfig.grantUpdate} seconds`,
            function: f.grant
        },
        {
            name: "balance-transfer",
            description: "Tranfer from your balance provided amount to provided user",
            options: [
                {
                    type: 10,
                    name: "amount",
                    description: `Amount of ${balanceConfig.name} to be transfered`,
                    required: true,
                    min_value: 1,
                    max_value: 1000000
                },
                {
                    type: 6,
                    name: "user",
                    description: `User, that claims your transfer`,
                    required: true
                }
            ],
            function: f.balanceTransfer
        },
        {
            name: "duel",
            description: "Creates a 1vs1 duel request to someone",
            options: [
                {
                    type: 6,
                    name: "opponent",
                    description: "Request to certain user",
                    required: false,
                },
                {
                    type: 10,
                    name: "bet",
                    description: "Make a bet. Who win, will take the bet amount for self",
                    required: false,
                    min_value: 100,
                    max_value: 1000000000
                }
            ],
            function: f.duel
        }
    ],
    "button": [
        {
            name: "duel-accept",
            function: f.duelAccept
        },
        {
            name: "duel-rules",
            function: f.duelRules
        },
        {
            name: "duel-gun",
            function: f.duelGun
        },
        {
            name: "duel-hide",
            function: f.duelHide
        },
        {
            name: "duel-shoot",
            function: f.duelShoot
        },
        {
            name: "duel-cancel",
            function: f.duelCancel
        }
    ]
}

c.once('ready', () => {
  console.log(`Logged in as ${c.user?.tag} at ${new Date().toLocaleString()}!`);
});

c.on("interactionCreate", async (e) => {
    await router(c, e, routes);
});

(async () => {
    const commandsFromRoutes = routes.command?.map((r) => {
        const { function:any, ...rest } = r;
        return rest;
      }) as Command[]
    await f.registerCommands(c, commandsFromRoutes);
    await database.authenticate();
    await database.sync();
    await c.login(process.env.TOKEN);
})()