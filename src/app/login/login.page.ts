import { Component, OnInit, ViewChild } from '@angular/core';
import { Validators, FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Platform } from '@ionic/angular';
import { Keyboard } from '@ionic-native/keyboard/ngx';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],

})
export class LoginPage implements OnInit {
  @ViewChild('usermailid', { static: false }) usermailid;
  @ViewChild('userpaswrd', { static: false }) userpswrd;
  public logingrp: FormGroup;
  router: any;
  errUserName: boolean;
  errPassword: boolean;
  message: string;
  isKeyboardHide = true;
  userEmail:any;
  userPwd:any;
  version:any;
  constructor(
    private formBuilder: FormBuilder,
    private routeTo: Router,
    private benzaraService: AuthService,
    public platform: Platform,
    private keyboard: Keyboard
  ) {
    this.logingrp = this.formBuilder.group({
     // userEmail: [''],
      //userPwd: [''],
    });
    this.version = localStorage.getItem('version');
  }

  ngOnInit() {
    this.errPassword = false;
    this.errUserName = false;
  }

  ionViewWillEnter() {
    this.keyboard.onKeyboardWillShow().subscribe(()=>{
      this.isKeyboardHide=false;
    });

    this.keyboard.onKeyboardWillHide().subscribe(()=>{
      this.isKeyboardHide=true;
    });
   
    this.platform.backButton.subscribeWithPriority(0, () => {
        navigator['app'].exitApp();
     });
    let msg = JSON.parse(localStorage.getItem(("Message")));
    if (msg) this.message = msg;
    console.log("message", this.message)
    let id = localStorage.getItem("userName");
    this.userEmail = id;
    this.userPwd = "";
    this.logingrp.reset();
  }



  btnLogin() {
    var loginUrl = this.benzaraService.baseUrl + this.benzaraService.userLogin;
    console.log(loginUrl);
    if (this.userEmail == undefined || this.userEmail == "") {
      this.errUserName = true;
      return false;
    } else {
      this.errUserName = false;
    }
    if (this.userPwd == undefined || this.userPwd == "") {
      this.errPassword = true;
      return false;
    } else {
      this.errPassword = false;
    }
    var dataParam = {
      "LoginId": this.userEmail,
      "Password": this.userPwd
    }
    console.log(dataParam);
    let userName = this.userEmail;
    //if (this.benzaraService.versionChecked) {
      this.benzaraService.present();
      this.benzaraService.ajaxCallService(loginUrl, "post", dataParam).then(resp => {
        if (resp['status'] == "Success") {
          localStorage.setItem("Id", JSON.stringify(resp['userId']));
          localStorage.setItem("userName", userName);
          this.routeTo.navigate(["/home"]);
          this.errPassword = false;
        } else {
          this.benzaraService.PresentToast(resp['message'], 'danger');
        }
  
        this.benzaraService.dismiss();
      }).catch(err => {
        this.benzaraService.PresentToast('Unable to reach server, Please try again', 'danger');
        this.benzaraService.dismiss();
      });
  }

  //check if model is empty
  checkEmptyIdOnFocus(evt) {
    if (evt.target.value != undefined && evt.target.value != "") {
      this.errUserName = false;
    }
  }

  //check if model is empty
  checkEmptyIdOnBlur(evt) {
    if (evt.target.value != undefined && evt.target.value != "") {
      this.errUserName = false;
    } else {
      this.errUserName = true;
    }
  }

  //check if model is empty
  checkEmptyPassOnFocus(evt) {
    if (evt.target.value != undefined && evt.target.value != "") {
      this.errPassword = false;
    }
  }

  //check if model is empty
  checkEmptyPassOnBlur(evt) {
    if (evt.target.value != undefined && evt.target.value != "") {
      this.errPassword = false;
    } else {
      this.errPassword = true;
    }
  }
}
