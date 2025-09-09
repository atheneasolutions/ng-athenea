import { Component, OnInit } from '@angular/core';
import formJson from './forms/actividades-vida-diaria.json';

interface Preview {
  title: string | null;
  subtitle: string | null;
  desc_html: string | null;
  button: string;
}

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.page.html',
  styleUrls: ['./not-found.page.scss'],
})
export class NotFoundPage implements OnInit {

   id:string="test";
  preview:Preview = {
    title: "test",
    subtitle: "subtitle",
    desc_html: "desc",
    button: "button"
  }
  end:any = { 
  ca:"ca",
  es: "es",
  en: "en"
}
availableDate: Date = new Date();
answersId:string = "id"

questions: any = (formJson as any).questions;

  constructor() { }

    send(event:any){
    console.log(event);
  }

  ngOnInit() {
  }

}
