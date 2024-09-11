import React from 'react';
import { Button } from 'antd';

interface EmployeeToolbarProps {
  onAdd: () => void;
  onEdit: () => void;
  onDelete: () => void;
  isEditDisabled: boolean;
  isDeleteDisabled: boolean;
}

const EmployeeToolbar: React.FC<EmployeeToolbarProps> = ({ onAdd, onEdit, onDelete, isEditDisabled, isDeleteDisabled }) => {
  return (
    <div style={{ marginBottom: '16px' }}>
      <Button onClick={onAdd} type="primary" style={{ marginRight: '8px' }}>
        Добавить
      </Button>
      <Button onClick={onEdit} disabled={isEditDisabled} style={{ marginRight: '8px' }}>
        Редактировать
      </Button>
      <Button onClick={onDelete} disabled={isDeleteDisabled}>
        Удалить
      </Button>
    </div>
  );
};

export default EmployeeToolbar;