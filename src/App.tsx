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
    setEditingDepartment(null);
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

  const handleDeleteDepartment = async () => {
    if (selectedDepartmentId !== null) {
      Modal.confirm({
        title: 'Вы уверены, что хотите удалить это подразделение?',
        onOk: async () => {
          await deleteDepartment(selectedDepartmentId);
          setSelectedDepartmentId(null);
          refetch(); // Обновить данные после удаления
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
          style={{ margin: '16px' }}
          onClick={handleEditDepartment}
          disabled={selectedDepartmentId === null}
        >
          Редактировать
        </Button>
        <Button
          type="primary"
          style={{ margin: '16px' }}
          onClick={handleDeleteDepartment}
          disabled={selectedDepartmentId === null}
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


// Реализуйте эту функцию для получения отдела по его ID, например, из API или состояния:
const getDepartmentById = (id: number): Department | null => {
  const { data: departments } = useGetDepartmentsQuery(null);
  if (departments) {
    return departments.find(department => department.id === id) || null;
  }
  return null; // Заглушка, замените на реальную логику
};
// Главный компонент App: Управляет состоянием выбранного подразделения и 
// передает его ID в компонент EmployeeTable для отображения  сотрудников.
