import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { finalize } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { ActionSheetController, ToastController, Platform, LoadingController } from '@ionic/angular';
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
  constructor(public router: Router, public activeRoute: ActivatedRoute, private toastCtrl: ToastController, private http: HttpClient, private loadingController: LoadingController) {}
  async ngOnInit() {
    const loading = await this.loadingController.create({
      message: 'Auto Login...',
      duration: 2000
    });
    await loading.present();
    var user=localStorage.getItem('username')
    setTimeout(async () => {
      loading.dismiss();
      if (user) {
        this.router.navigateByUrl('home/'+user);
      }
      else {
        this.presentToast1('Session Expire ! please login.')
      }
    },
      3000)
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

    this.http.post("https://waterresourcemanipur.in/api/survey/login.php", formData)
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
          this.router.navigateByUrl('home/'+id);

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
