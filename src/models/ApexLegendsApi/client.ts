import axios, { AxiosResponse, AxiosError } from "axios";
import { API } from "../../types/apex"

export default class ApexLegendsApi {
    private token: string;
    // private baseUrl: string = "https://public-api.tracker.gg/v2/apex/standard";
    private baseUrl: string = "https://api.mozambiquehe.re/";
    
    constructor(token: string) {
        this.token = token;
    }

    async request<R extends keyof API, P extends API[R]["request"]>(methodName: R, methodParams: P): Promise<API[R]["response"]> {
        // creates string request url from baseurl and methodParams
        // let response: AxiosResponse<any, any> = await new Promise (async (resolve) => {
        //     let request = axios.get(
        //         this.baseUrl + methodName + "?" + `auth=${this.token}` + "&" + new URLSearchParams(methodParams as unknown as Record<string, string>)
        //     );

        //     request.catch((e: AxiosError) => {
        //         let data = e.response?.data as { Error: string };
        //         console.log(data.Error)
        //     })

        //     request.then((e) => {
        //         resolve(e);
        //     })
        // })

        let response = await axios.get(
            this.baseUrl + methodName + "?" + `auth=${this.token}` + "&" + new URLSearchParams(methodParams as unknown as Record<string, string>)
        );

        return (await response.data);
    }
}