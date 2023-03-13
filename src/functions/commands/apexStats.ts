import { Client, ChatInputCommandInteraction, EmbedBuilder, ColorResolvable, User, APIEmbedField, Role } from "discord.js"
import { UserEAUID } from "../../database";
import { ApexLegendsApi } from "../../models"
import { Ranks } from "../../types/apex";
import { apexLegends } from "../../config.json";

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

    const rankToRole: Record<Ranks, Role["name"]> = {
        "Rookie": apexLegends.roles["Rookie"],
        "Bronze": apexLegends.roles["Bronze"],
        "Silver": apexLegends.roles["Silver"],
        "Gold": apexLegends.roles["Gold"],
        "Platinum": apexLegends.roles["Platinum"],
        "Diamond": apexLegends.roles["Diamond"],
        "Master": apexLegends.roles["Master"],
        "Apex Predator": apexLegends.roles["Apex Predator"]
    }

    const rankRole = e.guild?.roles.cache.find((r) => r.name === rankToRole[rank.rankName]);

    if (rankRole) {        
        const deprecatedRoles = e.guild?.roles.cache.filter((role) => Object.values(apexLegends.roles).includes(role.name));
        if (deprecatedRoles) {
            await e.guild?.members.cache.get(userUID.userId)?.roles.remove(deprecatedRoles);
        }
        await e.guild?.members.cache.get(userUID.userId)?.roles.add(rankRole, "Rank update");
    }

    const legendInfoEmbed = new EmbedBuilder()
        .setColor(rankToColor[rank.rankName])
        .setTitle(`${stats.global.name}'s stats`)
        .setAuthor({ name: e.user.username, iconURL: e.user.displayAvatarURL() })
        .setDescription(`Level: **${stats.global.level}**`)
        .setThumbnail(stats.global.rank.rankImg)
        .addFields(
            { name: 'Battle Royale Rank:', value: `**${rank.rankScore} RP (${rank.rankName}-${rank.rankDiv})** during ${rank.rankedSeason.split("_").join(" ")}`, inline: true},
            { name: 'Arena Rank:', value: `**${arena.rankScore} RP (${arena.rankName}-${arena.rankDiv})** during ${rank.rankedSeason.split("_").join(" ")}`, inline: true},
            { name: '\u200B', value: '\u200B', inline: true },
        )
        .setImage(currentLegend.ImgAssets.banner)
        .setTimestamp()
        .setFooter({ text: `Play as ${stats.realtime.selectedLegend} now`, iconURL: currentLegend.ImgAssets.icon })

    if (currentLegend.data[0]) {
        legendInfoEmbed.addFields({ name: `Legend's ${currentLegend.data[0].name}`, value: `${currentLegend.data[0].value}`, inline: true});
    }

    if (currentLegend.data[1]) {
        legendInfoEmbed.addFields({ name: `Legend's ${currentLegend.data[1].name}`, value: `${currentLegend.data[1].value}`, inline: true});
    }

    if (currentLegend.data[2]) {
        legendInfoEmbed.addFields({ name: `Legend's ${currentLegend.data[2].name}`, value: `${currentLegend.data[2].value}`, inline: true});
    }

    await e.reply({
        embeds: [
            legendInfoEmbed
        ]
    })
}