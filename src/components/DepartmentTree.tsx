import React, { useCallback, useState, useEffect } from 'react';
import { Tree, Input } from 'antd';
import '../App.less';
import { useGetDepartmentsQuery, useUpdateDepartmentMutation } from '../services/departmentApi';
import { buildTreeData } from './utils';
import { findChildDepartments } from '../types/departmentUtils';
import { Department } from '../types/common';

const { Search } = Input;

interface DepartmentTreeProps {
  onSelect: (id: string) => void;
}

const DepartmentTree: React.FC<DepartmentTreeProps> = ({ onSelect }) => {
  const { data: departments, refetch } = useGetDepartmentsQuery(null);
  const [updateDepartment] = useUpdateDepartmentMutation();
  const [searchValue, setSearchValue] = useState<string>('');
  const [filteredTreeData, setFilteredTreeData] = useState<any[]>([]);
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  useEffect(() => {
    if (departments) {
      setFilteredTreeData(buildTreeData(departments));
    }
  }, [departments]);

  const handleSelect = (selectedKeys: React.Key[]) => {
    const selectedKey = String(selectedKeys[0] || '');
    onSelect(selectedKey);
  };

  const handleDrop = useCallback(async (info: any) => {
    const dragKey = String(info.dragNode.key);
    const dropKey = String(info.node.key);
    const dropToGap = info.dropToGap;

    const dragDepartment = departments?.find(dept => dept.id === dragKey);
    if (!dragDepartment) return;

    let updatedParentId: string | null = null;

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
  }, [departments, refetch, updateDepartment]);

  const findParentDepartments = (departmentId: string, departments: Department[] | null): string[] => {
    const parents: string[] = [];
    
    const findParents = (deptId: string) => {
      const department = departments?.find(dept => dept.id === deptId);
      if (department && department.parentId) {
        parents.push(department.parentId);
        findParents(department.parentId);
      }
    };

    findParents(departmentId);
    return parents;
  };

  const handleSearch = (value: string) => {
    setSearchValue(value);
  
    if (!value) {
      setFilteredTreeData(buildTreeData(departments));
      setExpandedKeys([]);
      return;
    }

    const searchTerm = value.toLowerCase();

    const filteredDepartments = departments?.filter(department => {
      const childDepartmentIds = findChildDepartments(department.id, departments);
      
      const matchesSearch = department.name.toLowerCase().includes(searchTerm);
      const hasMatchingChildren = childDepartmentIds.some(id => {
        const child = departments?.find(dept => dept.id === id);
        return child?.name.toLowerCase().includes(searchTerm);
      });

      return matchesSearch || hasMatchingChildren;
    });

    const expandKeys = filteredDepartments?.flatMap(dept => {
      const parentKeys = findParentDepartments(dept.id, departments);
      return [dept.id, ...parentKeys];
    });

    setExpandedKeys(expandKeys || []);
    setFilteredTreeData(buildTreeData(filteredDepartments));
  };

  return (
    <div>
      <Search
        placeholder="Поиск подразделений"
        allowClear
        onSearch={handleSearch}
        style={{
          marginBottom: 8,
          width: 370,
          marginLeft: 15,
        }}
      />
      <Tree
        treeData={filteredTreeData}
        defaultExpandAll={false}
        expandedKeys={expandedKeys}
        onExpand={(keys) => setExpandedKeys(keys)}
        draggable
        onDrop={handleDrop}
        onSelect={handleSelect}
      />
    </div>
  );
};

export default DepartmentTree;