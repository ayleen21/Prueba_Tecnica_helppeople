import { Modal, Upload, Button, message, Alert } from "antd";
import { useState } from "react";
import { UploadOutlined } from "@ant-design/icons";
import { uploadProductosCsv } from "../api/productosApi";

const CargaMasivaProductosModal = ({ open, onClose, onSuccess }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleUpload = async () => {
    if (!file) {
      // Archivo no seleccionado
      message.error("Selecciona un archivo CSV");
      return;
    }
    setLoading(true);
    try {
      const res = await uploadProductosCsv(file);
      setResult(res.data);
      if (res.data.creados > 0) {
        message.success(`Productos creados: ${res.data.creados}`);
        if (onSuccess) onSuccess();
      }
      if (res.data.errores > 0) {
        message.warning(`Errores: ${res.data.errores}`);
      }
    } catch {
      message.error("Error al cargar el archivo");
    }
    setLoading(false);
  };

  return (
    <Modal
      open={open}
      title="Carga masiva de productos (CSV)"
      onCancel={onClose}
      footer={null}
      destroyOnClose
    >
      <Upload
        beforeUpload={(file) => {
          setFile(file);
          return false;
        }}
        accept=".csv"
        maxCount={1}
        showUploadList={{ showRemoveIcon: true }}
        onRemove={() => setFile(null)}
      >
        <Button icon={<UploadOutlined />}>Seleccionar archivo CSV</Button>
      </Upload>
      <Button
        type="primary"
        onClick={handleUpload}
        loading={loading}
        disabled={!file}
        style={{ marginTop: 16, width: "100%" }}
      >
        Subir y procesar
      </Button>
      {result && (
        <div style={{ marginTop: 16 }}>
          <Alert
            type={result.errores > 0 ? "warning" : "success"}
            message={`Creados: ${result.creados}, Errores: ${result.errores}`}
            description={
              result.erroresDetalle && result.erroresDetalle.length > 0 ? (
                <ul>
                  {result.erroresDetalle.map((e, i) => (
                    <li key={i}>{e}</li>
                  ))}
                </ul>
              ) : null
            }
            showIcon
          />
        </div>
      )}
    </Modal>
  );
};

export default CargaMasivaProductosModal;
