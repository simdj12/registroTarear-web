import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-global-loading',
  templateUrl: './global-loading.component.html',
  styleUrls: ['./global-loading.component.scss']
})
export class GlobalLoadingComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}

export function globalLoading(dialog: MatDialog){
  return dialog.open(
    GlobalLoadingComponent,
    {
      panelClass: 'custom-dialog',
      backdropClass: 'bdc',
      disableClose: true,
    }
  );
}
