import { FloorModel } from "./floor-model";

export interface EquipmentFacilitiesModel{
    id: number;
    name: string;
    floor: FloorModel;
    description: string;
}