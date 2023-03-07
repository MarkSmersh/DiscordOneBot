import { Client, ApplicationCommandData } from "discord.js"

export interface Command {
    name: string,
    description: string
}

// export interface RouterEvent {
//     data: string,
//     description: string,
//     function: (c: Client, e: any) => Promise<void>
// }



export interface Router {
    name: string,
    function: (c: Client, e: any) => Promise<void>
}


export type CommandEvent = Router & ApplicationCommandData

export type RouterEvent = CommandEvent



export enum RouterEvents {
    "command" = "command"
}

export type Routes = Record<RouterEvents, RouterEvent[]>