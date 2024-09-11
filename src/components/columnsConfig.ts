import React from 'react';
import { ColumnsType } from 'antd/es/table';
import { Employee } from '../types/common';
import dayjs from 'dayjs';

export const employeeColumns: ColumnsType<Employee> = [
  {
    title: 'Фамилия',
    dataIndex: 'lastName',
    key: 'lastName',
    width: 150,
    ellipsis: true,
  },
  {
    title: 'Имя',
    dataIndex: 'firstName',
    key: 'firstName',
    width: 150,
    ellipsis: true,
  },
  {
    title: 'Отчество',
    dataIndex: 'middleName',
    key: 'middleName',
    width: 150,
    ellipsis: true,
  },
  {
    title: 'Дата рождения',
    dataIndex: 'birthDate',
    key: 'birthDate',
    width: 140,
    ellipsis: true,
    render: (date: string) => {
      return date ? dayjs(date).format('DD.MM.YYYY') : 'Не указана';
    },
  },
  {
    title: 'Пол',
    dataIndex: 'gender',
    key: 'gender',
    width: 100,
    ellipsis: true,
  },
  {
    title: 'Должность',
    dataIndex: 'position',
    key: 'position',
    width: 200,
    ellipsis: true,
  },
  {
    title: 'Водительские права',
    dataIndex: 'driverLicense',
    key: 'driverLicense',
    width: 120,
    ellipsis: true,
    render: (_, record) => (record.driverLicense ? 'Да' : 'Нет'),
  },
];