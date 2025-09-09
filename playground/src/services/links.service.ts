import { Injectable } from "@angular/core";
import { CommunicationService } from "./communication.service";
import { HttpClient } from "@angular/common/http";


@Injectable({
    providedIn: 'root'
})
export class LinksService { 

    constructor(
        public cs: CommunicationService,
        public http: HttpClient,
    ) { } 

    async getLinkByUid(uuid: string) {
        return await this.cs.request(`/external/links/${uuid}`, 'get');
    }
}