import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ToastController, LoadingController, AlertController } from '@ionic/angular';
import { Printer, PrintOptions } from '@ionic-native/printer/ngx';
import { File } from '@ionic-native/file/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
   baseUrl: string = 'http://67.79.237.242/opal/uat/Benzara/scanAppApi/'; //UAT
   //baseUrl: string = 'https://www2.order-fulfillment.bz/benzara/scanAppApi/'; //PROD

	//Login
	userLogin: string = "UserLogin";
	getscanitems: string = "BOLScanDetails";
	saveitems: string = "UpdateBolScan";
	trackingitems: string = "TrackingDetails";
	savetrckingitems: string = "UpdateTracking";
	getReport: string = "Report";
	exportreports: string = "ExportReport";
	orderList: string = "ordersapi/OrderStatusList";
	warehouseList: string = "ScanAppWarehouseList";
	ajaxData: any;
	err: any;
	isLoading: any;
	errorMsg: string = "GetResponseMessages";
	readyToShipped: string = "UpdateToReadyToShipped";
	errorMessages: any;
  versionChecked: boolean;
  printLabels: string = "GetPurchaseOrderPrintLabels";
  network:any;
  printerIP:any;
  defaultPrinterIP:any;

  generateLabel: string = "PurchaseOrderPrintLabels";
  
  constructor(public http: HttpClient,
    public toastController: ToastController,
    public loadingCtrl: LoadingController,
    public alert: AlertController,
    private printer: Printer,
    private alertCtrl: AlertController,
    private file: File,
    private fileOpener: FileOpener) { }

  async PresentToast(msg, color) {
    const toast = await this.toastController.create({
      message: msg,
      color: color,
      duration: 3000,
      position: 'bottom',
      keyboardClose: false,
      //showCloseButton: true,
      cssClass: "toast",
    });
    toast.present();
  }

  async present() {
    this.isLoading = true;
    return await this.loadingCtrl.create({
      // duration: 3000,
      message: 'Please wait...',
      spinner: 'lines',
    }).then(a => {
      a.present().then(() => {
        if (!this.isLoading) {
          a.dismiss();
        }
      });
    });
  }

  async dismiss() {
    this.isLoading = false;
    return await this.loadingCtrl.dismiss();
  }

  ajaxCallService(dataUrl, dataType, dataParam) {
    let headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Methods', 'POST, GET ,OPTIONS');
    headers.append('Access-Control-Allow-Headers', 'application/json');
    headers.append('Content-Type', 'application/json');
    switch (dataType) {
      case 'get': return new Promise(resolve => {  //get return type	
        this.http.get(dataUrl)
          .subscribe(data => {
            this.ajaxData = data;
            resolve(this.ajaxData);
          }, (err) => {
            this.err = err.error;
            this.PresentToast('Unable to reach server, Please try again', 'danger');
            resolve(this.err);

          });
      });
      case 'post': return new Promise(resolve => {	//post return type
        // this.presentLoading();

        this.http.post(dataUrl, dataParam, { headers: headers })
          .subscribe(data => {
            this.ajaxData = data;
            resolve(this.ajaxData);
          }, (err) => {
            if (err) {
              this.PresentToast('Unable to reach server, Please try again', 'danger');
              resolve(this.err);
            } else {
              this.PresentToast('Unable to reach server, Please try again', 'danger');
            }
          });
      });
    }
  }

  getLabel(dataUrl, dataType, dataParam){
    let headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Methods', 'POST, GET ,OPTIONS');
    // headers.append('Access-Control-Allow-Headers', 'application/octet-stream');
     headers.append('Content-Type', 'application/x-www-form-urlencoded');
   // headers.append('responseType', 'arraybuffer');
    switch (dataType) {
    case 'post': return new Promise(resolve => {	//post return type
      // this.presentLoading();

      this.http.post(dataUrl, dataParam, { headers: headers })
        .subscribe((data) => {
          this.ajaxData = data
          this.saveAndOpenPdf(this.ajaxData.fileContents, this.ajaxData.fileDownloadName)
          resolve(this.ajaxData);
        }, (err) => {
          if (err) {
            this.PresentToast('Unable to reach server, Please try again', 'danger');
            console.log(err);
          } else {
            console.log(err);
            this.PresentToast('Unable to reach server, Please try again', 'danger');
          }
        });
    });
  }
}

saveAndOpenPdf(pdf: string, filename: string) {
  const writeDirectory = this.file.dataDirectory
  this.file.writeFile(writeDirectory, filename+'.pdf', this.convertBase64ToBlob(pdf, 'application/pdf'), {replace: true})
    .then(() => {
      this.fileOpener.open(writeDirectory + filename+'.pdf', 'application/pdf').then(()=>{})
    })
    .catch(() => {
      console.error('Error writing pdf file');
});
}

async showAlert(err){
  let alert = await this.alertCtrl.create({
    message: err
  });
  alert.present();
}

convertBase64ToBlob(b64Data, contentType): Blob {
  contentType = contentType || '';
  const sliceSize = 512;
  b64Data = b64Data.replace(/^[^,]+,/, '');
  b64Data = b64Data.replace(/\s/g, '');
  const byteCharacters = window.atob(b64Data);
  const byteArrays = [];
  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
       const slice = byteCharacters.slice(offset, offset + sliceSize);
       const byteNumbers = new Array(slice.length);
       for (let i = 0; i < slice.length; i++) {
           byteNumbers[i] = slice.charCodeAt(i);
       }
       const byteArray = new Uint8Array(byteNumbers);
       byteArrays.push(byteArray);
  }
 return new Blob(byteArrays, {type: contentType});
}

 


  //Method to present alert fro App update
  async presentAlert() {
		const alert = await this.alert.create({
			header: "App Update",
			message: "A new version available for the app, Kindly update to the latest version!",
      buttons: [
        {
          text: 'Done',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            navigator['app'].exitApp();
          }
        }
      ]
		});
		await alert.present();
	}
}
