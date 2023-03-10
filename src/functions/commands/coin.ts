import { Client, ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import { UserBalance } from "../../database";
import { balance as balanceConfig } from "../../config.json";

export default async function coin(c: Client, e: ChatInputCommandInteraction) {
    const prediction = e.options.getInteger("prediction") as 1 | 2;
    const bet = e.options.getNumber("bet");
    const random = Math.floor(Math.random() * 2) + 1;
    const userBalance = await UserBalance.findOne({ where: { userId: e.user.id } });

    if (bet && !prediction) {
        await e.reply("You can't make a bet without predections");
        return;
    }

    if (bet && !userBalance) {
        await e.reply("You can't make a bet without balance. You can create it with `/balance` command");
        return;
    }

    if (bet && userBalance?.balance as number < bet) {
        await e.reply(`You can't make this bet, cause in your balance you have less ${balanceConfig.name}...`);
        return;
    }
    
    const idToGif = [
        "https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExNWRiMGU5ZThlZmI2ZmEyYWM3YWU4NGU0NDFjZWIxOWI1NjlhYTQ2ZiZjdD1z/cPdoNLDjYYzqt5MPj0/giphy.gif",
        "https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExYWVhMThkMjMxNzQ2YjJlOTJjMmVhMDBkZGY2YTZiODMzZDkwMjMwOCZjdD1z/uDacuunLcovoTbF4Mf/giphy.gif"
    ]

    const idToName = [
        "heads",
        "tails"
    ]

    const coinInfoEmbed = new EmbedBuilder()
        .setThumbnail(idToGif[random - 1])
        // .setDescription(`${(prediction) ? ((prediction === random) ? "Nice one, bitch!" : "Nice try, kiddo") : "No predictions?"}`)
        .setTitle(`You got ${idToName[random - 1]}!`)
        .setAuthor({ name: e.user.username as string, iconURL: e.user.displayAvatarURL() })
        .setFooter({ text: `${e.user.username}'s prediction: ${idToName[prediction - 1]}`})
        .setColor((prediction) ? ((prediction === random) ? 0x00FF00 : 0xFF0000) : 0xFFFFFF)

    if (bet && random === prediction) {
        coinInfoEmbed.setDescription(`And you won ${bet} ${balanceConfig.name}!`);
        await userBalance?.update({ balance: userBalance.balance + bet });
    }

    if (bet && random !== prediction) {
        coinInfoEmbed.setDescription(`And you lost ${bet} ${balanceConfig.name}...`);
        await userBalance?.update({ balance: userBalance.balance - bet });
    }

    e.reply({
        embeds: [coinInfoEmbed]
    })
}