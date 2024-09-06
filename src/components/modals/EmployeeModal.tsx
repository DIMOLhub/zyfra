import React, { useCallback, useEffect, useMemo } from 'react';
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

const newEmployeeId = Date.now().toString();

const defaultEmployee: Omit<Employee, 'id'> = {
  firstName: '',
  lastName: '',
  middleName: '',
  birthDate: null,
  gender: EGender.Male,
  position: '',
  driverLicense: ELicenseStatus.No,
  departmentId: null,
}

const EmployeeModal: React.FC<EmployeeModalProps> = ({ isOpen, onRequestClose, employee, departmentId }) => {
  const [form] = Form.useForm();
  const [addEmployee] = useAddEmployeeMutation();
  const [updateEmployee] = useUpdateEmployeeMutation();
  const { data: departments } = useGetDepartmentsQuery(null);

  const initialFieldValues = useMemo(() => {
    if (!employee) {
      return {
        ...defaultEmployee,
        id: Date.now().toString(),
        departmentId: departmentId,
      }
    };

    console.log('employee', employee)
    const res = {
      ...employee,
      birthDate: employee.birthDate ? dayjs(employee.birthDate) : '',
      departmentId: employee.departmentId || departmentId,
    }
    console.log('res', res)
    return res;
  }, [employee, departmentId])

  console.log('initialFieldValues', initialFieldValues)

  const handleSubmit = useCallback(async (values: any) => {
    const newEmployee: Employee = {
      ...values,
      id: employee?.id || Date.now().toString(),
      birthDate: values.birthDate ? values.birthDate.toISOString() : '',
    };

    console.log('newEmployee', newEmployee)

    try {
      if (employee) {
        console.log('employee', employee)
        await updateEmployee(newEmployee).unwrap();
      } else {
        await addEmployee(newEmployee).unwrap();
      }

      onRequestClose();
    } catch (error) {
      console.error('Ошибка при сохранении сотрудника:', error);
    }
  }, [employee, updateEmployee, addEmployee, onRequestClose]);

  useEffect(() => {
    form.setFieldsValue(initialFieldValues);
  }, [form, employee, isOpen]);

  return (
    <Modal
      title={employee ? "Редактировать сотрудника" : "Добавить сотрудника"}
      open={isOpen}
      onCancel={onRequestClose}
      destroyOnClose
      footer={[
        <Button key="cancel" onClick={onRequestClose}>Отмена</Button>,
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
            {departments && departments.map(department => {
              // console.log('department', department)
              return (<Select.Option key={department.id} value={department.id}>
                {department.name}
              </Select.Option>)
            }
            )}
          </Select>
        </Form.Item>
      </Form>
    </Modal >
  );
};

export default EmployeeModal;