import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  version:any;
  constructor(
    private routeto: Router,
    private benzaraService: AuthService
  ) {
    this.version = localStorage.getItem('version');
  }

  ngOnInit() {
    let id = JSON.parse(localStorage.getItem("Id"));
    console.log(window.innerWidth);
  }
  gotohomepage() {
    this.routeto.navigate(["/login"]);
  }
  gotobolscan() {
    this.routeto.navigate(["/bolscanning"]);
  }
  gototracking() {
    this.routeto.navigate(["/tracking"]);
  }
  gotoreports() {
    this.routeto.navigate(["/reportsip"]);
  }
  gotoporeceive(){
    this.routeto.navigate(['/po-receive']);
  }
}
