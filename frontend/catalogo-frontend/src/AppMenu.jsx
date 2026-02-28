import { Layout, Menu } from "antd";
import { useState } from "react";
import ProductosPage from "./pages/ProductosPage";
import CategoriasPage from "./pages/CategoriasPage";

const { Header, Content } = Layout;

const AppMenu = () => {
  const [selected, setSelected] = useState("productos");

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header>
        <Menu
          theme="dark"
          mode="horizontal"
          selectedKeys={[selected]}
          onClick={({ key }) => setSelected(key)}
          items={[
            { key: "productos", label: "Productos" },
            { key: "categorias", label: "Categorías" },
          ]}
        />
      </Header>
      <Content style={{ padding: 24 }}>
        {selected === "productos" && <ProductosPage />}
        {selected === "categorias" && <CategoriasPage />}
      </Content>
    </Layout>
  );
};

export default AppMenu;
