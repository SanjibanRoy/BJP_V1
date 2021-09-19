
// search.module.ts
import { Component, OnInit, OnDestroy, AfterViewInit,NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { finalize } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { ActionSheetController, ToastController, Platform, LoadingController ,AlertController} from '@ionic/angular';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {
  term = '';
  row_data=[]
  filterData = [
    {
      firstName: 'Celestine',
      lastName: 'Schimmel',
      address: '7687 Jadon Port',
      voterid: 'dsadsad',
      guardian: 'S. FK'
    },
    {
      firstName: 'Johan',
      lastName: 'Ziemann PhD',
      address: '156 Streich Ports',
      voterid: 'dsadsad',
      guardian: 'S. FK'
    },
    {
      firstName: 'Lizzie',
      lastName: 'Schumm',
      address: '5203 Jordon Center',
      voterid: 'dsadsad',
      guardian: 'S. FK'
    },
    {
      firstName: 'Gavin',
      lastName: 'Leannon',
      address: '91057 Davion Club',
      voterid: 'dsadsad',
      guardian: 'S. FK'
    },
    {
      firstName: 'Lucious',
      lastName: 'Leuschke',
      address: '16288 Reichel Harbor',
      voterid: 'dsadsad',
      guardian: 'S. FK'
    }
  ]

  constructor(
    public alertController: AlertController,
    private platform: Platform,
    public router: Router,
    public activeRoute: ActivatedRoute,
    private toastCtrl: ToastController,
    private http: HttpClient,
    private loadingController: LoadingController,
    private zone:NgZone) { }

  ngOnInit() {
  }
  search(){
    var search=((document.getElementById("search") as HTMLInputElement).value)
    const formData = new FormData();
    formData.append('query', search);
    formData.append('token', 'ZXYlmPt6OpAmaLFfjkdjldfjdlM')
    this.http.post("https://waterresourcemanipur.in/bjp/api/survey/query.php", formData)
    .pipe(
      finalize(() => {
      })
    )
    .subscribe(res => {
      this.zone.run(() => {
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
      });
  
    });
  }
  next(id){
    //alert(id)
    this.router.navigateByUrl('surveyform/'+id);
  }

}