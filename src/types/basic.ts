import { Client, ApplicationCommandData } from "discord.js"

export interface Command {
    name: string,
    description: string
}

export interface Router {
    name: string,
    function: (c: Client, e: any) => Promise<void>
}

export type CommandEvent = Router & ApplicationCommandData;

export interface Routes {
    "command"?: CommandEvent[];
    "button"?: Router[];
}