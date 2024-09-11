import React, { useCallback, useEffect, useMemo } from 'react';
import { Modal, Form, Input, DatePicker, Radio, Button, Select } from 'antd';
import { Employee } from '../../types/common';
import { ELicenseStatus, EGender } from '../../types/enums';
import { GenderLocale, LicenseStatusLocale } from '../../types/locales';
import { useAddEmployeeMutation, useUpdateEmployeeMutation } from '../../services/employeeApi';
import { useGetDepartmentsQuery } from '../../services/departmentApi';
import dayjs from 'dayjs';

interface EmployeeModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  employee: Employee | null;
  departmentId: string;
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

    const res = {
      ...employee,
      birthDate: employee.birthDate ? dayjs(employee.birthDate) : '',
      departmentId: employee.departmentId || departmentId,
    }
    return res;
  }, [employee, departmentId])

  const handleSubmit = useCallback(async (values: any) => {
    const newEmployee: Employee = {
      ...values,
      id: employee?.id || Date.now().toString(),
      birthDate: values.birthDate ? values.birthDate.toISOString() : '',
    };

    try {
      if (employee) {
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
            <Radio value={EGender.Male}>{GenderLocale[EGender.Male]}</Radio>
            <Radio value={EGender.Female}>{GenderLocale[EGender.Female]}</Radio>
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
            <Radio value={ELicenseStatus.Yes}>{LicenseStatusLocale[ELicenseStatus.Yes]}</Radio>
            <Radio value={ELicenseStatus.No}>{LicenseStatusLocale[ELicenseStatus.No]}</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item
          name="departmentId"
          label="Подразделение"
          rules={[{ required: true, message: 'Выберите подразделение' }]}
        >
          <Select>
            {departments && departments.map(department => {
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