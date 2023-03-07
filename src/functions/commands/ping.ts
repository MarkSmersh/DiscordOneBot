import { Client, ChatInputCommandInteraction } from "discord.js"

export default async function ping(c: Client, e: ChatInputCommandInteraction) {
    e.reply(`pong`)
}