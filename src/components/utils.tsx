import { TreeDataNode } from 'antd';
import { Department } from '../types/common';
import React from 'react';

export const buildTreeData = (departments: Department[] | undefined, parentId: string | null = null): TreeDataNode[] => {
  return (departments || [])
    .filter(department => department.parentId === parentId)
    .map(department => ({
      title: <span title={department.name}>{department.name}</span>,
      key: String(department.id),
      children: buildTreeData(departments, department.id),
    }));
};