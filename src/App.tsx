import React, { useState } from 'react';
import './App.css';
import DepartmentTree from './components/DepartmentTree';
import EmployeeTable from './components/EmployeeTable';
import Layout from 'antd/es/layout';
import { Button, Modal } from 'antd';
import DepartmentModal from './components/modals/DepartmentModal';
import { Department, ID } from './types/common';
import { useDeleteDepartmentMutation, useGetDepartmentsQuery } from './services/departmentApi';

const { Sider, Content } = Layout;

const App: React.FC = () => {
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<ID | null>(null);
  const [isDepartmentModalVisible, setIsDepartmentModalVisible] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);
  const [deleteDepartment] = useDeleteDepartmentMutation();
  const { data: departments, refetch } = useGetDepartmentsQuery(null);

  const getDepartmentById = (id: ID): Department | null => {
    return departments ? departments.find(dept => dept.id === id) || null : null;
  };

  const handleAddDepartment = () => {
    setEditingDepartment({
      id: null,
      name: '',
      formationDate: '',
      description: '',
      parentId: selectedDepartmentId || null,
    });
    setIsDepartmentModalVisible(true);
  };

  const handleEditDepartment = () => {
    if (selectedDepartmentId !== null) {
      const department = getDepartmentById(selectedDepartmentId);
      if (department) {
        setEditingDepartment(department);
        setIsDepartmentModalVisible(true);
      }
    }
  };

  const deleteDepartmentWithChildren = async (id: ID) => {
    const childDepartments = departments?.filter(dept => dept.parentId === id) || [];
    for (const child of childDepartments) {
      await deleteDepartmentWithChildren(child.id);
    }
    await deleteDepartment(id);
  };

  const handleDeleteDepartment = async () => {
    if (selectedDepartmentId !== null) {
      Modal.confirm({
        title: 'Вы уверены, что хотите удалить это подразделение и все его подчиненные подразделения?',
        onOk: async () => {
          await deleteDepartmentWithChildren(selectedDepartmentId);
          setSelectedDepartmentId(null);
          refetch();
        },
      });
    }
  };

  return (
    <Layout style={{ height: '100vh' }}>
      <Sider width={400}>
        <Button type="primary" style={{ margin: '16px' }} onClick={handleAddDepartment}>
          Добавить
        </Button>
        <Button
          type="primary"
          style={{ margin: '16px', color: "white" }}
          onClick={handleEditDepartment}
          disabled={!selectedDepartmentId}
        >
          Редактировать
        </Button>
        <Button
          type="primary"
          style={{ margin: '16px', color: "white" }}
          onClick={handleDeleteDepartment}
          disabled={!selectedDepartmentId}
        >
          Удалить
        </Button>
        <DepartmentTree onSelect={setSelectedDepartmentId} />
      </Sider>
      <Layout>
        <Content style={{ margin: '16px' }}>
          {selectedDepartmentId !== null ? (
            <EmployeeTable departmentId={selectedDepartmentId} />
          ) : (
            <div>Выберите подразделение</div>
          )}
        </Content>
      </Layout>
      <DepartmentModal
        isOpen={isDepartmentModalVisible}
        onRequestClose={() => {
          setIsDepartmentModalVisible(false);
          refetch();
        }}
        department={editingDepartment}
      />
    </Layout>
  );
};

export default App;
