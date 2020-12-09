import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PoReceivePage } from './po-receive.page';

describe('PoReceivePage', () => {
  let component: PoReceivePage;
  let fixture: ComponentFixture<PoReceivePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PoReceivePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PoReceivePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
