import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { CheckEnviament, Enviament } from 'src/app/interfaces/enviament.interface';
import { Familiar } from 'src/app/interfaces/familiar.interface';
import { User } from 'src/app/interfaces/user.interface';
import { EnviamentService } from 'src/services/enviament.service';
import { LinksService } from 'src/services/links.service';
import { UserService } from 'src/services/user.service';
import { Hospital } from 'src/shared/models/enums/Hospital';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit{

  titol: string = '';
  credentials: FormGroup;
  errorLogin: boolean = false;
  incorrectCredentials: boolean = false;
  errorLink: boolean | null = null;
  enviamentId: string = '';
  indexRecordatori: number = 0;
  password: string = '';
  role: string = '';
  hospital: string = '';
  userUuid: string = '';
  user: User = {};
  enviament: Enviament = {};
  data: CheckEnviament = {};
  familiar: Familiar = {};
  loading: boolean = false;
  expirated: boolean = false;
  expiratedLink: boolean = false;
 

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    public userService: UserService,
    public enviamentService: EnviamentService,
    public navCtrl: NavController,
    public translateService: TranslateService,
    public linksService: LinksService
  ) { 
    this.credentials = this.formBuilder.group({
      dninie: ['', Validators.required]
    });
  }

  get Hospital() { return Hospital; }

  async ngOnInit(): Promise<void> {
    try {
      this.loading = true;
      this.userService.setUser(null, null, null, null, null);
      const idAndTokenAndRole = this.route.snapshot.paramMap.get('id');

      if (!idAndTokenAndRole) {
        this.errorLink = true;
      } else {
        const splitIndexes = this.findAllIndexesOfCharacter(idAndTokenAndRole, ':');
        if (splitIndexes.length >= 2) {
          this.enviamentId = idAndTokenAndRole.substring(0, splitIndexes[0]);
          this.indexRecordatori = parseInt(idAndTokenAndRole.substring(splitIndexes[0] + 1, splitIndexes[1]));
          this.password = idAndTokenAndRole.substring(splitIndexes[1] + 1, splitIndexes[2]);
          this.role = idAndTokenAndRole.substring(splitIndexes[2] + 1);
          this.data = {
            enviamentId: this.enviamentId,
            index: this.indexRecordatori,
            password: this.password,
            role: this.role
          }

          // formato de id param en home -->  enviamentId:indexRecordatori:password:role
          // 6718068766e52a80a20a2597:1:$2y$13$/vjNN24vipU9fP8rIXC.AOaso6goX6k.kZdXN3ZgQlg3iuZLy3IFi:patient
         //test id:  68ac3d92db2dc95fd25bbb0a:1:$2y$13$%2FvjNN24vipU9fP8rIXC.AOaso6goX6k.kZdXN3ZgQlg3iuZLy3IFi:patient 

          const response = await this.enviamentService.checkEnviament(this.data);
          this.enviament =  response['data']['enviament'];
          this.role =  response['data']['role'];
          this.hospital = response['data']['hospital'];
          this.expirated = response['data']['expirated'];
          switch (this.role) {
            case 'patient':
              this.translateService.use(this.user.lang?.type ?? 'ca');
              break;
            case 'firstfamiliar':
              this.translateService.use(this.familiar.langfamiliar?.type ?? 'ca');
              break;
          } 
          
        } else {
          const splitIndexes = this.splitStringByCharacter(idAndTokenAndRole, '-');
          if (splitIndexes.length == 4) {
            const responseLink = await this.linksService.getLinkByUid(splitIndexes[0] + '-' + splitIndexes[1]);
            const link = responseLink['data'];
            const recordatori = link['recordatoris'][splitIndexes[2]];
            const expiration = recordatori['expiration'];
            if (!expiration || new Date(expiration) < new Date()) {
              this.expiratedLink = true;
            } else {
              this.enviamentId = link['enviament_id'];
              this.indexRecordatori = recordatori['index'];
              this.password = recordatori['password'];
              this.role = splitIndexes[3];
              this.data = {
                enviamentId: this.enviamentId,
                index: this.indexRecordatori,
                password: this.password,
                role: this.role
              }
              const response = await this.enviamentService.checkEnviament(this.data);
              this.enviament =  response['data']['enviament'];
              this.role =  response['data']['role'];
              this.hospital = response['data']['hospital'];
              this.expirated = response['data']['expirated'];
              switch (this.role) {
                case 'patient':
                  this.translateService.use(this.user.lang?.type ?? 'ca');
                  break;
                case 'firstfamiliar':
                  this.translateService.use(this.familiar.langfamiliar?.type ?? 'ca');
                  break;
              } 
            }
          } else {
            this.errorLink = true;
          }
        }
        this.errorLink = false;
        this.loading = false;
      }
    } catch (e: any) {
      if (e.status == 403) {
        this.errorLink = true;
      } else {
        this.errorLogin = true;
        this.errorLink = false;
      }
      
    } 
  }
  
  splitStringByCharacter(str: string, char: string): string[] {
    return str.split(char);
  }

  findAllIndexesOfCharacter(str: string, char: string): number[] {
    const indexes = [];
    for (let i = 0; i < str.length; i++) {
      if (str[i] === char) {
        indexes.push(i);
      }
    }
    return indexes;
  }

  async login () {
    try {
      this.enviamentService.setEnviament(this.enviament.id!, this.role);
      const data = {
        'userId': this.enviament.user_id,
        'doc': (this.credentials.value.dninie).toUpperCase(),
        'role': this.role
      }

      const user = await this.userService.login(data);
      switch (this.role) {
        case 'patient':
          if (user) {
            this.user = user['user'];
            let token = user['token'];
            this.userService.setUser(this.user.name!, this.user.id!, this.user.hospital!, token, this.role);
            this.errorLogin = false;
            this.navCtrl.navigateForward(`/list-athenea-forms/${this.enviamentId}`);
          } else {
            this.errorLogin = true;
          }
          break;
      
        case 'firstfamiliar':
          if (user) {
            this.user = user['user'];
            let token = user['token'];
            this.userService.setUser(this.user.familiars![0].namefamiliar!, this.user.id!, this.user.hospital!, token, this.role);
            this.errorLogin = false;
            this.navCtrl.navigateForward(`/list-forms/${this.enviamentId}`);
          } else {
            this.errorLogin = true;
          }
          break;
        case 'secondfamiliar':
          if (user) {
            this.user = user['user'];
            let token = user['token'];
            this.userService.setUser(this.user.familiars![1].namefamiliar!, this.user.id!, this.user.hospital!, token, this.role);
            this.errorLogin = false;
            this.navCtrl.navigateForward(`/list-forms/${this.enviamentId}`);
          } else {
            this.errorLogin = true;
          }
          break;
      } 
    } catch (e: any) {
      if (e.status == 422) {
        this.incorrectCredentials = true;
      } else {
        this.errorLogin = true;
      }
    }
    
  }

  get dninie() {
    return this.credentials.get('dninie');
  }

}
