import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { SnackbarService } from '../services/snackbar.service';
import { UserService } from '../services/user.service';
import { GlobalContanst } from '../shared/global-constants';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  signupForm: any = FormGroup;
  responseMessage: any;

  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private userService: UserService,
    private snackbar: SnackbarService,
    private dialogRef: MatDialogRef<SignupComponent>
  ) { }

  ngOnInit(): void {
    this.signupForm = this.formBuilder.group({
      name: [null, [Validators.required, Validators.pattern(GlobalContanst.nameRegex)]],
      email: [null, [Validators.required, Validators.pattern(GlobalContanst.emailRegex)]],
      contactNumber: [null, [Validators.required, Validators.pattern(GlobalContanst.contanctNumberRegex)]],
      password: [null, [Validators.required]]

    })
  }

  handleSubmit() {
    var formData = this.signupForm.value;
    var data = {
      name: formData.name,
      email: formData.email,
      contactNumber: formData.contactNumber,
      password: formData.password
    }
    this.userService.signup(data).subscribe((res: any) => {
      this.dialogRef.close();
      this.responseMessage = res?.message;
      this.snackbar.openSnackBar(this.responseMessage, "");
      this.router.navigate(['/']);
    },(error) => {
        if (error.error?.message) {
          this.responseMessage = error.error?.message;
        }
        else {
          this.responseMessage = GlobalContanst.genericError;
        }
        this.snackbar.openSnackBar(this.responseMessage, GlobalContanst.error);
      }
    )
  }

}
