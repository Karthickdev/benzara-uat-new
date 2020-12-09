import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Validators, FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
//import { Printer, PrintOptions } from '@ionic-native/printer/ngx';
import { AlertController, LoadingController } from '@ionic/angular';
import { Keyboard } from '@ionic-native/keyboard/ngx';

@Component({
  selector: 'app-po-receive',
  templateUrl: './po-receive.page.html',
  styleUrls: ['./po-receive.page.scss'],
})
export class PoReceivePage implements OnInit {
  public poScanning: FormGroup;
  resData:any;
  eventLog:string='';
  poItems:any;
  itemQty:any;
  purchaseOrderId:any;
  isKeyboardHide = true;
  @ViewChild('po', { static: false }) po;

  constructor(
    private router: Router, 
    private formBuilder: FormBuilder,
    private benzaraService: AuthService,
    private http: HttpClient,
    //private printer: Printer,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private keyboard: Keyboard) {
    this.poScanning = this.formBuilder.group({
      po: ['', Validators.compose([Validators.required])],
    });
   }
   validation_messages: any = {
    'po': [
      { type: 'required', message: 'PO cannot be empty or null' },
      { type: 'pattern', message: 'Only numbers and characters are allowed' },
    ]
  }

  ngOnInit() {
  }

  ionViewWillEnter(){
    this.keyboard.onKeyboardWillShow().subscribe(()=>{
      this.isKeyboardHide=false;
    });

    this.keyboard.onKeyboardWillHide().subscribe(()=>{
      this.isKeyboardHide=true;
    });
  }

  closeKeyboard(){
    this.keyboard.hide();
  }

  ionViewDidEnter(){
    this.po.setFocus();
  }

  backToHome(){
    this.formreset()
    this.router.navigate(['/home']);
  }

  formreset(){
    this.poScanning.reset();
    this.poItems='';
    this.eventLog='';
  }

  scanner(event){
    let value = event.target.value
    setTimeout(()=>{
      this.printLabel(value)
    }, 400)
  }

  scanOrder(){
    let value = this.poScanning.controls['po'].value
    setTimeout(()=>{
      this.printLabel(value)
    }, 400)
  }

  printLabel(value){
    let print = this.benzaraService.baseUrl+this.benzaraService.printLabels
    let po = value.toUpperCase();
    let data = {
      "PurchaseOrderNumber": po
    }
    this.benzaraService.present();
    this.benzaraService.ajaxCallService(print, "post", data).then(res =>{
      this.resData = res
      let poDetails = this.resData.purchaseOrder
      this.purchaseOrderId = poDetails.purchaseOrderId
      if(this.resData.status == "success" && poDetails.isLabelPrinted == false){
        this.eventLog = 'PO # is successfully scanned'+'\n'+this.eventLog
        this.poItems = poDetails.items
      }else if(this.resData.status == "failure"){
        this.eventLog = this.resData.responseMessage+'\n'+this.eventLog
        this.benzaraService.PresentToast(this.resData.responseMessage, 'danger');
      }else if(this.resData.status == "success" && poDetails.isLabelPrinted == true){
        this.eventLog = this.resData.responseMessage+'\n'+this.eventLog
        this.poItems = poDetails.items
        this.benzaraService.PresentToast(this.resData.responseMessage, 'warning');
      }
      this.benzaraService.dismiss();
    }).catch(err=>{
      this.benzaraService.PresentToast('Unable to reach the server, Please try again', 'danger');
      this.benzaraService.dismiss();
    })
  }

  generateLabel(){
    for(let item of this.poItems){
      item.quantity = item.extraQuantityReceived
    }
    setTimeout(()=>{
     this.sendDataToGenerateLabel()
    },200)
  }

  async sendDataToGenerateLabel(){
    let url = this.benzaraService.baseUrl+this.benzaraService.generateLabel
    let data ={
      "purchaseOrder":{
        "purchaseOrderId": this.purchaseOrderId,
        "items": this.poItems
      }
    }
    let loading = await this.loadingCtrl.create({
      spinner: "circles",
      message: "Generating Label will take few seconds, Please wait."
    });
    loading.present();
    this.benzaraService.getLabel(url, "post", data).then(res=>{
      console.log(res);
      loading.dismiss();
    //   let fileName = res['fileDownloadName']
    //   this.printer.isAvailable().then((onSuccess)=>{
    //     let options: PrintOptions = {
    //       name: fileName,
    //       duplex: true,
    //       orientation: 'portrait',
    //       monochrome: true
    //     }
    //     let content = poLabel;
    //     this.printer.print(content.toString(), options)
    //   }, err=>{
    //     this.testAlert(err)
    //   });
     }).catch(err=>{
       loading.dismiss();
       this.benzaraService.PresentToast('Unable to reach the server, Please try again', 'danger');
     })
  }

  async testAlert(msg){
    let alert = await this.alertCtrl.create({
      message: JSON.stringify(msg)
    });
    alert.present();
  }

}
