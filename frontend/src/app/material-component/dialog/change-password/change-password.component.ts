import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { UserService } from 'src/app/services/user.service';
import { GlobalContanst } from 'src/app/shared/global-constants';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
  changePasswordForm: any = FormGroup;
  responseMessage: any;

  constructor(private formBuilder: FormBuilder, private userService: UserService, public dialogRef: MatDialogRef<ChangePasswordComponent>,
    private snackbarService: SnackbarService) { }

  ngOnInit(): void {
    this.changePasswordForm = this.formBuilder.group({
      oldPassword: [null, [Validators.required]],
      newPassword: [null, [Validators.required]],
      confirmPassword: [null, [Validators.required]]
    })
  }

  validateSubmit():boolean {
    if (this.changePasswordForm.controls['newPassord'].value != this.changePasswordForm.controls['confirmPassword'].value) {
      return true;
    }
    else {
      return false;
    }
  }

  handleChangePawwordSubmit() {
    var formData = this.changePasswordForm.value;
    var data = {
      oldPassword: formData.oldPassword,
      newPassword: formData.newPassord,
      confirmPassword: formData.confirmPassword
    }
    this.userService.changePassword(data).subscribe((res:any)=>{
      this.responseMessage = res?.message;
      this.dialogRef.close();
      this.snackbarService.openSnackBar(this.responseMessage,"success");
    },(error)=>{
     console.log(error);
     if(error.error?.message){
      this.responseMessage = error.error?.message;
     }
     else{
       this.responseMessage = GlobalContanst.genericError;
     }
     this.snackbarService.openSnackBar(this.responseMessage,GlobalContanst.error)
    })
  }

}
