import { Injectable } from "@angular/core";
import { CommunicationService } from "./communication.service";
import { HttpClient } from "@angular/common/http";
import { CheckEnviament, Enviament } from "src/app/interfaces/enviament.interface";
import { Preferences } from '@capacitor/preferences';
import { BehaviorSubject } from "rxjs";


@Injectable({
    providedIn: 'root'
})
export class EnviamentService { 

    idEnviament: string | null = null;
    formResponded: string[] = [];
    role: string | null = null;


    constructor(
        public cs: CommunicationService,
        public http: HttpClient,
    ) {
        this.loadEnviament();
    } 

    async setEnviament(idEnviament: string | null, role: string | null) {
        this.idEnviament = idEnviament;
        this.role = role;
        if (!idEnviament) return Preferences.remove({ key: 'id_enviament'});
        if (!role) return Preferences.remove({ key: 'role'});
        Preferences.set({ key: 'id_enviament', value: idEnviament });
        Preferences.set({ key: 'role', value: role });
    }

    async loadEnviament() {
        let idEnviament = await Preferences.get({ key: 'id_enviament' });
        let role = await Preferences.get({ key: 'role' });
        if (idEnviament && idEnviament.value) {
            this.idEnviament = idEnviament.value;
        } else {
            this.idEnviament = null;
        }
        if (role && role.value) {
            this.role = role.value;
        } else {
            this.role = null;
        }
      }

    async checkEnviament(data: CheckEnviament) {
        return await this.cs.request(`/external/enviaments/check/data`, 'post', data);
    }

    async getEnviament(id: string) {
        return await this.cs.request(`/patients_api/enviaments/${id}`, 'get');
    }

    markFormAsResponded (idForm: string) {
        if (!this.formResponded.includes(idForm)) {
            this.formResponded.push(idForm);
        }
    }
    
}