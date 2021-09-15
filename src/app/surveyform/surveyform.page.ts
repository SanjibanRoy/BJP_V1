import { Component, OnInit, OnDestroy, AfterViewInit,NgZone } from '@angular/core';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { HttpClient } from '@angular/common/http';
import { Camera, CameraOptions, PictureSourceType } from 'node_modules/@ionic-native/camera/ngx';
import { Router, ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { AlertController,ActionSheetController, ToastController, Platform, LoadingController } from '@ionic/angular';
import { FilePath } from '@ionic-native/file-path/ngx';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { File, FileEntry } from 'node_modules/@ionic-native/file/ngx';

@Component({
  selector: 'app-surveyform',
  templateUrl: './surveyform.page.html',
  styleUrls: ['./surveyform.page.scss'],
})
export class SurveyformPage implements OnInit {
  id:any
  row_data=[]
  name:any
  voterid:any
  ps:any
  age:any
  hn:any
  guardian:any
  lat: any;
  backButtonSubscription;
  lng: any;
  accuracy:any
  images = [];
  images1 = [];
  imgspath: any;
  user: any;
  type: any;
  currentYear: any;
  amount: any;
  acc=0;
  currentName:any;
  correctPath:any;
  public path: string; 
  placename:any
  constructor(
    public alertController: AlertController, private zone:NgZone,
    private androidPermissions: AndroidPermissions,
    private locationAccuracy: LocationAccuracy,
    public router: Router,
    private platform: Platform,
    private activeRoute: ActivatedRoute,
    private camera: Camera,
    private file: File,
    private http: HttpClient,
    private webview: WebView,
    private actionSheetController: ActionSheetController,
    private toastController: ToastController,
    private plt: Platform,
    private loadingController: LoadingController,
    private filePath: FilePath,
    private geolocation: Geolocation) { }

  ngOnInit() {
    this.id = this.activeRoute.snapshot.paramMap.get('id')
    this.getdata()
    
  }
  getdata(){
    const formData = new FormData();
    formData.append('id', this.id);
    formData.append('token', 'ZXYlmPt6OpAmaLFfjkdjldfjdlM')
    this.http.post("https://waterresourcemanipur.in/api/survey/datas.php", formData)
    .pipe(
      finalize(() => {
      })
    )
    .subscribe(res => {
      var ids = [];
      ids.push(res)
      this.name=ids[0][0].name
      this.voterid=ids[0][0].voterid
      this.ps=ids[0][0].ps
      this.age=ids[0][0].age
      this.hn=ids[0][0].housenumber
      this.guardian=ids[0][0].guardian

      // var ids = [];
      // ids.push(res)
      // this.row_data = []
      // for (var i = 0; i < ids[0].length; i++) {
      //   console.log(ids[0][i])
      //   this.row_data.push({
      //     name: ids[0][i].name,
      //     guardian: ids[0][i].guardian,
      //     voterid: ids[0][i].voterid,
      //     ps: ids[0][i].ps,
      //     id: ids[0][i].id

      //   })
      // }
    })
  }

  capture() {
    this.geolocation.getCurrentPosition({
      maximumAge: 1000, timeout: 5000,
      enableHighAccuracy: true
    }).then((resp) => {
      this.lat = resp.coords.latitude
      this.lng = resp.coords.longitude
    }).catch((error) => {
      console.log('Error getting location', error);
    });
  }

  async selectImage() {
    const actionSheet = await this.actionSheetController.create({
      header: "Select Image source",
      buttons: [{
        text: 'Load from Library',
        handler: () => {
          this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
        }
      },
      {
        text: 'Use Camera',
        handler: () => {
          this.takePicture(this.camera.PictureSourceType.CAMERA);
        }
      },
      {
        text: 'Cancel',
        role: 'cancel'
      }
      ]
    });
    await actionSheet.present();
  }
  takePicture(sourceType: PictureSourceType) {
    var options: CameraOptions = {
      quality: 40,
      encodingType: this.camera.EncodingType.JPEG,
      sourceType: sourceType,
      saveToPhotoAlbum: false,
      correctOrientation: true
    };

    this.camera.getPicture(options).then(imagePath => {
      if (sourceType === this.camera.PictureSourceType.PHOTOLIBRARY) {
        this.filePath.resolveNativePath(imagePath)
          .then(filePath => {
            this.correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
            this.currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));
            //alert(JSON.stringify( this.correctPath))
            //   alert(JSON.stringify(currentName))
            //alert(JSON.stringify(this.pathForImage(imagePath)))
            this.imgspath = filePath
            this.images.push({
              path: this.pathForImage(filePath)
            })
          });
      } else {
        this.currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
        this.correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
        //alert(JSON.stringify( this.correctPath))
        this.imgspath = imagePath
        this.images.push({
          path: this.pathForImage(imagePath)
        })
      }
    });

  }
  pathForImage(img) {
    if (img === null) {
      return '';
    } else {
      let converted = this.webview.convertFileSrc(img);
      return converted;
    }
  }
  submit() {
    if(this.imgspath==''){
      this.presentToast('Fields cannot be empty.');
    }
    else{
      this.file.resolveLocalFilesystemUrl(this.imgspath)
      .then(entry => {
        (<FileEntry>entry).file(file => this.readFile(file))
      })
      .catch(err => {
        this.presentToast('Error while reading file.');
      });
    }
   
  }

  async presentToast(text) {
    const toast = await this.toastController.create({
      message: text,
      position: 'bottom',
      duration: 3000
    });
    toast.present();
  }

  readFile(file: any) {
    var vote = ((document.getElementById("votee") as HTMLInputElement).value);
      const reader = new FileReader();
      reader.onload = () => {
        const formData = new FormData();
        const imgBlob = new Blob([reader.result], {
          type: file.type
        });
        formData.append('file', imgBlob, file.name);
        //alert(FarmerName)
        formData.append('vote', vote);
        formData.append('id', this.id);
        formData.append('token', 'ZXYlmPt6OpAmaLFfjkdjldfjdlM')
        this.uploadImageData(formData);
      };
      reader.readAsArrayBuffer(file);


  }
  async uploadImageData(formData: FormData) {
    
    const loading = await this.loadingController.create({
      message: 'Submitting Data...',
    });
    await loading.present();
    this.http.post("https://mobileapp.nesdr.gov.in/ASDMA/upload_main.php", formData)
      .pipe(
        finalize(() => {
         
        })
      )
      .subscribe(res => {
        loading.dismiss();
        alert(JSON.stringify(res))
        if (res['success']) {
          this.thankyou()
        } else {
          this.presentToast('File upload failed.')

        }
      });
  }
  checkGPSPermission() {
    this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION).then(
      result => {
        if (result.hasPermission) {

          //If having permission show 'Turn On GPS' dialogue
          this.askToTurnOnGPS();
        } else {

          //If not having permission ask for permission
          this.requestGPSPermission();
        }
      },
      err => {
        alert(err);
      }
    );
  }

  requestGPSPermission() {
    this.locationAccuracy.canRequest().then((canRequest: boolean) => {
      if (canRequest) {
        console.log("4");
      } else {
        //Show 'GPS Permission Request' dialogue
        this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION)
          .then(
            () => {
              // call method to turn on GPS
              this.askToTurnOnGPS();
            },
            error => {
              //Show alert if user click on 'No Thanks'
              this.presentToast('please give gps permission')
            }
          );
      }
    });
  }

  askToTurnOnGPS() {
    this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
      () => {
        // When GPS Turned ON call method to get Accurate location coordinates
        this.getLocationCoordinates()
      },
      error =>  this.presentToast('please give gps permission')
    );
  }

  // Methos to get device accurate coordinates using device GPS
  getLocationCoordinates() {
    this.geolocation.getCurrentPosition({timeout: 30000, enableHighAccuracy : true}).then((resp) => {
      this.lat = resp.coords.latitude;
      this.lng= resp.coords.longitude;
      this.accuracy = Math.round(resp.coords.accuracy);
      if(this.accuracy>5 && this.accuracy<70){
        this.acc=1
      }
      else{
        this.acc=0
      }
    }).catch((error) => {
      alert('Error getting location');
    });
  }
  createFileName() {
    var d = new Date(),
        n = d.getTime(),
        newFileName = n + ".jpg";
    return newFileName;
  }
 
 
  thankyou() {
    this.alertController.create({
      header: 'Thank You',
      message: 'Thank You! Your record has been sent for approval',
      backdropDismiss: true,
      buttons: [{
        text: 'Ok',
        handler: () => {
          //this.router.navigateByUrl('dashboard/' + this.user + '/' + this.type);
          
        }
      }, {
        text: 'Upload Again',
        role: 'cancel',
        handler: () => {
          window.location.reload();
          //this.router.navigateByUrl('dashboard/' + this.user + '/' + this.type);
        }
      }]
    })
      .then(alert => {
        alert.present();
      });
  }

}