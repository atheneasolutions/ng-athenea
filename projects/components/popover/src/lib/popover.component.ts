import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { IonicModule, PopoverController } from '@ionic/angular';

@Component({
  selector: 'popover',
  template: `<ion-content class="messageOptionsDisabledClick">
                <ng-container *ngFor="let item of items; last as isLast">
                    <ion-item button (click)="click(item.role)" detail="false" [lines]="isLast ? 'none' : 'full'">
                        <ion-icon *ngIf="item?.icon" [name]="item.icon"></ion-icon>
                        {{item.text}}
                    </ion-item>
                </ng-container>
            </ion-content>`,
    standalone: true,
    imports: [CommonModule, IonicModule],
    styles: [`
      @keyframes disableClickWhilePresentingModal {
        0% {pointer-events: none;}
        99% {pointer-events: none;}
        100% {pointer-events: auto;}
      }

      .messageOptionsDisabledClick {
        animation-name: disableClickWhilePresentingModal;
        animation-duration: 0.5s;

        ion-item {
            animation-name: disableClickWhilePresentingModal;
            animation-duration: 0.5s;
        }
      }
      
      ion-icon {
        font-size: 20px;
        margin-right: 10px;
      }
    `]
})
export class PopoverComponent {

  @Input() items: Items[] = [];

  constructor(
    private popoverCtrl: PopoverController
  ) { }

  click(role: string) {
    this.popoverCtrl.dismiss(null, role);
  }

}

type PositionSide = 'top' | 'right' | 'bottom' | 'left' | 'start' | 'end';
type PositionAlign = 'start' | 'center' | 'end';
type TriggerAction = 'click' | 'press';
export interface Items {
  text: string,
  icon?: string,
  role: string
};