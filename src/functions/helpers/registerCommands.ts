import { Client, REST, Routes } from "discord.js"
import { Command } from "../../types/basic";

export default async function registerCommands (c: Client, commands: Command[]) {
    const rest = new REST({ version: '10' }).setToken(process.env.TOKEN as string);
    await rest.put(Routes.applicationCommands(process.env.CLIENT_ID as string), { body: commands });
}