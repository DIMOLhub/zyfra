import React, { useEffect } from 'react';
import { Modal, Form, Input, DatePicker, Radio, Button, Select } from 'antd';
import { Employee, ID } from '../../types/common';
import { ELicenseStatus, EGender } from '../../types/enums';
import { useAddEmployeeMutation, useUpdateEmployeeMutation } from '../../services/employeeApi';
import { useGetDepartmentsQuery } from '../../services/departmentApi';
import dayjs from 'dayjs';

interface EmployeeModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  employee: Employee | null;
  departmentId: ID;
}

const EmployeeModal: React.FC<EmployeeModalProps> = ({ isOpen, onRequestClose, employee, departmentId }) => {
  const [form] = Form.useForm();
  const [addEmployee] = useAddEmployeeMutation();
  const [updateEmployee] = useUpdateEmployeeMutation();
  const { data: departments } = useGetDepartmentsQuery(null);

  useEffect(() => {
    if (employee) {
      form.setFieldsValue({
        firstName: employee.firstName,
        lastName: employee.lastName,
        middleName: employee.middleName,
        birthDate: employee.birthDate ? dayjs(employee.birthDate) : null,
        gender: employee.gender,
        position: employee.position,
        driverLicense: employee.driverLicense,
        departmentId: employee.departmentId || departmentId,
      });
    } else {
      form.resetFields();
      form.setFieldsValue({
        gender: EGender.Male,
        driverLicense: ELicenseStatus.No,
        departmentId: departmentId,
      });
    }
  }, [employee, departmentId, form]);

  const handleSubmit = async (values: any) => {
    const newEmployee: Employee = {
      id: employee?.id || Date.now().toString(),
      departmentId: values.departmentId,
      firstName: values.firstName,
      lastName: values.lastName,
      middleName: values.middleName,
      birthDate: values.birthDate ? values.birthDate.toISOString() : '',
      gender: values.gender,
      position: values.position,
      driverLicense: values.driverLicense,
    };

    try {
      if (employee) {
        await updateEmployee(newEmployee).unwrap();
      } else {
        await addEmployee(newEmployee).unwrap();
        form.resetFields();
        form.setFieldsValue({
          gender: EGender.Male, // Сброс значений по умолчанию
          driverLicense: ELicenseStatus.No,
          departmentId: departmentId,
        });
      }
      onRequestClose();
    } catch (error) {
      console.error('Ошибка при сохранении сотрудника:', error);
    }
  };

  const handleClose = () => {
    form.resetFields();
    onRequestClose();
  };

  return (
    <Modal
      title={employee ? "Редактировать сотрудника" : "Добавить сотрудника"}
      visible={isOpen}
      onCancel={handleClose}
      footer={[
        <Button key="cancel" onClick={handleClose}>Отмена</Button>,
        <Button key="submit" type="primary" onClick={() => form.submit()}>Сохранить</Button>,
      ]}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
      >
        <Form.Item
          name="lastName"
          label="Фамилия"
          rules={[{ required: true, message: 'Введите фамилию' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="firstName"
          label="Имя"
          rules={[{ required: true, message: 'Введите имя' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="middleName"
          label="Отчество"
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="birthDate"
          label="Дата рождения"
        >
          <DatePicker format="YYYY-MM-DD" />
        </Form.Item>
        <Form.Item
          name="gender"
          label="Пол"
        >
          <Radio.Group>
            <Radio value={EGender.Male}>Мужской</Radio>
            <Radio value={EGender.Female}>Женский</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item
          name="position"
          label="Должность"
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="driverLicense"
          label="Водительские права"
        >
          <Radio.Group>
            <Radio value={ELicenseStatus.Yes}>Да</Radio>
            <Radio value={ELicenseStatus.No}>Нет</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item
          name="departmentId"
          label="Подразделение"
          rules={[{ required: true, message: 'Выберите подразделение' }]}
        >
          <Select>
            {departments && departments.map(department => (
              <Select.Option key={department.id} value={department.id}>
                {department.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EmployeeModal;