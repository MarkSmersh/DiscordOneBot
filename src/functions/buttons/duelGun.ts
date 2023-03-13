import { Client, ButtonInteraction, ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js"
import { DuelData } from "../../database"
import duelTurnExpire from "../helpers/duelTurnExpire";

export default async function duelGun(c: Client, e: ButtonInteraction) {
    const [buttonName, duelId, gunId, oldUpdateId] = e.customId.split(":");
    const duelData = await DuelData.findOne({ where: { id: duelId } }) as DuelData;

    if (oldUpdateId !== duelData.updateId) {
        await e.reply({ content: "Action is deprecated", ephemeral: true});
        return;
    }

    if (e.user.id !== duelData.offeredId && e.user.id !== duelData.acceptedId) {
        e.reply({ content: "That's not your game. Just watch...", ephemeral: true })
    }

    const isLoaded = (Math.floor(Math.random() * 2) === 0) ? false : true;
    const isOfferedTake = (duelData?.offeredId === e.user.id) ? true: false;
    const updateId = Date.now().toString();

    if (isLoaded) {
        await duelData?.update({ turnId: (isOfferedTake) ? duelData.offeredId : duelData.acceptedId, waitId: (!isOfferedTake) ? duelData.offeredId : duelData.acceptedId, updateId: updateId, state: "in_process" });
    } else {
        await duelData?.update({ turnId: (!isOfferedTake) ? duelData.offeredId : duelData.acceptedId, waitId: (isOfferedTake) ? duelData.offeredId : duelData.acceptedId, updateId: updateId, state: "in_process" });
    }

    const text = `<@${e.user.id}> takes the gun and it's... **${(isLoaded) ? "empty" : "loaded"}**. So <@${duelData.turnId}> hides now!`

    const buttons = new ActionRowBuilder<ButtonBuilder>()
        .addComponents(
            new ButtonBuilder()
                .setCustomId(`duel-hide:${duelId}:0:${updateId}`)
                .setLabel("Hide at the left")
                .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
                .setCustomId(`duel-hide:${duelId}:1:${updateId}`)
                .setLabel("Hide at the center")
                .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                .setCustomId(`duel-hide:${duelId}:2:${updateId}`)
                .setLabel("Hide at the right")
                .setStyle(ButtonStyle.Secondary),
        )

    await e.reply({ content: text, components: [buttons] });

    duelTurnExpire(e, updateId, duelId);
}