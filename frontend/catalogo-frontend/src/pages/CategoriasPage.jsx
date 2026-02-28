import { useEffect, useState } from "react";
import { Table, message, Modal, Button, Tag } from "antd";
import { getCategorias, createCategoria, updateCategoria, deleteCategoria } from "../api/categoriasApi";
import CategoriaForm from "../components/CategoriaForm";

const CategoriasPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState(null);

  const fetchCategorias = async () => {
    setLoading(true);
    try {
      const res = await getCategorias();
      setData(res.data);
    } catch {
      message.error("Error al cargar categorías");
    }
    setLoading(false);
  };

  useEffect(() => {
    const load = async () => {
      await fetchCategorias();
    };
    load();
  }, []);

  const handleEdit = (categoria) => {
    setEditData(categoria);
    setEditing(true);
  };

  const handleDelete = (id) => {
    Modal.confirm({
      title: "¿Eliminar categoría?",
      content: "Esta acción no se puede deshacer.",
      okText: "Sí, eliminar",
      okType: "danger",
      cancelText: "Cancelar",
      onOk: async () => {
        try {
          await deleteCategoria(id);
          message.success("Categoría eliminada");
          fetchCategorias();
        } catch {
          message.error("Error al eliminar categoría");
        }
      },
    });
  };

  const handleFinish = async (values) => {
    try {
      if (editData) {
        await updateCategoria(editData.idCategoria, values);
        message.success("Categoría actualizada");
      } else {
        await createCategoria(values);
        message.success("Categoría creada");
      }
      setEditing(false);
      setEditData(null);
      fetchCategorias();
    } catch (error) {
      const backendMsg = error.response?.data || "Error al guardar categoría";
      message.error(backendMsg);
    }
  };

  const columns = [
    { title: "Nombre", dataIndex: "nombre" },
    { title: "Descripción", dataIndex: "descripcion" },
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
      render: (_, record) => (
        <>
          <Button onClick={() => handleEdit(record)} type="link">Editar</Button>
          <Button onClick={() => handleDelete(record.idCategoria)} type="link" danger>Eliminar</Button>
        </>
      ),
    },
  ];

  return (
    <div style={{ width: "100vw", minHeight: "80vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-start" }}>
      <h2 style={{ textAlign: "center", marginTop: 24 }}>Categorías</h2>
      <Button type="primary" onClick={() => { setEditing(true); setEditData(null); }} style={{ marginBottom: 24, alignSelf: "center" }}>
        Nueva Categoría
      </Button>
      <div style={{ width: "100vw", display: "flex", justifyContent: "center" }}>
        <Table
          rowKey="idCategoria"
          columns={columns.map(col => ({ ...col, align: "center" }))}
          dataSource={data}
          loading={loading}
          pagination={false}
          style={{ width: "100vw", maxWidth: "100vw" }}
        />
      </div>
      <Modal
        open={editing}
        title={editData ? "Editar Categoría" : "Nueva Categoría"}
        onCancel={() => { setEditing(false); setEditData(null); }}
        footer={null}
        destroyOnClose
      >
        <CategoriaForm initialValues={editData} onSuccess={handleFinish} />
      </Modal>
    </div>
  );
};

export default CategoriasPage;
