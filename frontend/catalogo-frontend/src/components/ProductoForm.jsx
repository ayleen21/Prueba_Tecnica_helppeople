import { useState, useEffect } from "react";
import { Form, Input, InputNumber, Button, Select, Switch, message } from "antd";
import { createProducto, updateProducto } from "../api/productosApi";

const ProductoForm = ({ categorias = [], onSuccess, initialValues }) => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  // Sincroniza formulario con datos
  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues);
    } else {
      form.resetFields();
    }
  }, [initialValues, form]);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      if (initialValues && initialValues.idProducto) {
        // Editar producto
        await updateProducto(initialValues.idProducto, values);
        message.success("Producto actualizado correctamente");
      } else {
        // Crear producto
        await createProducto(values);
        message.success("Producto creado correctamente");
        form.resetFields();
      }
      if (onSuccess) onSuccess();
    } catch (error) {
      const backendMsg = error.response?.data || (initialValues ? "Error al actualizar producto" : "Error al crear producto");
      message.error(backendMsg);
    }
    setLoading(false);
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      initialValues={{ activo: true, stock: 0 }}
    >
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
      <Form.Item
        label="SKU"
        name="sku"
        rules={[{ required: true, message: "El SKU es obligatorio" }]}
      >
        <Input maxLength={100} />
      </Form.Item>
      <Form.Item
        label="Precio"
        name="precio"
        rules={[
          { required: true, message: "El precio es obligatorio" },
          { type: "number", min: 0.01, message: "El precio debe ser mayor a 0" },
        ]}
      >
        <InputNumber min={0.01} style={{ width: "100%" }} />
      </Form.Item>
      <Form.Item label="Stock" name="stock">
        <InputNumber min={0} style={{ width: "100%" }} />
      </Form.Item>
      <Form.Item
        label="Categoría"
        name="idCategoria"
        rules={[{ required: true, message: "La categoría es obligatoria" }]}
      >
        <Select placeholder="Selecciona una categoría">
          {categorias.map((cat) => (
            <Select.Option key={cat.idCategoria} value={cat.idCategoria}>
              {cat.nombre}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item label="Activo" name="activo" valuePropName="checked">
        <Switch />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          Guardar
        </Button>
      </Form.Item>
    </Form>
  );
};

export default ProductoForm;
