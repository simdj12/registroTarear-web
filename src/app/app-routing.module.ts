import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './core/auth/login/login.component';
import { RegisterComponent } from './core/auth/register/register.component';
import { MainNavComponent } from './shared/main-nav/main-nav.component';
import { EquipmentFacilitiesComponent } from './pages/equipment-facilities/equipment-facilities.component';
import { FloorComponent } from './pages/floor/floor.component';
import { CompanyComponent } from './pages/company/company.component';
import { ResponsibleComponent } from './pages/responsible/responsible.component';
import { TypeWorkComponent } from './pages/type-work/type-work.component';
import { StateWorkComponent } from './pages/state-work/state-work.component';
import { WorkComponent } from './pages/work/work.component';
import { WorkDoneComponent } from './pages/work-done/work-done.component';
import { WorkUndoneComponent } from './pages/work-undone/work-undone.component';
import { NoConnectedGuard } from './core/guards/no-connected.guard';
import { ConnectedGuard } from './core/guards/connected.guard';

const routes: Routes = [
  {path: 'login', component: LoginComponent, canActivate: [NoConnectedGuard]},
  {path: 'register', component: RegisterComponent, canActivate: [NoConnectedGuard]},
  {path: '', canActivate: [ConnectedGuard], component: MainNavComponent, children: [
    {path: 'home', component: HomeComponent},
    {path: 'equipment_facilities', component: EquipmentFacilitiesComponent},
    {path: 'floor', component: FloorComponent},
    {path: 'company', component: CompanyComponent},
    {path: 'responsible', component: ResponsibleComponent},
    {path: 'type_work', component: TypeWorkComponent},
    {path: 'state_work', component: StateWorkComponent},
    {path: 'work', component: WorkComponent},
    {path: 'work_done', component: WorkDoneComponent},
    {path: 'work_undone', component: WorkUndoneComponent},
    {path: '**', redirectTo: 'home'},
  ]},
  {path: '**', redirectTo: 'login'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
