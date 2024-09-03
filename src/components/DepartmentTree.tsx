// отобржает подразделения
import React from 'react';
import { Tree, TreeDataNode } from 'antd';
import { Department, ID } from '../types/common';
import '../App.css';
import { useGetDepartmentsQuery, useUpdateDepartmentMutation } from '../services/departmentApi';

const DepartmentTree: React.FC<{ onSelect: (id: ID) => void }> = ({ onSelect }) => {
  const { data: departments, refetch } = useGetDepartmentsQuery(null);
  const [updateDepartment] = useUpdateDepartmentMutation();
  const handleSelect = (selectedKeys: React.Key[], info: any) => {
    if (selectedKeys.length > 0) {
      onSelect(selectedKeys[0] as ID); // передаем выбранный ID
    }
  };

  // Построение данных для дерева
  const buildTreeData = (departments: Department[] | undefined, parentId: ID | null = null): TreeDataNode[] => {
    return (departments || [])
      .filter(department => department.parentId === parentId)
      .map(department => ({
        title: department.name,
        key: department.id,
        children: buildTreeData(departments, department.id),
      }));
  };

  const treeData = buildTreeData(departments);

  // Обработка перемещения узлов
  const handleDrop = async (info: any) => {
    const dragKey = String(info.dragNode.key);
    const dropKey = String(info.node.key);
    const dropToGap = info.dropToGap;

    const dragDepartment = departments?.find(dept => dept.id === dragKey);
    if (dragDepartment) {
      let updatedParentId: ID | null = null;

      if (!dropToGap) {
        updatedParentId = dropKey;
      } else {
        const dropNode = departments?.find(dept => dept.id === dropKey);
        if (dropNode) {
          updatedParentId = dropNode.parentId;
        }
      }

      const updatedDepartment = { ...dragDepartment, parentId: updatedParentId };

      await updateDepartment(updatedDepartment);
      refetch();
    }
  };

  return (
    <Tree
      style={{ background: '' }}
      treeData={treeData}
      defaultExpandAll
      draggable
      onDrop={handleDrop}
      onSelect={handleSelect}
    />
  );
};

export default DepartmentTree;