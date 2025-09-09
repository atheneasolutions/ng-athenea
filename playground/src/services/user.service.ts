import { Injectable } from "@angular/core";
import { CommunicationService } from "./communication.service";
import { HttpClient } from "@angular/common/http";
import { ConfirmEmail } from "src/app/interfaces/confirm-email.interface";
import { Preferences } from "@capacitor/preferences";


@Injectable({
    providedIn: 'root'
})
export class UserService { 

    public lastPatientName: string | null = null;
    public lastPatientId: string | null = null;
    public lastPatientHospital: string | null = null;
    public lastPatientToken: string | null = null;
    public lastPatientRole: string | null = null;
    private initialized: boolean = false;

    constructor(
        public cs: CommunicationService,
        public http: HttpClient,
    ) { 
        this.loadUser().then(() => {
            this.initialized = true;
        });
     } 

    async setUser(name: string | null, id: string | null, hospital: string | null, token: string | null, role: string | null) {
        this.lastPatientName = name;
        this.lastPatientId = id;
        this.lastPatientHospital = hospital;
        this.lastPatientToken = token;
        this.lastPatientRole = role;
        if (!name) return Preferences.remove({ key: 'name_user'});
        if (!id) return Preferences.remove({ key: 'id_user'});
        if (!hospital) return Preferences.remove({ key: 'hospital'});
        if (!token) return Preferences.remove({ key: 'token'});
        if (!role) return Preferences.remove({ key: 'role'});
        Preferences.set({ key: 'name_user', value: name });
        Preferences.set({ key: 'id_user', value: id });
        Preferences.set({ key: 'hospital', value: hospital });
        Preferences.set({ key: 'token', value: token });
        Preferences.set({ key: 'role', value: role });
    }
    
    async loadUser() {
        let userId = await Preferences.get({ key: 'id_user' });
        let userName = await Preferences.get({ key: 'name_user' });
        let hospital = await Preferences.get({ key: 'hospital' });
        let token = await Preferences.get({ key: 'token' });
        let role = await Preferences.get({ key: 'role' });
        if (userId && userName && userId.value && userName.value && hospital && hospital.value && token && token.value && role && role.value) {
            this.lastPatientName = userName.value;
            this.lastPatientId = userId.value;
            this.lastPatientHospital = hospital.value;
            this.lastPatientToken = token.value;
            this.lastPatientRole = role.value;
        }
    }

    getToken () {
        return this.lastPatientToken;
    }

    async login(data: any) {
        return await this.cs.request(`/external/patients/login`, 'post', data);
    }

    async confirmEmailData(id: string, role: string) {
        return await this.cs.request(`/external/patients/confirmEmailData/${id}/${role}`, 'get');
    }

    async confirmEmail (data: ConfirmEmail) {
        return await this.cs.request(`/external/patient/confirm-email`, 'put', data);
    }
    
    isInitialized(): boolean {
        return this.initialized;
    }
    
}