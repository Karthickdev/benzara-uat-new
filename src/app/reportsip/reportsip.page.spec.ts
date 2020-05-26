import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ReportsipPage } from './reportsip.page';

describe('ReportsipPage', () => {
  let component: ReportsipPage;
  let fixture: ComponentFixture<ReportsipPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportsipPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ReportsipPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
