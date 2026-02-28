import { useEffect } from "react";
import { Form, Input, Button, Switch } from "antd";

const CategoriaForm = ({ initialValues, onSuccess }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    // Sincroniza formulario con datos
    if (initialValues) {
      form.setFieldsValue(initialValues);
    } else {
      form.resetFields();
    }
  }, [initialValues, form]);

  const onFinish = async (values) => {
    if (onSuccess) await onSuccess(values);
  };

  return (
    <Form form={form} layout="vertical" onFinish={onFinish} initialValues={{ activo: true }}>
      <Form.Item
        label="Nombre"
        name="nombre"
        rules={[{ required: true, message: "El nombre es obligatorio" }]}
      >
        <Input maxLength={200} />
      </Form.Item>
      <Form.Item label="Descripción" name="descripcion">
        <Input.TextArea maxLength={1000} />
      </Form.Item>
      <Form.Item label="Activo" name="activo" valuePropName="checked">
        <Switch />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Guardar
        </Button>
      </Form.Item>
    </Form>
  );
};

export default CategoriaForm;
