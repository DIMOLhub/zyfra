import React, { useState, useEffect } from 'react';
import { Modal, Input, DatePicker, Form, Button, Select, notification } from 'antd';
import { useAddDepartmentMutation, useUpdateDepartmentMutation, useGetDepartmentsQuery } from '../../services/departmentApi';
import { Department, ID } from '../../types/common';
import dayjs, { Dayjs } from 'dayjs';

interface DepartmentModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  department: Department | null;
}

const DepartmentModal: React.FC<DepartmentModalProps> = ({ isOpen, onRequestClose, department }) => {
  const [name, setName] = useState('');
  const [formationDate, setFormationDate] = useState<Dayjs | null>(null);
  const [description, setDescription] = useState('');
  const [parentId, setParentId] = useState<ID | null>(null);

  const { data: departments } = useGetDepartmentsQuery(null); // Получаем все подразделения
  const [addDepartment] = useAddDepartmentMutation();
  const [updateDepartment] = useUpdateDepartmentMutation();

  useEffect(() => {
    if (department) {
      setName(department.name);
      setFormationDate(department.formationDate ? dayjs(department.formationDate) : null);
      setDescription(department.description);
      setParentId(department.parentId ?? null);
    } else {
      setName('');
      setFormationDate(null);
      setDescription('');
      setParentId(null);
    }
  }, [department]);

  // Функция для поиска всех дочерних подразделений
  const findChildDepartments = (departmentId: ID | null): ID[] => {
    const childDepartments: ID[] = [];
    const findChildren = (parentId: ID) => {
      const children = departments?.filter(dept => dept.parentId === parentId);
      children?.forEach(child => {
        childDepartments.push(child.id);
        findChildren(child.id); // Рекурсивно находим детей
      });
    };
    if (departmentId) {
      findChildren(departmentId);
    }
    return childDepartments;
  };

  // Все дочерние подразделения текущего подразделения
  const childDepartmentIds = department ? findChildDepartments(department.id) : [];

  const handleSubmit = async () => {
    if (!name || !formationDate) {
      notification.error({
        message: 'Ошибка',
        description: 'Заполните все обязательные поля.',
      });
      return;
    }

    console.log('department?.id', department?.id, Date.now().toString());
    const newDepartment: Department = {
      id: department?.id || Date.now().toString(),
      name,
      formationDate: formationDate ? formationDate.format('YYYY-MM-DD') : '',
      description,
      parentId: parentId ?? null,
    };

    try {
      console.log('department', department)
      if (department && department.id !== null) {
        console.log('updateDepartment')
        console.log('newDepartment', newDepartment)
        await updateDepartment(newDepartment).unwrap();
      } else {
        console.log('addDepartment')
        console.log('newDepartment', newDepartment)
        await addDepartment(newDepartment).unwrap();
        setName('');
        setFormationDate(null);
        setDescription('');
        setParentId(null);
      }
      onRequestClose();
      notification.success({
        message: 'Успех',
        description: 'Подразделение успешно сохранено.',
      });
    } catch (error) {
      console.error('Ошибка при сохранении подразделения:', error);
      notification.error({
        message: 'Ошибка',
        description: 'Произошла ошибка при сохранении подразделения.',
      });
    }
  };

  return (
    <Modal
      title={department ? 'Редактировать подразделение' : 'Добавить подразделение'}
      open={isOpen}
      onCancel={onRequestClose}
      footer={[
        <Button key="cancel" onClick={onRequestClose}>
          Отмена
        </Button>,
        <Button key="submit" type="primary" onClick={handleSubmit}>
          Сохранить
        </Button>,
      ]}
    >
      <Form layout="vertical">
        <Form.Item label="Наименование" required>
          <Input value={name}
            onChange={e => setName(e.target.value)}
            required
          />
        </Form.Item>
        <Form.Item label="Дата формирования" required>
          <DatePicker
            value={formationDate}
            onChange={date => setFormationDate(date)}
            format="YYYY-MM-DD"
            required
          />
        </Form.Item>
        <Form.Item label="Описание">
          <Input.TextArea
            value={description}
            onChange={e => setDescription(e.target.value)} />
        </Form.Item>
        <Form.Item label="Родительское подразделение">
          <Select
            value={parentId}
            onChange={setParentId}
            allowClear
          >
            {departments
              ?.filter(dept => dept.id !== department?.id && !childDepartmentIds.includes(dept.id)) // Исключаем текущее и дочерние подразделения
              .map(dept => (
                <Select.Option key={dept.id} value={dept.id}>
                  {dept.name}
                </Select.Option>
              ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default DepartmentModal;