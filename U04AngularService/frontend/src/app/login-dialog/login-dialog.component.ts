import { FormGroup, FormBuilder, RequiredValidator } from '@angular/forms';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { DialogData } from '../nav/nav.component';
import { JwtAuthService } from '../service/JwtAuthService';

@Component({
  selector: 'app-login-dialog',
  templateUrl: './login-dialog.component.html',
  styleUrls: ['./login-dialog.component.scss']
})
export class LoginDialogComponent implements OnInit {
  loginForm!: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<LoginDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private fb: FormBuilder,
    public dialog: MatDialog,
    private auths: JwtAuthService
  ) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: [this.data.username, RequiredValidator],
      password: [this.data.password, RequiredValidator]
    })
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onLOgin(): void {
    this.auths.login(this.data.username, this.data.password)
      .then(_ => console.log("User logged in with uname: ", this.data.username))
      .catch(err => console.error("Login failed with: ", err));
    this.dialogRef.close();
  }

}
