import { EGender, ELicenseStatus } from "./enums"

export interface Employee {
  id: string;
  departmentId: string | null;
  lastName: string;
  middleName: string;
  firstName: string;
  birthDate?: string | null;
  gender: EGender;
  position: string;
  driverLicense: ELicenseStatus;
}

export interface Department {
  id: string | null;
  name: string;
  formationDate: string;
  description: string;
  parentId: string | null;
}