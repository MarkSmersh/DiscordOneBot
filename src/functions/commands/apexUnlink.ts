import { Client, ChatInputCommandInteraction } from "discord.js"
import { UserEAUID } from "../../database"

export default async function apexUnlink(c: Client, e: ChatInputCommandInteraction) {
    const userUID = await UserEAUID.findOne({ where: { userId: e.user.id } });

    if (!userUID) {
        await e.reply("Any EA Account is not linked to your user server");
        return;
    }

    await userUID.destroy();
    await e.reply("EA Account succesfully unlinked from your user server");
}