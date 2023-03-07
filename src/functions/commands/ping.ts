import { Client, ChatInputCommandInteraction } from "discord.js"

export default async function ping(c: Client, e: ChatInputCommandInteraction) {

    const before = Date.now(); 
    const reply = await e.reply(`Polling...`);

    await e.editReply(`Pong with ${Date.now() - before}ms`)
}