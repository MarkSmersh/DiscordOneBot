import { Client } from "discord.js"

export interface Command {
    name: string,
    description: string
}

export interface RouterEvent {
    data: string,
    description: string,
    function: (c: Client, e: any) => Promise<void>
}

export enum RouterEvents {
    "command" = "command"
}

export type Routes = Record<RouterEvents, RouterEvent[]>