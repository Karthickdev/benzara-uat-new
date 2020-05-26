import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BolscanningPage } from './bolscanning.page';

describe('BolscanningPage', () => {
  let component: BolscanningPage;
  let fixture: ComponentFixture<BolscanningPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BolscanningPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(BolscanningPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
