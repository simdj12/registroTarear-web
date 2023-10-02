import { EquipmentFacilitiesModel } from "./equipment-facilities-model";
import { ResponsibleModel } from "./responsible-model";
import { StateWorkModel } from "./state-work-model";
import { TypeWorkModel } from "./type-work-model";

export interface WorkModel{
    id: number;
    type_work: TypeWorkModel;
    responsible: ResponsibleModel;
    state_work: StateWorkModel;
    start_date: string;
    end_date: string;
    description: string;
    equipment_facility: EquipmentFacilitiesModel;
}