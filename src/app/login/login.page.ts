import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { finalize } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { ActionSheetController, ToastController, Platform, LoadingController } from '@ionic/angular';
import { Location } from "@angular/common";
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  Dvalue=1
  user:any
  ab=[]
  ab1:any
  ab2:any
  toggle=false
  ptype='password'
  content: string;
  passwordType: string = 'password';
  passwordIcon: string = 'eye-off';
  constructor(     private location:Location,   private platform: Platform,public router: Router, public activeRoute: ActivatedRoute, private toastCtrl: ToastController, private http: HttpClient, private loadingController: LoadingController) {}
  async ngOnInit() {
    //alert('this.router.url  '+this.router.url);
    this.platform.backButton.subscribeWithPriority(10, () => {
      //alert(this.location.isCurrentPathEqualTo('/home'))
      if (this.location.isCurrentPathEqualTo('/home') || this.location.isCurrentPathEqualTo('/login')) {
        navigator['app'].exitApp();
       
      } else {
        this.location.back();
  
      }
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
  }
  hideShowPassword() {
    this.passwordType = this.passwordType === 'text' ? 'password' : 'text';
    this.passwordIcon = this.passwordIcon === 'eye-off' ? 'eye' : 'eye-off';
  }
  async presentToast1(text) {
    const toast = await this.toastCtrl.create({
      message: text,
      position: 'bottom',
      duration: 3000
    });
    toast.present();
  }
   async login(){
    var username=((document.getElementById("username") as HTMLInputElement).value)
    var password=((document.getElementById("password") as HTMLInputElement).value)
    const formData = new FormData();
    formData.append('token', 'ZXYlmPt6OpAmaLFNxBBM');
    formData.append('username', username);
    formData.append('password', password);
    const loading = await this.loadingController.create({
      message: 'Please wait...',
    });
    await loading.present();

    this.http.post("https://waterresourcemanipur.in/bjp/api/survey/login.php", formData)
      .pipe(
        finalize(() => {
          loading.dismiss();
        })
      )
      .subscribe(res => {
        console.log(res)
        if (res['success']) {
          var id= res['username']
          var type=this.user
          localStorage.setItem('username', id)
          localStorage.setItem('login', 'login')
          this.router.navigateByUrl('home');

        } else {
          this.presentToast1('Username is not registerd ! Please contact admin.')
        }

      });

   }
   datachanged(){
    if(this.toggle){
      this.ptype='password'
    } 
    else{
      this.ptype='text'
    } 
    this.toggle=!this.toggle
  }
}
