import { Component, OnInit, ViewChild } from '@angular/core';
import { Validators, FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { AlertController } from '@ionic/angular';
import { Platform } from '@ionic/angular';
import { Keyboard } from '@ionic-native/keyboard/ngx';

@Component({
  selector: 'app-tracking',
  templateUrl: './tracking.page.html',
  styleUrls: ['./tracking.page.scss'],
})
export class TrackingPage implements OnInit {
  public trackingordr: FormGroup;

  @ViewChild('tracking', { static: false }) tracking;
  @ViewChild('itemNo', { static: false }) itemNo;

  userId: any;
  respData: any;
  enterEvt: boolean = false;
  scanItemList: any;
  trackingList: unknown;
  orderno: any;
  shipdate: any;
  customername: any;
  eventLog: String = "";
  trackingscaneditems: any;
  autoSave: boolean = false;
  itemslist: any;
  trackingnumber: any;
  trackingProNumber:any;
  d: Date;
  n: string;
  errOrder: any;
  searched: any;
  message: any = [];
  deviceWidth:any;
  deviceHeight:any;
  isKeyboardHide = true;
  enableSave:any;
  version:any;
  constructor(
    private formbuilder: FormBuilder,
    private routeto: Router,
    private gatherService: AuthService,
    private alert: AlertController,
    private platform: Platform,
    private keyboard: Keyboard
  ) {
    this.trackingordr = this.formbuilder.group({
      tracking: ['', Validators.compose([Validators.required])],
      itemvalues: ['',]
    });
    this.message = JSON.parse(localStorage.getItem(("Message")));
    this.version = localStorage.getItem('version');
  }
  validation_messages: any = {
    'tracking': [
      // { type: 'required', message: this.message[3] },
      { type: 'required', message: 'Tracking Number cannot be empty or null' },
      { type: 'pattern', message: 'Only numbers and characters are allowed' },
    ],

  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.tracking.setFocus();
    }, 400);
  }

  ngOnInit() {
    this.userId = JSON.parse(localStorage.getItem(("Id")));
  }

  ionViewWillEnter() {
    this.keyboard.onKeyboardWillShow().subscribe(()=>{
      this.isKeyboardHide=false;
      //Keyboard.disableScroll(true);
      // console.log('SHOWK');
    });

    this.keyboard.onKeyboardWillHide().subscribe(()=>{
      this.isKeyboardHide=true;
      //this.keyboard.disableScroll(false);
      // console.log('HIDEK');
    });
    this.enableSave = false;
    this.platform.backButton.subscribeWithPriority(0, () => {
      this.routeto.navigate(['/home']);
   });
  }

  ionViewDidEnter(){
    // this.platform.ready().then((readySource) => {
    //   console.log('Width: ' + this.platform.width());
    //   console.log('Height: ' + this.platform.height());
    //   this.deviceWidth = this.platform.width();
    //   this.deviceHeight = this.platform.height();
    //   this.eventLog = 'Your screen resolution is'+' '+this.deviceWidth+' '+'X'+' '+this.deviceHeight
    // });
    //this.eventLog = 'Your screen resolution is'+' '+window.innerWidth+' '+'X'+' '+window.innerHeight
  }
  scanOrder() {
    console.log('In scan order');
    let value = this.trackingordr.controls['tracking'].value;
    this.trackingProNumber = value;
    this.trackingSearch(value);
  }

  //order search via enter key
  handleScanner(evt) {
    setTimeout(() => {
      let value = evt.target.value;
      console.log(value);
      this.trackingProNumber = value;
      this.trackingSearch(value);
    }, 800);
  }

  //items search via enter key
  handleitemScanner(evt) {
    setTimeout(() => {
      let value = evt.target.value;
      this.itemssearch(value);
    }, 800);

  }

  //Method to go back to home page
  backToHome() {
    let tracking = this.trackingordr.controls.tracking.value;
    if (tracking == "" || tracking == null) {
      this.routeto.navigate(['/home']);
    } else {
      this.gatherService.PresentToast("There is unsaved data in the form, either save or clear the form.", "danger");
    }
  }

  //Method to check if autoSave is on/off
  isChecked(evt) {
    let check = evt.target.checked;
    if (check == true) {
      this.autoSave = true;
    } else {
      this.autoSave = false;
    }
  }

  //Method for tracking items
  trackingSearch(evt) {
    var trackingscan = this.gatherService.baseUrl + this.gatherService.trackingitems;
    let trckaingvalue = evt;
    if (trckaingvalue != "" && trckaingvalue != null) {
      var dataParam = {
        "TrackingNumber": trckaingvalue.toUpperCase()
      }
      this.gatherService.present();
      this.gatherService.ajaxCallService(trackingscan, "post", dataParam).then(resp => {
        this.respData = resp;
        console.log("res", this.respData);
        if (resp['scanItemList']['length'] != 0) {
          this.enterEvt = false;
          this.enterEvt = false;
          this.scanItemList = resp['scanItemList'];
          console.log(this.scanItemList);
          this.scanItemList.map(i => i.isscanneditemslist = 0);
          this.trackingList = resp;
          this.orderno = resp['order'];
          this.trackingnumber = resp['trackingNumber'];
          this.shipdate = resp['shipDateString'];
          this.customername = '( ' + resp['customerName'] + ')';
          this.eventLog = 'Tracking # ' + trckaingvalue + ' successfully scanned' + '\n' + this.eventLog;
          this.trackingordr.controls['tracking'].disable();
          this.enableSave = true;
          // if(resp['isScanned']){
          //   this.gatherService.PresentToast(resp['message'], "danger");
          //   console.log('testmssage');
          //    setTimeout(() => {
          //    // this.keyboard.show();
          //      this.tracking.setFocus();
          //      console.log('test focus');
          //    }, 500);
          //  }
          setTimeout(() => {
            this.itemNo.setFocus();
          }, 300);
        }
         
        if (resp['status'] == 'Success' && resp['orderStatus'] == 'Shipped'){
          if(this.autoSave){
            this.trackingsubmit();
          }
          this.enableSave = true;
        }
        if (resp['status'] == 'Scanned') {
          this.openConfirmationAlert(resp, trckaingvalue);
          this.eventLog = 'Tracking # ' + trckaingvalue + ' already scanned. \u2716' + '\n' + this.eventLog;
          this.gatherService.PresentToast('Order/Tracking # ' + trckaingvalue + ' already added/scanned', "danger");
        } else if(resp['message'] == 'Tracking Number not found'){
          this.eventLog = resp['message'] + '\u2716' + '\n' + this.eventLog
          this.gatherService.PresentToast(resp['message'], 'danger');
          setTimeout(() => {
               this.tracking.setFocus();
             }, 500);
          this.enableSave = false;
        } else if(resp['message'] == 'Order has not been scanned'){
          this.eventLog = resp['message'] + '\u2716' + '\n' + this.eventLog
          this.gatherService.PresentToast(resp['message'], 'danger');
          this.enableSave = true;
        } else {
          this.eventLog = 'Tracking # ' + trckaingvalue.toUpperCase() + ' ' + resp['message'] + ' \u2716' + '\n' + this.eventLog;
          this.gatherService.PresentToast(resp['message'], 'danger');
          this.trackingordr.controls['tracking'].enable();
          setTimeout(() => {
            this.tracking.setFocus();
          }, 500);
          this.enableSave = false;
          console.log('checkstatus');
        }
        this.gatherService.dismiss();
      }, err=>{
        this.gatherService.dismiss();
      })
      this.gatherService.dismiss();
    }
  }

  //Tracking items scan

  itemssearch(evt) {

    var itemvalue = evt;
    let temp: boolean, tempAuto: boolean;
    this.trackingscaneditems = this.trackingordr.value.itemvalues.toUpperCase();
    for (var idx in this.scanItemList) {
      if (this.scanItemList[idx]['itemUpc'] == this.trackingscaneditems) {
        this.trackingordr.controls['itemvalues'].reset();
        this.scanItemList[idx]['isscanneditemslist'] = this.scanItemList[idx]['isscanneditemslist'] + 1;
        if (this.scanItemList[idx]['itemQuantity'] == this.scanItemList[idx]['isscanneditemslist']) {
          this.scanItemList[idx]['isScanned'] = true;
          this.scanItemList[idx]['isByPass'] = false;
          // console.log("hafds", this.scanItemList);
          // delete this.scanItemList[idx]['isscanned'];        
          // this.Vanityartservice.PresentToast('All quantities are Scanned in this' + this.scanItemList[idx]['itemName'], 'danger');
        }
        else if (this.scanItemList[idx]['isscanneditemslist'] > this.scanItemList[idx]['itemQuantity']) {
          // this.Vanityartservice.PresentToast('All items are scanned in' + this.scanItemList[idx]['itemName'] + '', 'danger');
          // this.Vanityartservice.PresentToast(this.Vanityartservice.errorMessages[5], 'danger');
          this.gatherService.PresentToast(this.message[6], 'danger');
          this.scanItemList[idx]['isscanneditemslist'] = this.scanItemList[idx]['isscanneditemslist'] - 1;
        }
        temp = true;
      }
    }
    if (!temp) {
      // this.Vanityartservice.PresentToast('Invalid item code', 'danger');
      // this.Vanityartservice.PresentToast(this.Vanityartservice.errorMessages[4], 'danger');
      this.gatherService.PresentToast(this.message[4], 'danger');
      this.trackingordr.controls['itemvalues'].reset();
    }
    if (this.autoSave) {
      for (let idx of this.scanItemList) {
        if (idx['itemQuantity'] == idx['isscanneditemslist']) {
          tempAuto = true;
        } else {
          tempAuto = false;
          break;
        }
      }
      if (tempAuto) {
        this.trackingsubmit();
      } else {
        setTimeout(() => {
          this.itemNo.setFocus();
        }, 300);
      }
    } else {
      for (let idx of this.scanItemList) {
        if (idx['itemQuantity'] == idx['isscanneditemslist']) {
          tempAuto = true;
        } else {
          tempAuto = false;
          break;
        }
      }
      if (!tempAuto) {
        setTimeout(() => {
          this.itemNo.setFocus();
        }, 300);
      }
    }
  }
  //method for trackingsubmit

  trackingsubmit() {
    this.gatherService.present();
    this.itemslist = this.scanItemList;
    var saveTracking = this.gatherService.baseUrl + this.gatherService.savetrckingitems;
    console.log(this.itemslist);
    this.d = new Date();
    this.n = this.d.toJSON();
    console.log(this.respData);
    let jsonobj: any = {
      //"TrackingNumber": this.respData.trackingNumber,
      "TrackingNumber": this.trackingProNumber,
      // "trackingNumber": this.trackingordr.controls.trackingNumber.value,
      "order": this.respData.order,
      // "customerName": this.respData.customerName,
      // "orderDateString": this.respData.orderDateString,
      // "shipDateString": this.respData.shipDateString,
      // "carrier": this.respData.carrier,
      // "orderStatus": this.respData.orderStatus,
      // "shippingMethod": this.respData.shippingMethod,
      // "pro": this.trackingordr.value.pro,
       "Modified": this.userId,
      // "scanItemList": this.scanItemList,
      // "scanDate": this.n,
      // "isScanned": this.respData.isScanned = true,
      // "status": this.respData.status
    }
    console.log("respdataa", jsonobj)
    this.gatherService.ajaxCallService(saveTracking, "post", jsonobj).then(result => {
      console.log("resluu", result);
      if (result['message'] == "Success") {
        console.log("haii", result)
        this.gatherService.PresentToast('Tracking  completed & ' + result['message'], "success");
        this.eventLog = 'Tracking# ' + this.trackingProNumber + ' scan and save completed. \u2714' + '\n' + this.eventLog;
        this.formClear();
        setTimeout(() => {
          this.tracking.setFocus();
        }, 400);
      } else if (result['status'] == "Fail") {
        this.gatherService.PresentToast('Tracking # ' + result['message'], "danger");
        this.formClear();
      }
      this.gatherService.dismiss();
    }, err=> {
      this.gatherService.dismiss();
    })
    this.gatherService.dismiss();
  }


  formreset() {

    console.log(this.scanItemList);
    this.trackingordr.controls['tracking'].enable();
    this.trackingordr.reset();
    this.scanItemList = [];
    this.shipdate = '';
    this.orderno = '';
    this.customername = '';
    this.eventLog = '';
    setTimeout(() => {
      this.tracking.setFocus();
    }, 400);
    setTimeout(() => {

    }, 2000);
    this.enableSave = false;
  }

  formClear(){
    this.trackingordr.controls['tracking'].enable();
    this.trackingordr.reset();
    this.scanItemList = [];
    this.shipdate = '';
    this.orderno = '';
    this.customername = '';
    setTimeout(() => {
      this.tracking.setFocus();
    }, 400);
    setTimeout(() => {

    }, 2000);
    this.enableSave = false;
  }

  //Method to open confirmation alert
  async openConfirmationAlert(resp, track) {
    const alert = await this.alert.create({
      header: 'Confirmation',
      message: resp['message'],
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
            this.formClear();
          }
        }, {
          text: 'Yes',
          handler: () => {
            console.log('Confirm Okay');
            let jsonobj = {
              "order": resp['order'],
              "Modified": this.userId,
              "trackingNumber": track.toUpperCase()
            }
            console.log(jsonobj);
            let url = this.gatherService.baseUrl + this.gatherService.readyToShipped;
            this.gatherService.ajaxCallService(url, "post", jsonobj).then(result => {
              console.log(result);
              if (result['status'] == 'Success') {
                this.gatherService.PresentToast(result['message'], 'success');
                this.enterEvt = false;
                this.enterEvt = false;
                //this.scanItemList = result['scanItemList'];
                console.log(this.scanItemList);
                this.scanItemList.map(i => i.isscanneditemslist = 0);
                this.trackingList = result;
                this.orderno = result['order'];
                this.trackingnumber = result['trackingNumber'];
                this.shipdate = result['shipDateString'];
               // this.customername = '( ' + result['customerName'] + ')';
                this.eventLog = 'Tracking # ' + track.toUpperCase() + ' successfully scanned' + '\n' + this.eventLog;
                this.trackingordr.controls['tracking'].setValue(track.toUpperCase());
                this.trackingordr.controls['tracking'].enable();
                setTimeout(() => {
                  this.tracking.setFocus();
                }, 300);
                // if(this.autoSave){
                //   this.trackingsubmit();
                // }
              } else {
                this.gatherService.PresentToast(result['message'], 'danger');
                this.eventLog = result['message'] + '\n' + this.eventLog;
                this.formClear();
              }
            })
          }
        }
      ]
    });
    await alert.present();
  }

  //Method to check the item as completely scanned
  checkToComplete(item) {
    let tempAuto: boolean = false;
    for (let idx in this.scanItemList) {
      if (this.scanItemList[idx]['itemUpc'] == item['itemUpc']) {
        this.trackingordr.controls['itemvalues'].reset();
        this.scanItemList[idx]['isscanneditemslist'] = this.scanItemList[idx]['itemQuantity'];
        this.scanItemList[idx]['isScanned'] = true;
        this.scanItemList[idx]['isByPass'] = true;
      }
    }

    if (this.autoSave) {
      for (let idx of this.scanItemList) {
        if (idx['itemQuantity'] == idx['isscanneditemslist']) {
          tempAuto = true;
        } else {
          tempAuto = false;
          break;
        }
      }
      if (tempAuto) {
        this.trackingsubmit();
      } else {
        setTimeout(() => {
          this.itemNo.setFocus();
        }, 300);
      }
    } else {
      for (let idx of this.scanItemList) {
        if (idx['itemQuantity'] == idx['isscanneditemslist']) {
          tempAuto = true;
        } else {
          tempAuto = false;
          break;
        }
      }
      if (!tempAuto) {
        setTimeout(() => {
          this.itemNo.setFocus();
        }, 300);
      }
    }
  }

}
