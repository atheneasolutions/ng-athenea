import { Injectable } from "@angular/core";
import { CommunicationService } from "./communication.service";
import { FormCommunicationService } from "./form-communication.service";
import { HttpClient } from "@angular/common/http";


@Injectable({
    providedIn: 'root'
})
export class FormService { 

    constructor(
        public cs: CommunicationService,
        public fcs: FormCommunicationService,
        public http: HttpClient,
    ) { } 

    async getForm(id: string) {
        return await this.cs.request(`/patients_api/typeforms/${id}`, 'get');
    }

    async getAtheneaForm(id: string) {
      const app = "icura";
      const res = await this.fcs.request(`/forms/${app}/${id}`, 'get');
       if (!res) return null;
        return res;
    }

    async updateEnviament(data: any) {
        const res = await this.cs.request("/patients_api/forms/updateEnviament", 'post', data);
        return res;
    }
}