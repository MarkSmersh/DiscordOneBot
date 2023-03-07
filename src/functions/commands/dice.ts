import { Client, ChatInputCommandInteraction, AttachmentBuilder, EmbedBuilder  } from "discord.js"
import { readFileSync } from "fs";

export default async function dice(c: Client, e: ChatInputCommandInteraction) {
    const random = Math.floor(Math.random() * 6) + 1;
    const userData = e.options.getInteger("score");

    const idToImage = [
        "https://i.imgur.com/EAaC9K1.png",
        "https://i.imgur.com/gmA2zxv.png",
        "https://i.imgur.com/6pa8GRT.png",
        "https://i.imgur.com/P1ZrEJ9.png",
        "https://i.imgur.com/bOgDSTH.png",
        "https://i.imgur.com/48hcyrM.png"
    ]

    e.reply({
        embeds: [
            new EmbedBuilder()
                .setThumbnail(idToImage[random - 1])
                .setDescription(`${(userData) ? ((userData === random) ? "Nice one, bitch" : "Nice try, baby") : "No predictions?"}`)
                .setTitle("Roles the dice!")
                .setAuthor({ name: e.user.username as string, iconURL: e.user.displayAvatarURL() })
        ]
    })
}