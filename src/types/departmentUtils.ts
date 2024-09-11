import { Department } from './common';

export const findChildDepartments = (departmentId: string | null, departments: Department[] | null): string[] => {
  const childDepartments: string[] = [];

  const findChildren = (parentId: string) => {
    const children = departments?.filter(dept => dept.parentId === parentId);
    children?.forEach(child => {
      if (child.id) {
        childDepartments.push(child.id);
        findChildren(child.id);
      }
    });
  };

  if (departmentId) {
    findChildren(departmentId);
  }

  return childDepartments;
};