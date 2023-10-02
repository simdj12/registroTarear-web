import { CompanyModel } from "./company-model";

export interface ResponsibleModel{
    id: number;
    company: CompanyModel;
    document_id: string;
    name: string;
}