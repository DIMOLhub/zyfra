import React, { useState, useEffect } from 'react';
import { Modal, Input, DatePicker, Form, Button } from 'antd';
import { useAddDepartmentMutation, useUpdateDepartmentMutation } from '../../services/departmentApi';
import { Department, ID } from '../../types/common';
import moment, { Moment } from 'moment';

interface DepartmentModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  department: Department | null;
  parentId?: ID | null;
}

const DepartmentModal: React.FC<DepartmentModalProps> = ({ isOpen, onRequestClose, department, parentId }) => {
  const [name, setName] = useState('');
  const [formationDate, setFormationDate] = useState<Moment | null>(null);
  const [description, setDescription] = useState('');
  const [addDepartment] = useAddDepartmentMutation();
  const [updateDepartment] = useUpdateDepartmentMutation();

  useEffect(() => {
    if (department) {
      setName(department.name);
      setFormationDate(department.formationDate ? moment(department.formationDate) : null);
      setDescription(department.description);
    } else {
      setName('');
      setFormationDate(null);
      setDescription('');
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
        await updateDepartment(newDepartment).unwrap;
      } else {
        await addDepartment(newDepartment).unwrap;
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
      </Form>
    </Modal>
  );
};
export default DepartmentModal;