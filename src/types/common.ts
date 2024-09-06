import { EGender, ELicenseStatus } from "./enums"

export type ID = string | number;

export interface Employee {
  id: ID;
  departmentId: ID | null;
  lastName: string;
  middleName: string;
  firstName: string;
  birthDate?: string | null;
  gender: EGender;
  position: ID;
  driverLicense: ELicenseStatus;
}

export interface Department {
  id: ID | null;
  name: string;
  formationDate: ID;
  description: string;
  parentId: ID | null;
}