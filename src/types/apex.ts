export interface BridgeRequest {
    uid: string,
    platform: Platform,
    version?: string,
    enableClubsBeta?: string,
    skipRank?: string,
    merge?: string,
    removeMerged?: string
}

export interface BridgeResponse {
    global: {
        name: string,
        uid: string,
        avatar: string,
        platform: Platform,
        level: number,
        toNextLevelPercent: number,
        rank: {
            rankScore: number,
            rankName: Ranks,
            rankDiv: number,
            ladderPosPlatform: number,
            rankImg: string,
            rankedSeason: string
        },
        arena: {
            rankScore: number,
            rankName: Ranks,
            rankDiv: number,
            ladderPosPlatform: number,
            rankImg: string,
            rankedSeason: string
        },
    },
    realtime: {
        "lobbyState": string,
        "isOnline": number,
        "isInGame": number,
        "canJoin": number,
        "partyFull": number,
        "selectedLegend": string,
        "currentState": string,
        "currentStateSinceTimestamp": number,
        "currentStateSecsAgo": number,
        "currentStateAsText": string
    },
    legends: {
        selected: {
            LegendName: string,
            ImgAssets: LegendImgAssets
        }
    }
}

export interface LegendImgAssets {
    icon: string,
    banner: string
}

export type Platform = "PC" | "PS4" | "X1"
export type Ranks = "Rookie" | "Bronze" | "Silver" | "Gold" | "Platinum" | "Diamond" | "Master" | "Apex Predator"

export interface API {
    "bridge": {
        "request": BridgeRequest,
        "response": BridgeResponse
    },
}