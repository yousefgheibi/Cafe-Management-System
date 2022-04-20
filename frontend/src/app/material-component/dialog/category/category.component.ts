import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CategoryService } from 'src/app/services/category.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { GlobalContanst } from 'src/app/shared/global-constants';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {

  onAddCategory = new EventEmitter();
  onEditCategory = new EventEmitter();
  categoryForm :any = FormGroup;
  dialogAction:any = "Add";
  action:any="Add";
  responseMessage:any;

  constructor(@Inject(MAT_DIALOG_DATA) public dialogData:any,
              private formBuilder:FormBuilder,
              private categoryService:CategoryService,
              public dialogRef:MatDialogRef<CategoryComponent>,
              private snackbar:SnackbarService) { }

  ngOnInit(): void {
    this.categoryForm = this.formBuilder.group({
      name:[null,[Validators.required]]
    });

    if(this.dialogData.action === 'Edit'){
      this.dialogAction = "Edit";
      this.action = "Update";
      this.categoryForm.patchValue(this.dialogData.data);
    }
  }

  handleSubmit(){
    if(this.dialogAction == 'Edit'){
      this.edit();
    }
    else{
      this.add();
    }
  }

  edit(){
    var formData = this.categoryForm.value;
    var data = {
      id: this.dialogData.data.id,
      name: formData.name
    }

    this.categoryService.update(data).subscribe((res:any)=>{
      this.dialogRef.close();
      this.onEditCategory.emit();
      this.responseMessage = res.message;
      this.snackbar.openSnackBar(this.responseMessage,"success");
    },(err:any)=>{
      this.dialogRef.close();
      if(err.error?.message){
        this.responseMessage = err.error?.message;
      }
      else{
        this.responseMessage = GlobalContanst.genericError;
      }
      this.snackbar.openSnackBar(this.responseMessage,GlobalContanst.error);
    })
  }

  add(){
    var formData = this.categoryForm.value;
    var data = {
      name: formData.name
    }

    this.categoryService.add(data).subscribe((res:any)=>{
      this.dialogRef.close();
      this.onAddCategory.emit();
      this.responseMessage = res.message;
      this.snackbar.openSnackBar(this.responseMessage,"success");
    },(err:any)=>{
      this.dialogRef.close();
      if(err.error?.message){
        this.responseMessage = err.error?.message;
      }
      else{
        this.responseMessage = GlobalContanst.genericError;
      }
      this.snackbar.openSnackBar(this.responseMessage,GlobalContanst.error);
    })
  }

}
