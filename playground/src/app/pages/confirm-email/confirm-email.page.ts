import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ConfirmEmail } from 'src/app/interfaces/confirm-email.interface';
import { User } from 'src/app/interfaces/user.interface';
import { LinksService } from 'src/services/links.service';
import { UserService } from 'src/services/user.service';
import { Hospital } from 'src/shared/models/enums/Hospital';

@Component({
  selector: 'app-confirm-email',
  templateUrl: './confirm-email.page.html',
  styleUrls: ['./confirm-email.page.scss'],
})
export class ConfirmEmailPage implements OnInit {

  userId: string = '';
  password: string = '';
  role: string = '';
  titol: string = '';
  isValidated: boolean = false;
  alreadyValidated: boolean = false;
  errorConfirmEmail: boolean = false;
  hospital: string | null = null;
  dateuci: Date | null = null;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private linksService: LinksService,
  ) { }

  get Hospital() { return Hospital; }

  async ngOnInit(): Promise<void> {
    this.isValidated = false;
    const idAndTokenAndRole = this.route.snapshot.paramMap.get('id')!;
    const splitIndexes = this.findAllIndexesOfCharacter(idAndTokenAndRole, ':');
    if (splitIndexes.length >= 2) {
      this.userId = idAndTokenAndRole.substring(0, splitIndexes[0]);
      this.password = idAndTokenAndRole.substring(splitIndexes[0] + 1, splitIndexes[1]);
      this.role = idAndTokenAndRole.substring(splitIndexes[1] + 1);
    } else {
      const splitIndexes = this.splitStringByCharacter(idAndTokenAndRole, '-');
      if (splitIndexes.length == 4) {
        const responseLink = await this.linksService.getLinkByUid(splitIndexes[0] + '-' + splitIndexes[1] + '-' + splitIndexes[2]);
        const link = responseLink['data'];
        this.userId = link['user_id'];
        this.password = link['password'];
        this.role = splitIndexes[3];
      } 
    }
    const data = await this.userService.confirmEmailData(this.userId, this.role);
    if (data == "already validated") {
      this.alreadyValidated = true;
    } else {
      this.hospital = data['hospital'];
      this.dateuci = data['dateuci'];
    }
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

  splitStringByCharacter(str: string, char: string): string[] {
    return str.split(char);
  }

  async confirm() {
    try {
      const confirmData: ConfirmEmail = {
        userId: this.userId,
        password: this.password,
        role: this.role,
        dateuci: formatDate(this.dateuci!, 'yyyy-MM-dd', 'en-US')
      }
      await this.userService.confirmEmail(confirmData);
      this.isValidated = true;
    } catch (e: any) {
      this.errorConfirmEmail = true;
    }
  }

}
