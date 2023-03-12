import { Client, ButtonInteraction, ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js"
import { v4 } from "uuid";
import { DuelData } from "../../database"
import duelTurnExpire from "../helpers/duelTurnExpire";

export default async function duelHide(c: Client, e: ButtonInteraction) {
    const [buttonName, duelId, hideId, oldUpdateId] = e.customId.split(":");
    const duelData = await DuelData.findOne({ where: { id: duelId } }) as DuelData;

    if (oldUpdateId !== duelData.updateId) {
        await e.reply({ content: "Action is deprecated", ephemeral: true});
        return;
    }

    const updateId = Date.now().toString();

    if (e.user.id !== duelData.offeredId && e.user.id !== duelData.acceptedId) {
        e.reply({ content: "That's not your game. Just watch...", ephemeral: true })
        return;
    }

    if (e.user.id !== duelData.turnId) {
        e.reply({ content: "**Not your turn now**", ephemeral: true });
        return;
    }

    await duelData.update({ turnId: duelData.waitId, waitId: duelData.turnId, lastHideId: hideId as "0" | "1" | "2", updateId: updateId });

    const text = `<@${duelData.waitId}> hided... <@${duelData.turnId}> can shoot now!`

    const buttons = new ActionRowBuilder<ButtonBuilder>()
        .addComponents(
            new ButtonBuilder()
                .setCustomId(`duel-shoot:${duelId}:0:${updateId}`)
                .setLabel("Shoot at the left")
                .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
                .setCustomId(`duel-shoot:${duelId}:1:${updateId}`)
                .setLabel("Shoot at the center")
                .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                .setCustomId(`duel-shoot:${duelId}:2:${updateId}`)
                .setLabel("Shoot at the right")
                .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
                .setCustomId(`duel-shoot:${duelId}:3:${updateId}`)
                .setLabel("Suicide")
                .setStyle(ButtonStyle.Danger)
        )

    await e.reply({ content: text, components: [buttons] });

    duelTurnExpire(e, updateId, duelId);
}