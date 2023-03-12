import { Client, ButtonInteraction } from "discord.js"

export default async function duelRules(c: Client, e: ButtonInteraction) {
    const rules = `Firstly, someone should be faster than another and pick the right or the left gun. One of them is charged, so whoever chooses it, has a first shot.
Another player should hide with 3 options: just stay, go left, go right. The shooting player should decide which side to shoot.
If a player shoots another - the game ends.
Otherwise, everything becomes the opposite. Who was hidden - shoots, who shot - hiding.
**SHOOT AND HIDE UNTIL IT IS DONE**!`

    await e.reply({ content: rules, ephemeral: true });
}