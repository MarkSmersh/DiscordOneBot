import { Client, ButtonInteraction } from "discord.js"
import { DuelData } from "../../database";

export default async function duelRules(c: Client, e: ButtonInteraction) {
    const [buttonName, duelId, oldUpdateId] = e.customId.split(":");
    const duelData = await DuelData.findByPk(duelId);

    if (oldUpdateId !== duelData?.updateId) {
        await e.reply({ content: "Action is deprecated", ephemeral: true});
        return;
    }

    if (duelData?.offeredId !== e.user.id) {
        await e.reply({ content: "Only offerer can cancel duel request", ephemeral: true});
        return;
    }

    await duelData.update({ state: "end", updateId: Date.now().toString() });
    await e.reply("Duel request was canceled by offerer");
}