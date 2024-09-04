// отображает сотрудников
import React, { FC, useState } from 'react';
import { useDeleteEmployeeByIdMutation, useFetchEmployeesQuery } from '../services/employeeApi';
import { Button, Table } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { Employee, ID } from '../types/common';
import EmployeeModal from './modals/EmployeeModal';
import '../App.css';
import moment from 'moment';
import dayjs from 'dayjs';

interface EmployeeTableProps {
  departmentId: ID;
}

const columns: ColumnsType<Employee> = [
  {
    title: 'Фамилия',
    dataIndex: 'lastName',
    key: 'lastName',
    width: 150,
    ellipsis: {
      showTitle: false,
    },
  },
  {
    title: 'Имя',
    dataIndex: 'firstName',
    key: 'firstName',
    width: 150,
    ellipsis: {
      showTitle: false,
    },
  },
  {
    title: 'Отчество',
    dataIndex: 'middleName',
    key: 'middleName',
    width: 150,
    ellipsis: {
      showTitle: false,
    },
  },
  {
    title: 'Дата рождения',
    dataIndex: 'birthDate',
    key: 'birthDate',
    width: 140,
    ellipsis: {
      showTitle: false,
    },
    render: (date) => date ? dayjs(date).format('DD.MM.YYYY') : 'Не указана',
  },
  {
    title: 'Пол',
    dataIndex: 'gender',
    key: 'gender',
    width: 100,
    ellipsis: {
      showTitle: false,
    },
  },
  {
    title: 'Должность',
    dataIndex: 'position',
    key: 'position',
    width: 200,
    ellipsis: {
      showTitle: false,
    },
  },
  {
    title: 'Водительские права',
    dataIndex: 'driverLicense',
    key: 'driverLicense',
    width: 120,
    ellipsis: {
      showTitle: false,
    },
    render: (_, record) => (record.driverLicense ? 'Да' : 'Нет'),
  },
];

const EmployeeTable: FC<EmployeeTableProps> = ({ departmentId }) => {
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<ID | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const { data: employees, isLoading } = useFetchEmployeesQuery(null);
  const [deleteEmployeeById] = useDeleteEmployeeByIdMutation();

  const filteredEmployees: Employee[] = employees?.filter(emp => emp.departmentId === departmentId) ?? [];

  const handleEdit = () => {
    if (!selectedEmployeeId) return;
    const employee = filteredEmployees.find(emp => emp.id === selectedEmployeeId);
    if (employee) {
      setEditingEmployee(employee);
      setIsModalVisible(true);
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
    setEditingEmployee(null); // Новый сотрудник
    setIsModalVisible(true);
  };

  const handleRowClick = (record: Employee) => {
    setSelectedEmployeeId(record.id); // Устанавливаем строковый ID
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };

  if (isLoading) return <div>Загрузка...</div>;

  return (
    <div>
      <Button
        onClick={handleAdd}
        className="butEmp"
      >
        Добавить
      </Button>
      <Button
        onClick={handleEdit}
        className="butEmp"
        disabled={selectedEmployeeId === null}
      >
        Редактировать
      </Button>
      <Button
        onClick={handleDelete}
        className="butEmp"
        disabled={selectedEmployeeId === null}
      >
        Удалить
      </Button>
      <Table
        bordered
        dataSource={filteredEmployees}
        columns={columns}
        rowKey="id"
        pagination={{pageSize: 13}}
        onRow={(record) => ({
          onClick: () => handleRowClick(record),
        })}
        rowClassName={(record) =>
          record.id === selectedEmployeeId ? 'selected-row' : ''
        }
      />
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