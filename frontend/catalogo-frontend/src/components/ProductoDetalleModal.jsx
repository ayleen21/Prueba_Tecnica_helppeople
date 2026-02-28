import { Modal, Descriptions, Tag } from "antd";

const ProductoDetalleModal = ({ open, onClose, producto }) => {
  if (!producto) return null;
  return (
    <Modal open={open} onCancel={onClose} footer={null} title={`Detalle de producto: ${producto.nombre}`}
      destroyOnClose>
      <Descriptions bordered column={1} size="middle">
        <Descriptions.Item label="Nombre">{producto.nombre}</Descriptions.Item>
        <Descriptions.Item label="SKU">{producto.sku}</Descriptions.Item>
        <Descriptions.Item label="Descripción">{producto.descripcion}</Descriptions.Item>
        <Descriptions.Item label="Categoría">{producto.categoriaNombre}</Descriptions.Item>
        <Descriptions.Item label="Precio">${producto.precio}</Descriptions.Item>
        <Descriptions.Item label="Stock">{producto.stock}</Descriptions.Item>
        <Descriptions.Item label="Activo">
          {producto.activo ? <Tag color="green">Sí</Tag> : <Tag color="red">No</Tag>}
        </Descriptions.Item>
        <Descriptions.Item label="Fecha de creación">
          {producto.fechaCreacion ? new Date(producto.fechaCreacion).toLocaleString("es-MX", { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" }) : ""}
        </Descriptions.Item>
      </Descriptions>
    </Modal>
  );
};

export default ProductoDetalleModal;
