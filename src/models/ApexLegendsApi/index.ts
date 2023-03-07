import ApexLegendsApi from "./client";
import * as env from "dotenv"

env.config({ path: __dirname + "/../../.env" });

export default (new ApexLegendsApi(process.env.APEXLEGENDSAPI_TOKEN as string))