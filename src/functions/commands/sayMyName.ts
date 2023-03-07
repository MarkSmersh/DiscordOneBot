import { Client, ChatInputCommandInteraction } from "discord.js"

export default async function sayMyName(c: Client, e: ChatInputCommandInteraction) {
    e.reply(`${e.member?.user.username}`)
}