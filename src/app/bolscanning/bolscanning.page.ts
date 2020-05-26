import { Component, OnInit, ViewChild } from '@angular/core';
import { Validators, FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { AlertController } from '@ionic/angular';
import { Platform } from '@ionic/angular';
import { Keyboard } from '@ionic-native/keyboard/ngx';

@Component({
  selector: 'app-bolscanning',
  templateUrl: './bolscanning.page.html',
  styleUrls: ['./bolscanning.page.scss'],
})


export class BolscanningPage implements OnInit {
  public bolscanning: FormGroup;

  @ViewChild('bolnumber', { static: false }) bolnumber;
  @ViewChild('itemNo', { static: false }) itemNo;
  @ViewChild('proInput', { static: false }) proNo;

  item: any;
  qty: number = 0;
  arry: any;
  enterEvt: boolean = false;
  scanItemList: any;
  bolorderList: any;
  eventLog: String = "";
  itemno: any;
  orderno: any;
  shipdate: any;
  customername: any;
  scanitems: any;
  autoSave: boolean = false;
  scaneditems: any;
  array1: any;
  addedvalue: any;
  itemslist: any;
  respData: any;
  userId: any;
  status: any;
  po: any;
  message: any = [];
  keyboardOpen: boolean = false;
  pro: string;
  deviceWidth: any;
  deviceHeight: any;
  enableSave: any;
  isKeyboardHide = true;
  version:any;
  constructor(
    private formBuilder: FormBuilder,
    private routeto: Router,
    private gatherService: AuthService,
    public alert: AlertController,
    private platform: Platform,
    private keyboard: Keyboard
  ) {
    this.bolscanning = this.formBuilder.group({
      bolnumber: ['', Validators.compose([Validators.required])],
      itemvalues: [''],
      // autosave : ['', Validators.compose([Validators.required])],
      item: [''],
      qty: [''],
      //pro: [''],
      orderno: [''],
      shipdate: [''],
      customerName: ['']
    });
    this.message = JSON.parse(localStorage.getItem(("Message")));
    this.version = localStorage.getItem('version');
  }
  validation_messages: any = {
    'bolnumber': [
      // { type: 'required', message: this.message[2] },
      { type: 'required', message: 'BOL cannot be empty or null' },
      { type: 'pattern', message: 'Only numbers and characters are allowed' },
    ],
    // 'pro': [
    //   // { type: 'required', message: 'PRO# is required.' },
    //   // { type: 'pattern', message: 'Only numbers and characters are allowed' },
    // ]
  }

  ngAfterViewInit() {
    console.log(this.bolscanning.value);
    setTimeout(() => {
      this.bolnumber.setFocus();
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
  }
  ionViewDidEnter(){
    console.log(this.respData);
    // this.platform.ready().then((readySource) => {
    //   console.log('Width: ' + this.platform.width());
    //   console.log('Height: ' + this.platform.height());
    //   this.deviceWidth = this.platform.width();
    //   this.deviceHeight = this.platform.height();
    //   this.eventLog = 'Your screen resolution is'+' '+this.deviceWidth+' '+'X'+' '+this.deviceHeight
    // });
   // this.eventLog = 'Your screen resolution is'+' '+window.innerWidth+' '+'X'+' '+window.innerHeight
  }

  ionViewDidLeave() {
    // this.bolscanning.reset();
  }

  scanOrder() {
    console.log('In scan order');
    let value = this.bolscanning.controls['bolnumber'].value;
    this.orderSearch(value);
  }
  //order search via enter key
  handleScanner(evt) {
    // this.keyboard.show();
    // this.input.setFocus();
    setTimeout(() => {
      let value = evt.target.value;
      console.log(value);
      this.orderSearch(value);
    }, 800);
  }


  //items search via enter key
  handleitemScanner(evt) {
    setTimeout(() => {
      let value = evt.target.value;
      this.itemssearch(value);
    }, 800);
  }

  handleproScanner(evt) {
    let value = evt.target.value;
    setTimeout(() => {
      if (this.autoSave) {
        this.bolscansubmit();
      }
    }, 800)
  }

  orderSearch(evt) {
    var orderScan = this.gatherService.baseUrl + this.gatherService.getscanitems;
    let bolvalue = evt;
    if (bolvalue != "" && bolvalue != null) {
      var dataParam = {
        //  "BOL": this.bolscanning.value.bolnumber
        "BOL": bolvalue.toUpperCase(),

      }
      this.gatherService.present();
      this.gatherService.ajaxCallService(orderScan, "post", dataParam).then(resp => {
        this.respData = resp;
        console.log(this.respData);
        // if(resp['status'] == 'Ready to ship'){
        if (resp['scanItemList']['length'] != 0) {
          this.enterEvt = false;
          this.enterEvt = false;
          this.scanItemList = resp['scanItemList'];
          this.pro = resp['pro'];
          //this.bolscanning.controls['pro'].setValue(resp['pro']);
          this.scanItemList.map(item => {
            if (item['isScanned']) {
              item['isscanneditemslist'] = item['itemQuantity'];
            } else {
              item['isscanneditemslist'] = 0;
            }
          })
          this.bolorderList = resp;
          this.orderno = resp['order'];
          this.shipdate = resp['shipDateString'];
          this.customername = '( ' + resp['customerName'] + ')';
          this.status = resp['orderStatus']
          this.po = resp['po'];
          this.eventLog = 'BOL # ' + bolvalue + ' successfully scanned' + '\n' + this.eventLog;
          this.bolscanning.controls['bolnumber'].disable();
          this.enableSave = true;
          // if (this.scanItemList[0]['isScanned']) {
          if(resp['isScanned']){
            this.gatherService.PresentToast(resp['message'], "danger");
            console.log('testmssage');
             setTimeout(() => {
             // this.keyboard.show();
               this.proNo.setFocus();
               console.log('test focus');
             }, 500);
           }
          // else {
          //   setTimeout(() => {
          //     this.itemNo.setFocus();
          //   }, 500);
          // }
          // if (resp['message']) {
          //   this.rayneService.PresentToast(resp['message'], "danger");
          //   console.log('testmssage');
          // }
        } 
        if(resp['status'] == 'Success'){
          if(this.autoSave){
            this.bolscansubmit();
          }
        }
        
        if (resp['status'] == 'Shipped') {
          this.openConfirmationAlert(resp, bolvalue);
          this.eventLog = 'Order # ' + bolvalue + ' ' + resp['message'] + '\u2716' + '\n' + this.eventLog;
          this.gatherService.PresentToast('BOL# ' + bolvalue + ' ' + resp['message'], "danger");
          //this.bolscanning.controls['bolnumber'].reset();
        } else if (resp['status'] == 'Delivered') {
          this.eventLog = 'Order # ' + bolvalue + ' is Delivered . \u2716' + '\n' + this.eventLog;
          this.gatherService.PresentToast('BOL # ' + bolvalue + ' is Delivered', "danger");

         // this.bolscanning.controls['bolnumber'].reset();
        }
        else if (resp['message'] == 'Order has been cancelled') {
          this.eventLog = 'Order # ' + bolvalue + ' is Cancelled . \u2716' + '\n' + this.eventLog;
          this.gatherService.PresentToast('BOL # ' + bolvalue + ' is Cancelled', "danger");
         // this.bolscanning.controls['bolnumber'].reset();
          setTimeout(() => {
            this.bolnumber.setFocus();
          }, 500);
        }
        else if(resp['message'] == 'BOL number not found'){
          this.eventLog = resp['message'] + '\u2716' + '\n' + this.eventLog
          this.gatherService.PresentToast(resp['message'], 'danger');
          setTimeout(() => {
               this.bolnumber.setFocus();
             }, 500);
          this.enableSave = false;
          
        }
        //   this.eventLog = 'Order # ' + resp['order'] + 'has not been scanned' + ' \u2716' + '\n' + this.eventLog;
        //   this.rayneService.PresentToast(resp['message'], 'danger');
        //   this.bolscanning.controls['bolnumber'].reset();
        //  setTimeout(() => {
        //    this.bolnumber.setFocus();
        //  }, 500);
       
        this.gatherService.dismiss();
        // }
      })
    }
  }

  //items search
  itemssearch(evt) {
    var itemvalue = evt;
    let temp: boolean, tempAuto: boolean;
    this.scaneditems = this.bolscanning.value.itemvalues.toUpperCase();
    for (var idx in this.scanItemList) {
      if (this.scanItemList[idx]['itemUpc'] == this.scaneditems) {
        this.bolscanning.controls['itemvalues'].reset();
        this.scanItemList[idx]['isscanneditemslist'] = this.scanItemList[idx]['isscanneditemslist'] + 1;
        if (this.scanItemList[idx]['itemQuantity'] == this.scanItemList[idx]['isscanneditemslist']) {
          this.scanItemList[idx]['isScanned'] = true;
          this.scanItemList[idx]['isByPass'] = false;
        } else if (this.scanItemList[idx]['isscanneditemslist'] > this.scanItemList[idx]['itemQuantity']) {
          this.gatherService.PresentToast(this.message[6], 'danger');
          this.scanItemList[idx]['isscanneditemslist'] = this.scanItemList[idx]['isscanneditemslist'] - 1;
          this.bolscanning.controls['itemvalues'].reset();
        }
        temp = true;
      }
      // this.bolscansubmit();
    }

    if (!temp) {
      this.gatherService.PresentToast(this.message[4], 'danger');
      this.eventLog = 'Items# ' + this.scaneditems + ' ' + this.message[4] + ' \u2714' + '\n' + this.eventLog;
      this.bolscanning.controls['itemvalues'].reset();
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
        // if (this.bolscanning.value['pro'] != '' && this.bolscanning.value['pro'] != undefined) {
        this.bolscansubmit();
        // setTimeout(() => {
        //   this.proNo.setFocus();
        // }, 300);        
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
      // if (!tempAuto) {
      //   setTimeout(() => {
      //     this.itemNo.setFocus();
      //   }, 300);
      // } else {
      //   setTimeout(() => {
      //     this.proNo.setFocus();
      //   }, 300);
      // }
    }
  }

  //Method to save data through save button
  bolscansubmit() {
    this.gatherService.present();
    this.itemslist = this.scanItemList;
    var saveOrder = this.gatherService.baseUrl + this.gatherService.saveitems;
    let jsonobj: any = {
      "bol": this.respData.bol,
      "order": this.respData.order,
      // "customerName": this.respData.customerName,
      // "orderDateString": this.respData.orderDateString,
      // "shipDateString": this.respData.shipDateString,
      // "carrier": this.respData.carrier,
      // "orderStatus": this.respData.orderStatus,
      // "shippingMethod": this.respData.shippingMethod,
      // "pro": this.bolscanning.value.pro != undefined ? this.bolscanning.value.pro : '',
      //"pro": this.bolscanning.value.pro,
      "pro": this.pro
      // "Modified": this.userId,
      // "scanItemList": this.scanItemList
    }
    console.log(jsonobj);
    this.gatherService.ajaxCallService(saveOrder, "post", jsonobj).then(result => {
      console.log(result);
      if (result['message'] == 'Success') {
        this.gatherService.PresentToast("Items scan completed & " + result['message'], "success");
        this.eventLog = 'Items# ' + this.respData.bol + ' scan and save completed. \u2714' + '\n' + this.eventLog;
        console.log('correct');
        this.formClear();
        this.pro = "";
        if (this.pro == '' || this.pro == undefined) {
          setTimeout(() => {
            this.proNo.setFocus();
          }, 400);
        //this.enableSave = false;
        } 
        else {
          this.formClear();
          //this.enableSave = false;
        }
        setTimeout(() => {
          this.bolnumber.setFocus();
        }, 400);
      }
      else {
        console.log('wrong');
        this.gatherService.PresentToast(result['message'], "danger");
        if (this.pro == '' || this.pro == undefined) {
          this.enableSave = true;
          setTimeout(() => {
            this.proNo.setFocus();
          }, 400);
        }else{
          this.enableSave = false;
        }
        
      }
      this.gatherService.dismiss();
    })
  }



  //Method to check if autoSave is on/off
  isChecked(evt) {
    let check = evt.target.checked;
    if (check == true) {
      this.autoSave = true;
      // this.itemssearchauto(evt);
    } else {
      this.autoSave = false;
    }
  }

  //Method to go back to home page
  backToHome() {
    let bolnumber = this.bolscanning.controls.bolnumber.value;
    if (bolnumber == "" || bolnumber == null) {
      this.routeto.navigate(['/home']);
    } else {
      this.gatherService.PresentToast("There is unsaved data in the form, either save or clear the form.", "danger");
    }
  }


  //Method to form reset 
  formreset() {

    this.bolscanning.controls['bolnumber'].enable();
    this.bolscanning.reset();
    this.pro = '';
    this.scanItemList = [];
    this.shipdate = '';
    this.orderno = '';
    this.customername = '';
    this.po = '';
    this.eventLog = '';
    setTimeout(() => {
      this.bolnumber.setFocus();
    }, 400);
    this.enableSave = false;
  }

  formClear(){
    this.bolscanning.controls['bolnumber'].enable();
    this.bolscanning.reset();
    this.pro = '';
    this.scanItemList = [];
    this.shipdate = '';
    this.orderno = '';
    this.customername = '';
    this.po = '';
    setTimeout(() => {
      this.bolnumber.setFocus();
    }, 400);
    this.enableSave = false;
  }

  //Method to open confirmation alert
  async openConfirmationAlert(resp, bol) {
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
            //  "Modified": this.userId,
              "bol": bol.toUpperCase(),
              //"pro": resp['pro']
            }
            console.log(jsonobj);
            let url = this.gatherService.baseUrl + this.gatherService.readyToShipped;
            this.gatherService.ajaxCallService(url, "post", jsonobj).then(result => {
              console.log(result);
              if (result['status'] == 'Success') {
                this.gatherService.PresentToast(result['message'], 'success');
                this.enterEvt = false;
                this.enterEvt = false;
              //  this.scanItemList = result['scanItemList'];
                this.scanItemList.map(i => i.isscanneditemslist = 0);
                this.bolorderList = result;
                this.orderno = result['order'];
                this.shipdate = result['shipDateString'];
               // this.customername = '( ' + result['customerName'] + ')';
                this.status = result['orderStatus'];
                this.pro = resp['pro'];
                //this.bolscanning.controls['pro'].setValue(resp['pro']);
                this.bolscanning.controls['bolnumber'].setValue(bol.toUpperCase());
                this.eventLog = 'BOL # ' + bol.toUpperCase() + ' successfully scanned' + '\n' + this.eventLog;
                this.bolscanning.controls['bolnumber'].disable();
                setTimeout(() => {
                   this.proNo.setFocus();
                }, 300);
                // if(this.autoSave){
                //   this.bolscansubmit();
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
    for (var idx in this.scanItemList) {
      if (this.scanItemList[idx]['itemUpc'] == item['itemUpc']) {
        this.bolscanning.controls['itemvalues'].reset();
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
        // if (this.bolscanning.value['pro'] != '' && this.bolscanning.value['pro'] != undefined) {
        this.bolscansubmit();
        // setTimeout(() => {
        //   this.proNo.setFocus();
        // }, 300);        
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
      } else {
        setTimeout(() => {
         // this.proNo.setFocus();
        }, 300);
      }
    }
  }
}