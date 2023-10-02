import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { EquipmentFacilitiesComponent } from './equipment-facilities/equipment-facilities.component';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { EquipmentFacilitiesModalComponent } from './equipment-facilities-modal/equipment-facilities-modal.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { FloorModalComponent } from './floor-modal/floor-modal.component';
import { FloorComponent } from './floor/floor.component';
import { CompanyComponent } from './company/company.component';
import { CompanyModalComponent } from './company-modal/company-modal.component';
import { ResponsibleComponent } from './responsible/responsible.component';
import { ResponsibleModalComponent } from './responsible-modal/responsible-modal.component';
import { TypeWorkComponent } from './type-work/type-work.component';
import { TypeWorkModalComponent } from './type-work-modal/type-work-modal.component';
import { StateWorkComponent } from './state-work/state-work.component';
import { StateWorkModalComponent } from './state-work-modal/state-work-modal.component';
import { WorkComponent } from './work/work.component';
import { WorkModalComponent } from './work-modal/work-modal.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DATE_FORMATS, MAT_DATE_LOCALE, MAT_NATIVE_DATE_FORMATS, MatDateFormats, MatNativeDateModule, NativeDateModule } from '@angular/material/core';
import { WorkDoneComponent } from './work-done/work-done.component';
import { CustomPaginatorIntl } from '../core/services/custom-paginator.service';
import { WorkUndoneComponent } from './work-undone/work-undone.component';
import { MatTooltipModule } from '@angular/material/tooltip';

export const MY_FORMATS: MatDateFormats = {
  parse: {
      dateInput: 'DD-MM-YYYY',
  },
  display: {
      dateInput: 'DD-MM-YYYY',
      monthYearLabel: 'MMM YYYY',
      dateA11yLabel: 'LL',
      monthYearA11yLabel: 'MMMM YYYY',
  },
};
@NgModule({
  declarations: [
    HomeComponent,
    EquipmentFacilitiesComponent,
    EquipmentFacilitiesModalComponent,
    FloorModalComponent,
    FloorComponent,
    CompanyComponent,
    CompanyModalComponent,
    ResponsibleComponent,
    ResponsibleModalComponent,
    TypeWorkComponent,
    TypeWorkModalComponent,
    StateWorkComponent,
    StateWorkModalComponent,
    WorkComponent,
    WorkModalComponent,
    WorkDoneComponent,
    WorkUndoneComponent
  ],
  imports: [
    CommonModule,
    MatCardModule,
    MatDividerModule,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTooltipModule,
  ],
  providers: [
    {provide: MAT_DATE_LOCALE, useValue: 'es-VE'},
    { provide: MAT_DATE_FORMATS, useValue: {
        display: {
          dateInput: 'DD/MM/YYYY'
        }
      }
    },
    {
      provide: MatPaginatorIntl,
      useClass: CustomPaginatorIntl,
    }
  ]
})
export class PagesModule { }
