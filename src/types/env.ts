declare global {
    namespace NodeJS {
        interface ProcessEnv {
            TOKEN: string;
            CLIENT_ID: string;
            APEXLEGENDSAPI_TOKEN: string;
        }
    }
}

export {}