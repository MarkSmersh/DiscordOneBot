import { Client, ChatInputCommandInteraction } from "discord.js"
import { UserEAUID } from "../../database";
import { ApexLegendsApi } from "../../models"

export default async function apexRegistered(c: Client, e: ChatInputCommandInteraction) {
    const userData = await ApexLegendsApi.request("nametouid", { player: e.options.getString("username") as string, platform: "PC" });

    if (userData.Error) {
        await e.reply(userData.Error);
        return;
    }

    const UIDExists = await UserEAUID.findOne({ where: { uid: userData.uid } });

    if (UIDExists) {
        if (UIDExists.userId === e.user.id) {
            await e.reply(`This EA Account currently linked to current user server. If you want yo unlink EA Account use /apex-unlink`);
        } else {
            await e.reply(`This EA Account currently linked to <@${UIDExists.userId}> user server`);
        }
        return;
    }

    try {
        await ApexLegendsApi.request("bridge", { uid: userData.uid, platform: "PC" });
    } catch (error) {
        await e.reply(`There is exists EA Account with this username, **but never played Apex: Legends**!`);
        return;
    }

    await UserEAUID.create({ userId: e.user.id, uid: userData.uid });

    await e.reply(`EA Account **${userData.name}** now linked to your server user!`);
}