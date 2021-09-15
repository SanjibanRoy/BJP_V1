import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SurveyformPage } from './surveyform.page';

describe('SurveyformPage', () => {
  let component: SurveyformPage;
  let fixture: ComponentFixture<SurveyformPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SurveyformPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SurveyformPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
