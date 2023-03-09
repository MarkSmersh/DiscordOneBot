import { Client, ChatInputCommandInteraction, EmbedBuilder } from "discord.js"

export default async function coin(c: Client, e: ChatInputCommandInteraction) {
    const prediction = e.options.getInteger("prediction") as 1 | 2;
    const random = Math.floor(Math.random() * 2) + 1;
    
    const idToGif = [
        "https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExNWRiMGU5ZThlZmI2ZmEyYWM3YWU4NGU0NDFjZWIxOWI1NjlhYTQ2ZiZjdD1z/cPdoNLDjYYzqt5MPj0/giphy.gif",
        "https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExYWVhMThkMjMxNzQ2YjJlOTJjMmVhMDBkZGY2YTZiODMzZDkwMjMwOCZjdD1z/uDacuunLcovoTbF4Mf/giphy.gif"
    ]

    const idToName = [
        "heads",
        "tails"
    ]

    e.reply({
        embeds: [
            new EmbedBuilder()
                .setThumbnail(idToGif[random - 1])
                .setDescription(`${(prediction) ? ((prediction === random) ? "Nice one, bitch!" : "Nice try, kiddo") : "No predictions?"}`)
                .setTitle(`You got ${idToName[random - 1]}!`)
                .setAuthor({ name: e.user.username as string, iconURL: e.user.displayAvatarURL() })
                .setFooter({ text: `${e.user.username}'s prediction: ${prediction}`})
                .setColor((prediction) ? ((prediction === random) ? 0x00FF00 : 0xFF0000) : 0xFFFFFF)
        ]
    })
}