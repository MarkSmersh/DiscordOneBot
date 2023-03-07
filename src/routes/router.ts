import { Client, Interaction } from "discord.js"
import { Routes } from "../types/basic";

export default async function router(c: Client, e: Interaction, routes: Routes) {
    if (e.isCommand()) {
        const commands = routes["command"];
        await (commands.find((c) => c.name === e.commandName))?.function(c, e);
    }
}