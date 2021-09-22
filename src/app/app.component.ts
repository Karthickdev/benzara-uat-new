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
   version: string = '1.0.2' //UAT
   //version: string = '0.0.3'; //PROD
   appVersion:any; //appversionlatestttt12
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private benzaraService: AuthService,
  ) {
    this.initializeApp();
    this.getErrorMessages();
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
      console.log(resp['appVersionUAT']);
      this.benzaraService.errorMessages = resp['messages'];
      localStorage.setItem("Message", JSON.stringify(resp['messages']));
     if (mode == "UAT") {
        if (resp['appVersionUAT'] != this.version) {
          this.benzaraService.presentAlert();
          this.benzaraService.versionChecked = false;
        } else {
          this.benzaraService.versionChecked = true;
        }
      } else {
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
