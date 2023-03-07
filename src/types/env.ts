declare global {
    namespace NodeJS {
        interface ProcessEnv {
            TOKEN: string;
            CLIENT_ID: string;
            APEXLEGENDSAPI_TOKEN: string;
            DATABASE_URI: string;
        }
    }
}

export {}