import { Client, ChatInputCommandInteraction } from "discord.js"
import { UserEAUID } from "../../database";
import { ApexLegendsApi } from "../../models"

export default async function apexRegistered(c: Client, e: ChatInputCommandInteraction) {
    const userData = await ApexLegendsApi.request("nametouid", { player: e.options.getString("username") as string, platform: "PC" });

    if (userData.Error) {
        await e.reply(userData.Error);
        return;
    }

    await UserEAUID.create({ userId: e.user.id, uid: userData.uid });

    await e.reply(`EA Account **${userData.name}** now linked to your server user!`);
}