import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { finalize } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { ActionSheetController, ToastController, Platform, LoadingController ,AlertController} from '@ionic/angular';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  user:any
  total:any
  yes:any
  row_data=[]
  constructor(
    public alertController: AlertController,
    private platform: Platform,
    public router: Router,
    public activeRoute: ActivatedRoute,
    private toastCtrl: ToastController,
    private http: HttpClient,
    private loadingController: LoadingController) {}

    ngOnInit() {
    this.user = this.activeRoute.snapshot.paramMap.get('id')
    this.getdata()
    }
    getdata(){
      const formData = new FormData();
      formData.append('user', this.user);
      formData.append('token', 'ZXYlmPt6OpAmaLFfjkdjldfjdlM')
      this.http.post("https://waterresourcemanipur.in/api/survey/getdata.php", formData)
      .pipe(
        finalize(() => {
        })
      )
      .subscribe(res => {
        console.log(res)
        var ids = [];
        ids.push(res)
        console.log(ids)
        for (var i = 0; i < ids[0].length; i++) {
          this.total = ids[0][0]
          this.yes = ids[0][1]
        }
      });

      this.http.post("https://waterresourcemanipur.in/api/survey/getdata_last5days.php", formData)
      .pipe(
        finalize(() => {
        })
      )
      .subscribe(res => {
        console.log(res)
        var ids = [];
        ids.push(res)
        this.row_data = []
        for (var i = 0; i < ids[0].length; i++) {
          console.log(ids[0][i])
          this.row_data.push({
            name: ids[0][i].name,
            guardian: ids[0][i].guardian,
            voterid: ids[0][i].voterid,
            ps: ids[0][i].ps,
            id: ids[0][i].id

          })
        }
      })
    }

  next()
  {
    //alert(id)
    this.router.navigateByUrl('search');
  }

}
