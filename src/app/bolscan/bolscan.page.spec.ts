import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BolscanPage } from './bolscan.page';

describe('BolscanPage', () => {
  let component: BolscanPage;
  let fixture: ComponentFixture<BolscanPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BolscanPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(BolscanPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
