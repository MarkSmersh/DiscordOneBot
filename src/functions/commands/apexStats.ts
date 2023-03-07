import { Client, ChatInputCommandInteraction, EmbedBuilder, ColorResolvable, User } from "discord.js"
import { UserEAUID } from "../../database";
import { ApexLegendsApi } from "../../models"
import { Ranks } from "../../types/apex";

export default async function apexStats(c: Client, e: ChatInputCommandInteraction) {
    const targetUser = e.options.getUser("user");

    const userUID = await UserEAUID.findOne({ where: { userId: (targetUser) ? targetUser?.id : e.user.id }})

    if (!userUID) {
        await e.reply(`EA Account **is not registered** for ${(targetUser) ? "provided user" : "current user"}. Use /apex-register to link EA Account`);
        return;
    }

    const stats = await ApexLegendsApi.request("bridge", { uid: userUID.uid, platform: "PC" });

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