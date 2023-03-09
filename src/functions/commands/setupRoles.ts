import { Client, ChatInputCommandInteraction, ColorResolvable } from "discord.js";
import { apexLegends } from "../../config.json"

export default async function setupRoles(c: Client, e: ChatInputCommandInteraction) {
    const apexLegendsRoles = e.options.getBoolean("apex-legends");

    if (!apexLegendsRoles) {
        await e.reply("There is any provided option for setuping roles. **At least one required**!");
        return;
    }

    function getRandomColor(): ColorResolvable {
        const r = Math.floor(Math.random() * 256).toString(16).padStart(2, '0');
        const g = Math.floor(Math.random() * 256).toString(16).padStart(2, '0');
        const b = Math.floor(Math.random() * 256).toString(16).padStart(2, '0');
        return `#${r}${g}${b}`;
    }

    if (apexLegendsRoles) {
        Object.values(apexLegends.roles).forEach(async (r) => {
            const isRole = e.guild?.roles.cache.find((role) => role.name === r);
            if (!isRole) {
                await e.guild?.roles.create({ name: r, color: getRandomColor(), reason: "Setup Apex Legends Roles for bot functionality" });
            }
        })
    }

    await e.reply("All roles for provided options are created succesfully!\n**You can change roles as you want, expected their name**");
}