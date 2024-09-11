import React, { useEffect, useState } from 'react';
import { Modal, Input, DatePicker, Form, Button, Select, notification } from 'antd';
import { useAddDepartmentMutation, useUpdateDepartmentMutation, useGetDepartmentsQuery } from '../../services/departmentApi';
import { Department } from '../../types/common';
import dayjs from 'dayjs';
import { findChildDepartments } from '../../types/departmentUtils';

interface DepartmentModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  department: Department | null;
}

const DepartmentModal: React.FC<DepartmentModalProps> = ({ isOpen, onRequestClose, department }) => {
  const [form] = Form.useForm();
  const { data: departments } = useGetDepartmentsQuery(null);
  const [addDepartment] = useAddDepartmentMutation();
  const [updateDepartment] = useUpdateDepartmentMutation();
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (department) {
      form.setFieldsValue({
        name: department.name,
        formationDate: department.formationDate ? dayjs(department.formationDate) : undefined,
        description: department.description,
        parentId: department.parentId ?? undefined,
      });
    } else {
      form.resetFields();
    }
  }, [department, form]);

  const childDepartmentIds = department ? findChildDepartments(department?.id, departments) : [];

  const filteredDepartments = departments?.filter(dept => {
    const matchesSearch = dept.name.toLowerCase().includes(searchTerm.toLowerCase());
    const isNotChild = !childDepartmentIds.includes(dept.id);
    const isNotCurrent = dept.id !== department?.id;

    return matchesSearch && isNotChild && isNotCurrent;
  });

  const handleSubmit = async (values: any) => {
    setLoading(true);
    
    const newDepartment: Department = {
      id: department?.id || Date.now().toString(),
      ...values,
      formationDate: values.formationDate ? values.formationDate.format('YYYY-MM-DD') : '',
      parentId: values.parentId ?? null,
    };

    try {
      if (department && department.id !== null) {
        await updateDepartment(newDepartment).unwrap();
      } else {
        await addDepartment(newDepartment).unwrap();
        form.resetFields();
      }
      onRequestClose();
      notification.success({
        message: 'Успех',
        description: 'Подразделение успешно сохранено.',
      });
    } catch (error) {
      notification.error({
        message: 'Ошибка',
        description: 'Произошла ошибка при сохранении подразделения.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={department && department.id !== null ? 'Редактировать подразделение' : 'Добавить подразделение'}
      open={isOpen}
      onCancel={onRequestClose}
      footer={[
        <Button key="cancel" onClick={onRequestClose}>
          Отмена
        </Button>,
        <Button key="submit" type="primary" onClick={() => form.submit()} loading={loading}>
          Сохранить
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item label="Наименование" name="name" rules={[{ required: true, message: 'Введите наименование' }]} required>
          <Input maxLength={50} showCount required />
        </Form.Item>
        <Form.Item label="Дата формирования" name="formationDate" rules={[{ required: true, message: 'Выберите дату формирования' }]}>
          <DatePicker format="YYYY-MM-DD" />
        </Form.Item>
        <Form.Item label="Описание" name="description">
          <Input.TextArea maxLength={200} showCount />
        </Form.Item>
        <Form.Item label="Родительское подразделение" name="parentId">
          <Select allowClear>
            {filteredDepartments?.map(dept => (
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