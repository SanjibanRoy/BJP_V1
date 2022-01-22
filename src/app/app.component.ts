import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { ActionSheetController, ToastController, Platform, LoadingController, AlertController, } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Location } from "@angular/common";
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private location:Location,
    public router: Router, 
    public activeRoute: ActivatedRoute, 
    private toastCtrl: ToastController, 
    private loadingController: LoadingController
  ) {
    this.initializeApp();
  }
  
  async initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });

    const loading = await this.loadingController.create({
      message: 'Auto Login...',
      duration: 2000
    });
    await loading.present();
    var user=localStorage.getItem('username')
    //alert(user)
    setTimeout(async () => {
      loading.dismiss();
      if (user) {
       this.router.navigateByUrl('home');
      }
      else {
        this.presentToast1('Session Expire ! please login.')
      }
    },
      3000)
    // this.platform.backButton.subscribeWithPriority(10, () => {
    //   alert(this.location.isCurrentPathEqualTo('/home'))
    //   if (this.location.isCurrentPathEqualTo('/home')) {
    //     navigator['app'].exitApp();
       
    //   } else {
    //     this.location.back();
  
    //   }
    // });

    // this.platform.backButton.subscribeWithPriority(10, () => {
    //   if (this.location.isCurrentPathEqualTo('/home')) {
    //     navigator['app'].exitApp();
       
    //   } else {
    //     this.location.back();

    //   }
    // });

    // this.platform.backButton.subscribeWithPriority(5, () => {
    //   console.log('Handler called to force close!');
    //   this.alertCtrl.getTop().then(r => {
    //     if (r) {
    //       navigator['app'].exitApp();
    //     }
    //   }).catch(e => {
    //     console.log(e);
    //   })
    // })
  }
  async presentToast1(text) {
    const toast = await this.toastCtrl.create({
      message: text,
      position: 'bottom',
      duration: 3000
    });
    toast.present();
  }
 
}
