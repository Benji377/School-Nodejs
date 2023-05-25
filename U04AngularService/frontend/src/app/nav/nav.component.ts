import { Component } from '@angular/core';
import {Router} from '@angular/router';
import { JwtAuthService } from '../service/JwtAuthService';
import { MatDialog } from '@angular/material/dialog';
import { LoginDialogComponent } from '../login-dialog/login-dialog.component';

export interface DialogData {
  username: string,
  password: string,
}

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent {
  sort = 'asc';
  logged!: boolean;
  user!: any;

  constructor(private router: Router, private authservice: JwtAuthService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.logged = this.authservice.isLoggedIn();
    this.user = localStorage.getItem('jwt');
  }

  filmList(): void {
    if (this.sort === 'asc') {
      this.sort = 'desc';
    } else {
      this.sort = 'asc';
    }
    this.router.navigate([`/list/${this.sort}`]);
  }

  loginDialog(): void {
    const dialogRef = this.dialog.open(LoginDialogComponent, {
      data: {username: '', password: ''}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log("Got res from dialog: ", result);
      }
    });
  }
}
