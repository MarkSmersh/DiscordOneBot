import { Client, ChatInputCommandInteraction, EmbedBuilder, ColorResolvable } from "discord.js"
import { ApexLegendsApi } from "../../models"
import { Ranks } from "../../types/apex";

export default async function ping(c: Client, e: ChatInputCommandInteraction) {
    const stats = await ApexLegendsApi.request("bridge", { uid: e.options.getInteger("uid")?.toString() as string, platform: "PC" });

    const currentLegend = stats.legends.selected;
    const rank = stats.global.rank
    const arena = stats.global.arena

    const rankToColor: Record<Ranks, ColorResolvable> = {
        "Rookie": "White",
        "Bronze": "Orange",
        "Silver": "DarkGrey",
        "Gold": "Gold",
        "Platinum": "Aqua",
        "Diamond": "Blue",
        "Master": "Purple",
        "Apex Predator": "Red"
    }

    await e.reply({
        embeds: [
            new EmbedBuilder()
                .setColor(rankToColor[rank.rankName])
                .setTitle(`${stats.global.name}'s stats`)
                .setAuthor({ name: e.user.username, iconURL: e.user.displayAvatarURL() })
                .setDescription(`Level: **${stats.global.level}**`)
                .setThumbnail(stats.global.rank.rankImg)
                .addFields(
                    { name: 'Battle Royale Rank:', value: `**${rank.rankScore} RP (${rank.rankName}-${rank.rankDiv})** during ${rank.rankedSeason.split("_").join(" ")}`, inline: true},
                    { name: 'Arena Rank:', value: `**${arena.rankScore} RP (${arena.rankName}-${arena.rankDiv})** during ${rank.rankedSeason.split("_").join(" ")}`, inline: true},
                )
                .setImage(currentLegend.ImgAssets.banner)
                .setTimestamp()
                .setFooter({ text: `Play as ${stats.realtime.selectedLegend} now`, iconURL: currentLegend.ImgAssets.icon })
        ]
    })
}