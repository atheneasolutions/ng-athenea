import { Injectable } from "@angular/core";
import { CommunicationService } from "./communication.service";
import { HttpClient } from "@angular/common/http";


@Injectable({
    providedIn: 'root'
})
export class FormService { 

    constructor(
        public cs: CommunicationService,
        public http: HttpClient,
    ) { } 

    async getForm(id: string) {
        return await this.cs.request(`/patients_api/typeforms/${id}`, 'get');
    }

    async getAtheneaForm(id: string) {
        return await this.cs.request(`/patients_api/forms/${id}`, 'get');
    }

    async updateEnviament(data: any) {
        const res = await this.cs.request("/patients_api/forms/updateEnviament", 'post', data);
        return res;
    }
}