import { Component, OnInit, ViewChild } from '@angular/core';
import { Validators, FormGroup, FormBuilder, FormControl } from '@angular/forms';

@Component({
  selector: 'app-bolscan',
  templateUrl: './bolscan.page.html',
  styleUrls: ['./bolscan.page.scss'],
})
export class BolscanPage implements OnInit {
  public scanbolnumber: FormGroup;

  constructor(
    private formBuilder: FormBuilder
  ) {
    this.scanbolnumber = this.formBuilder.group({
      scanbol: ['', Validators.compose([Validators.required])]
    });
  }

  ngOnInit() { }

  formreset() {
    this.scanbolnumber.reset();
  }

}
