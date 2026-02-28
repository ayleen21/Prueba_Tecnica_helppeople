
import { useEffect, useState } from "react";
import { Table, message, Modal, Button, Tag } from "antd";
import { getProductos, deleteProducto, getProductoById, updateProducto } from "../api/productosApi";
import { getCategorias } from "../api/categoriasApi";
import ProductoForm from "../components/ProductoForm";
import CargaMasivaProductosModal from "../components/CargaMasivaProductosModal";
import ProductoDetalleModal from "../components/ProductoDetalleModal";

const ProductosPage = () => {
  const [detalleOpen, setDetalleOpen] = useState(false);
  const [detalleProducto, setDetalleProducto] = useState(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [categorias, setCategorias] = useState([]);
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState(null);
  const [creating, setCreating] = useState(false);
  const [cargaMasivaOpen, setCargaMasivaOpen] = useState(false);

  const fetchProductos = async (params = {}) => {
    setLoading(true);
    try {
      const response = await getProductos({
        page: params.pagination?.current || pagination.current,
        pageSize: params.pagination?.pageSize || pagination.pageSize,
        sortBy: params.sortField,
        sortDir: params.sortOrder === "descend" ? "desc" : "asc",
      });
      setData(response.data.items);
      setPagination({
        current: response.data.page,
        pageSize: response.data.pageSize,
        total: response.data.total,
      });
    } catch (error) {
      const backendMsg = error.response?.data || "Error al cargar productos";
      message.error(backendMsg);
    }
    setLoading(false);
  };

  useEffect(() => {
    // Carga productos y categorias
    const load = async () => {
      await fetchProductos();
      try {
        const res = await getCategorias();
        setCategorias(res.data);
      } catch {
        message.error("No se pudieron cargar las categorías");
      }
    };
    load();
    // eslint-disable-next-line
  }, []);

  const handleTableChange = (newPagination, filters, sorter) => {
    fetchProductos({
      pagination: newPagination,
      sortField: sorter.field,
      sortOrder: sorter.order,
    });
  };

  const handleEdit = async (id) => {
    try {
      const res = await getProductoById(id);
      setEditData(res.data);
      setEditing(true);
    } catch {
      message.error("No se pudo cargar el producto");
    }
  };

  const handleDelete = (id) => {
    Modal.confirm({
      title: "¿Eliminar producto?",
      content: "Esta acción no se puede deshacer.",
      okText: "Sí, eliminar",
      okType: "danger",
      cancelText: "Cancelar",
      onOk: async () => {
        try {
          await deleteProducto(id);
          message.success("Producto eliminado");
          fetchProductos({ pagination });
        } catch (error) {
          const backendMsg = error.response?.data || "Error al eliminar";
          message.error(backendMsg);
        }
      },
    });
  };

  const handleEditFinish = async (values) => {
    try {
      // Solo enviar campos cambiados, no enviar sku si no cambia
      const updatePayload = { ...values };
      if (editData && values.sku === editData.sku) {
        delete updatePayload.sku;
      }
      await updateProducto(editData.idProducto, updatePayload);
      message.success("Producto actualizado");
      setEditing(false);
      setEditData(null);
      fetchProductos({ pagination });
    } catch (error) {
      const backendMsg = error.response?.data || "Error al actualizar";
      message.error(backendMsg);
    }
  };

  const columns = [
    {
      title: "Nombre",
      dataIndex: "nombre",
      sorter: true,
    },
    {
      title: "SKU",
      dataIndex: "sku",
      sorter: true,
    },
    {
      title: "Descripción",
      dataIndex: "descripcion",
      ellipsis: true,
    },
    {
      title: "Categoría",
      dataIndex: "categoriaNombre",
    },
    {
      title: "Precio",
      dataIndex: "precio",
      sorter: true,
    },
    {
      title: "Stock",
      dataIndex: "stock",
    },
    {
      title: "Activo",
      dataIndex: "activo",
      render: (activo) => activo ? <Tag color="green">Sí</Tag> : <Tag color="red">No</Tag>,
    },
    {
      title: "Fecha de creación",
      dataIndex: "fechaCreacion",
      render: (fecha) => fecha ? new Date(fecha).toLocaleString("es-MX", { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" }) : "",
    },
    {
      title: "Acciones",
      dataIndex: "acciones",
      render: (_, record) => (
        <>
          <Button size="small" onClick={() => handleEdit(record.idProducto)} style={{ marginRight: 8 }}>
            Editar
          </Button>
          <Button size="small" danger onClick={() => handleDelete(record.idProducto)} style={{ marginRight: 8 }}>
            Eliminar
          </Button>
          <Button size="small" onClick={() => { setDetalleProducto(record); setDetalleOpen(true); }}>
            Ver detalle
          </Button>
        </>
      ),
    },
  ];

  return (
    <>
      <div style={{ width: "100vw", minHeight: "80vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-start" }}>
        <h2 style={{ textAlign: "center", marginTop: 24 }}>Productos</h2>
        <div style={{ display: "flex", gap: 16, marginBottom: 24 }}>
          <Button type="primary" onClick={() => setCreating(true)}>
            Nuevo Producto
          </Button>
          <Button onClick={() => setCargaMasivaOpen(true)}>
            Carga masiva
          </Button>
        </div>
              <CargaMasivaProductosModal
                open={cargaMasivaOpen}
                onClose={() => setCargaMasivaOpen(false)}
                onSuccess={() => {
                  setCargaMasivaOpen(false);
                  fetchProductos({ pagination });
                }}
              />
        <div style={{ width: "100vw", display: "flex", justifyContent: "center" }}>
          <Table
            columns={columns}
            rowKey="idProducto"
            dataSource={data}
            pagination={pagination}
            loading={loading}
            onChange={handleTableChange}
            style={{ width: "100vw", maxWidth: "100vw" }}
          />
        </div>
      </div>
      {/* Modal detalle */}
      <ProductoDetalleModal
        open={detalleOpen}
        onClose={() => setDetalleOpen(false)}
        producto={detalleProducto}
      />
      {/* Modal editar */}
      <Modal
        open={editing}
        title={
          editData
            ? `Editar producto: ${editData.nombre || ''}${editData.sku ? ' (SKU: ' + editData.sku + ')' : ''}`
            : 'Editar producto'
        }
        onCancel={() => {
          setEditing(false);
          setEditData(null);
        }}
        footer={null}
        destroyOnClose
      >
        {editData && (
          <ProductoForm
            initialValues={editData}
            categorias={categorias}
            onSuccess={() => {
              setEditing(false);
              setEditData(null);
              fetchProductos({ pagination });
            }}
            onFinish={handleEditFinish}
            isEdit
          />
        )}
      </Modal>
      {/* Modal crear */}
      <Modal
        open={creating}
        title="Nuevo producto"
        onCancel={() => setCreating(false)}
        footer={null}
        destroyOnClose
      >
        <ProductoForm
          categorias={categorias}
          onSuccess={() => {
            setCreating(false);
            fetchProductos({ pagination });
          }}
        />
      </Modal>
    </>
  );
};

export default ProductosPage;
