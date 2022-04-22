import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { UserService } from 'src/app/services/user.service';
import { GlobalContanst } from 'src/app/shared/global-constants';

@Component({
  selector: 'app-manage-user',
  templateUrl: './manage-user.component.html',
  styleUrls: ['./manage-user.component.scss']
})
export class ManageUserComponent implements OnInit {
  displayedColumns: string[] = ['name', 'email', 'contactNumber', 'status'];
  dataSource: any;
  responseMessage: any;

  constructor(private userService: UserService, private snackbar: SnackbarService) { }

  ngOnInit(): void {
    this.tableData();
  }


  tableData() {
    this.userService.getUsers().subscribe((res: any) => {
      this.dataSource = new MatTableDataSource(res);
    }, (err: any) => {
      if (err.error?.message) {
        this.responseMessage = err.error?.message;
      }
      else {
        this.responseMessage = GlobalContanst.genericError;
      }
      this.snackbar.openSnackBar(this.responseMessage, GlobalContanst.error);
    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  handleChangeAction(status:any,id:any){
    var data = {
      status : status.toString(),
      id: id
    }

    this.userService.update(data).subscribe((res:any)=>{
      this.responseMessage = res?.message;
      this.snackbar.openSnackBar(this.responseMessage,"success");
    },(err:any)=>{
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
