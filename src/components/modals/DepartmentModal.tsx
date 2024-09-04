import React, { useState, useEffect } from 'react';
import { Modal, Input, DatePicker, Form, Button, Select } from 'antd';
import { useAddDepartmentMutation, useUpdateDepartmentMutation, useGetDepartmentsQuery } from '../../services/departmentApi';
import { Department, ID } from '../../types/common';
import moment, { Moment } from 'moment';
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

  const handleSubmit = async () => {
    const newDepartment: Department = {
      id: department?.id || Date.now().toString(), // id должен быть строкой
      name,
      formationDate: formationDate ? formationDate.format('YYYY-MM-DD') : '',
      description,
      parentId: parentId ?? null,
    };

    try {
      if (department) {
        await updateDepartment(newDepartment).unwrap();
      } else {
        await addDepartment(newDepartment).unwrap();
        setName('');
        setFormationDate(null);
        setDescription('');
        setParentId(null);
      }
      onRequestClose();
    } catch (error) {
      console.error('Ошибка при сохранении подразделения:', error);
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
          <Input value={name} onChange={e => setName(e.target.value)} />
        </Form.Item>
        <Form.Item label="Дата формирования" required>
          <DatePicker
            value={formationDate}
            onChange={date => setFormationDate(date)}
            format="YYYY-MM-DD"
          />
        </Form.Item>
        <Form.Item label="Описание">
          <Input.TextArea value={description} onChange={e => setDescription(e.target.value)} />
        </Form.Item>
        <Form.Item label="Родительское подразделение">
          <Select
            value={parentId}
            onChange={setParentId}
            allowClear
          >
            {departments?.map(dept => (
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