import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
   
   version: any; //PROD & UAT
   appVersion:any;
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private rayneService: AuthService
  ) {
    this.initializeApp();
    this.getErrorMessages();
    this.version = localStorage.getItem("version");
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
    this.getErrorMessages();
  }

  getErrorMessages() {
    let url = this.rayneService.baseUrl + this.rayneService.errorMsg;
    let mode = this.rayneService.baseUrl.includes("https") ? "PROD" : "UAT";
    this.rayneService.ajaxCallService(url, "post", '').then(resp => {
      console.log(resp);
      this.rayneService.errorMessages = resp['messages'];
      localStorage.setItem("Message", JSON.stringify(resp['messages']));
     if (mode == "UAT") {
      this.appVersion = resp['appVersionUAT']
      localStorage.setItem("version", this.appVersion)
      if(this.version == "" || this.version == undefined){
        this.version = this.appVersion
      }
      if (resp['appVersionUAT'] != this.version) {
          this.rayneService.presentAlert();
          this.rayneService.versionChecked = false;
        } else {
          this.rayneService.versionChecked = true;
        }
      } else {
        this.appVersion = resp['appVersionUAT']
        localStorage.setItem("version", this.appVersion)
        if(this.version == "" || this.version == undefined){
          this.version = this.appVersion
        }
        if (resp['appVersionPRD'] != this.version) {
          this.rayneService.presentAlert();
          this.rayneService.versionChecked = false;
        } else {
          this.rayneService.versionChecked = true;
        }
      }
    })
  }
}
