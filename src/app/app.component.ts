import { Component } from '@angular/core';

import { Platform, AlertController } from '@ionic/angular';
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
    private benzaraService: AuthService,
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
    let url = this.benzaraService.baseUrl + this.benzaraService.errorMsg;
    let mode = this.benzaraService.baseUrl.includes("https") ? "PROD" : "UAT";
    this.benzaraService.ajaxCallService(url, "post", '').then(resp => {
      console.log(resp);
      this.benzaraService.errorMessages = resp['messages'];
      localStorage.setItem("Message", JSON.stringify(resp['messages']));
     if (mode == "UAT") {
      this.appVersion = resp['appVersionUAT']
      
      if(this.version == "" || this.version == undefined){
        localStorage.setItem("version", this.appVersion)
        this.version = this.appVersion
      }
      if (resp['appVersionUAT'] != this.version) {
          this.benzaraService.presentAlert();
          this.benzaraService.versionChecked = false;
        } else {
          this.benzaraService.versionChecked = true;
        }
      } else {
        this.appVersion = resp['appVersionUAT']
        
        if(this.version == "" || this.version == undefined){
          localStorage.setItem("version", this.appVersion)
          this.version = this.appVersion
        }
        if (resp['appVersionPRD'] != this.version) {
          this.benzaraService.presentAlert();
          this.benzaraService.versionChecked = false;
        } else {
          this.benzaraService.versionChecked = true;
        }
      }
    })
  }

}
