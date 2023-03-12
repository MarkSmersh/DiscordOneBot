import { Client, Interaction } from "discord.js"
import { Routes } from "../types/basic";

export default async function router(c: Client, e: Interaction, routes: Routes) {
    if (e.isCommand()) {
        const commands = routes["command"];
        if (commands) await (commands.find((c) => c.name === e.commandName))?.function(c, e);
    }

    if (e.isButton()) { 
        const buttons = routes["button"];
        if (buttons) {
            // await (buttons.find((c) => c.name === JSON.parse(e.customId).n as string || c.name === e.customId))?.function(c, e);
            // try {
                
            // } catch {
            //     await buttons.find((c) => )?.function(c, e);
            // }
            await buttons.find((c) => c.name === (e.customId).split(":")[0] || c.name === e.customId)?.function(c, e);
        }
    }
}