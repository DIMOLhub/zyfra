import React, { FC, useEffect, useState } from 'react';
import { useDeleteEmployeeByIdMutation, useFetchEmployeesQuery } from '../services/employeeApi';
import { Spin, Table } from 'antd';
import { Employee } from '../types/common';
import EmployeeModal from './modals/EmployeeModal';
import { employeeColumns } from './columnsConfig';
import EmployeeToolbar from './modals/EmployeeToolbar';

interface EmployeeTableProps {
  departmentId: string;
}

const EmployeeTable: FC<EmployeeTableProps> = ({ departmentId }) => {
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const { data: employees, isLoading } = useFetchEmployeesQuery(null);
  const [deleteEmployeeById] = useDeleteEmployeeByIdMutation();

  const filteredEmployees: Employee[] = employees?.filter(emp => emp.departmentId === departmentId) ?? [];

  useEffect(() => {
    setSelectedEmployeeId(null);
  }, [departmentId]);

  const handleEdit = () => {
    if (selectedEmployeeId) {
      const employee = filteredEmployees.find(emp => emp.id === selectedEmployeeId);
      if (employee) {
        setEditingEmployee(employee);
        setIsModalVisible(true);
      }
    }
  };

  const handleDelete = async () => {
    if (!selectedEmployeeId) return;
    try {
      await deleteEmployeeById(selectedEmployeeId).unwrap();
      setSelectedEmployeeId(null);
    } catch (error) {
      console.log('Ошибка при удалении сотрудника:', error);
    }
  };

  const handleAdd = () => {
    setEditingEmployee(null);
    setIsModalVisible(true);
  };

  const handleRowClick = (record: Employee) => {
    setSelectedEmployeeId(record.id);
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '20px' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div>
      <EmployeeToolbar
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        isEditDisabled={!selectedEmployeeId}
        isDeleteDisabled={!selectedEmployeeId}
      />
      <div className="table-content">
        <Table
          bordered
          dataSource={filteredEmployees}
          columns={employeeColumns}
          pagination={{
            position: ['bottomRight'],
            pageSize: 13,
          }}
          scroll={{ x: 1200 }}
          rowKey="id"
          onRow={(record) => ({
            onClick: () => handleRowClick(record),
          })}
          rowClassName={(record) =>
            record.id === selectedEmployeeId ? 'selected-row' : ''
          }
        />
      </div>
      <EmployeeModal
        isOpen={isModalVisible}
        onRequestClose={closeModal}
        employee={editingEmployee}
        departmentId={departmentId}
      />
    </div>
  );
};

export default EmployeeTable;