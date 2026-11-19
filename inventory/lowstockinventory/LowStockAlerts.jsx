import React, { useEffect, useMemo, useState } from "react";
import AddProductModal from "./AddProductModal";
import LowStockHeader from "./LowStockHeader";
import MetricsCards from "./MetricsCards";
import ProductAlerts from "./ProductAlerts";
import SettingsPanel from "./SettingsPanel";
import {
  calculateStockHealth,
  getPriority,
  getStockMetrics,
  isResolved,
} from "./lowStockUtils";
import "./LowStockAlerts.css";

const API_URLS = [
  "http://localhost:3000/products",
  "http://localhost:3001/products",
];

const getWorkingApiUrl = async () => {
  for (const url of API_URLS) {
    try {
      const response = await fetch(url);
      if (response.ok) return url;
    } catch {
      // Try the next configured JSON Server port.
    }
  }
  return API_URLS[0];
};

const normalizeProduct = (product) => {
  const stock = Number(product.currentStock || 0);
  const status = String(product.status || "Ready").trim();
  const fallbackColor = [
    "#d7b18a",
    "#cbbd94",
    "#d8c8a4",
    "#8ea7d8",
    "#b88e62",
  ][(Number(product.id || 1) - 1) % 5];

  return {
    ...product,
    id: product.id,
    name: product.name,
    sku: product.sku,
    stock,
    status,
    priority: getPriority(stock),
    image: product.image || fallbackColor,
    resolved: Boolean(product.resolved),
  };
};

const emptyProduct = {
  name: "",
  sku: "",
  category: "",
  currentStock: 0,
  price: 0,
  status: "Ready",
  image: "",
};

function LowStockAlerts() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedTab, setSelectedTab] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [threshold, setThreshold] = useState(10);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [saveStatus, setSaveStatus] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProduct, setNewProduct] = useState(emptyProduct);
  const [productMessage, setProductMessage] = useState("");
  const [productError, setProductError] = useState("");
  const [isAddingProduct, setIsAddingProduct] = useState(false);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const apiUrl = await getWorkingApiUrl();
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error("Unable to load products");
        const data = await response.json();
        setProducts((data || []).map(normalizeProduct));
      } catch (error) {
        console.error(error);
      }
    };
    loadProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    const query = search.toLowerCase().trim();
    return products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(query) ||
        product.sku.toLowerCase().includes(query);
      const matchesPriority =
        priorityFilter === "All" || product.priority === priorityFilter;
      const matchesTab =
        selectedTab === "all"
          ? true
          : selectedTab === "low"
            ? product.stock > 0 && product.stock <= threshold
            : selectedTab === "out"
              ? product.stock === 0
              : isResolved(product);
      return matchesSearch && matchesPriority && matchesTab;
    });
  }, [products, priorityFilter, search, selectedTab, threshold]);

  const totals = useMemo(
    () => getStockMetrics(products, threshold),
    [products, threshold]
  );

  const { healthyCount, stockHealthPercent } = useMemo(
    () => calculateStockHealth(products, threshold),
    [products, threshold]
  );

  const persistProduct = async (id, updatedProduct) => {
    const apiUrl = await getWorkingApiUrl();
    const response = await fetch(`${apiUrl}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedProduct),
    });
    if (!response.ok) throw new Error("Could not update product");
    const savedProduct = await response.json();
    setProducts((current) =>
      current.map((product) =>
        product.id === id ? normalizeProduct(savedProduct) : product
      )
    );
  };

  const handleAddStock = async (id) => {
    const product = products.find((item) => item.id === id);
    if (!product) return;
    const updatedProduct = {
      ...product,
      currentStock: Number(product.currentStock || 0) + 20,
      status: "Ready",
      resolved: false,
      priority: getPriority(Number(product.currentStock || 0) + 20),
      change: 0,
      price: Number(product.price || 0),
    };
    try {
      await persistProduct(id, updatedProduct);
    } catch (error) {
      console.error(error);
    }
  };

  const handleResolve = async (id) => {
    const product = products.find((item) => item.id === id);
    if (!product) return;
    const updatedProduct = {
      ...product,
      status: "Ready",
      resolved: true,
      currentStock: Number(product.currentStock || 0),
      priority: getPriority(Number(product.currentStock || 0)),
      price: Number(product.price || 0),
      change: 0,
    };
    try {
      await persistProduct(id, updatedProduct);
    } catch (error) {
      console.error(error);
    }
  };

  const handlePriorityChange = async (id, priority) => {
    const product = products.find((item) => item.id === id);
    if (!product) return;
    const updatedProduct = {
      ...product,
      priority,
      status: product.status || "Ready",
      currentStock: Number(product.currentStock || 0),
      price: Number(product.price || 0),
      change: 0,
    };
    try {
      await persistProduct(id, updatedProduct);
      setProducts((current) =>
        current.map((item) =>
          item.id === id ? { ...item, priority } : item
        )
      );
    } catch (error) {
      console.error(error);
    }
  };

  const handleSaveSettings = () => {
    setSaveStatus("Settings saved successfully.");
    setTimeout(() => setSaveStatus(""), 2200);
  };

  const handleNewProductChange = (event) => {
    const { name, value } = event.target;
    setNewProduct((current) => ({
      ...current,
      [name]:
        name === "currentStock" || name === "price"
          ? Number(value)
          : value,
    }));
  };

  const handleImageUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setNewProduct((current) => ({
        ...current,
        image: reader.result || "",
      }));
      setProductError("");
    };
    reader.onerror = () =>
      setProductError("Unable to read this image. Please choose another file.");
    reader.readAsDataURL(file);
  };

  const handleAddProduct = async (event) => {
    event.preventDefault();
    setProductError("");
    setIsAddingProduct(true);
    const product = {
      name: newProduct.name.trim(),
      sku: newProduct.sku.trim(),
      category: newProduct.category.trim(),
      currentStock: Number(newProduct.currentStock) || 0,
      price: Number(newProduct.price) || 0,
      status: newProduct.status,
      change: 0,
      image: newProduct.image || "",
    };

    try {
      const apiUrl = await getWorkingApiUrl();
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
      });
      if (!response.ok) throw new Error("Unable to add product");
      const savedProduct = await response.json();
      setProducts((current) => [...current, normalizeProduct(savedProduct)]);
      setNewProduct(emptyProduct);
      setShowAddModal(false);
      setProductMessage("Product added successfully.");
    } catch (error) {
      console.error(error);
      setProductError("Unable to add product. Check your connection and try again.");
    } finally {
      setIsAddingProduct(false);
    }
  };

  const stopClick = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };

  return (
    <div className="lsa-page">
      <LowStockHeader
        onAddProduct={() => {
          setProductError("");
          setShowAddModal(true);
        }}
      />
      {productMessage && <div className="lsa-product-message">{productMessage}</div>}
      <MetricsCards totals={totals} />
      <div className="lsa-content">
        <ProductAlerts
          products={filteredProducts}
          search={search}
          priorityFilter={priorityFilter}
          threshold={threshold}
          onSearchChange={setSearch}
          onPriorityChange={setPriorityFilter}
          onAddStock={handleAddStock}
          onResolve={handleResolve}
          onPriorityUpdate={handlePriorityChange}
          stopClick={stopClick}
        />
        <SettingsPanel
          threshold={threshold}
          emailNotifications={emailNotifications}
          stockHealthPercent={stockHealthPercent}
          healthyCount={healthyCount}
          saveStatus={saveStatus}
          onThresholdChange={(value) =>
            setThreshold(Number(value) || 1)
          }
          onToggleNotifications={() =>
            setEmailNotifications((value) => !value)
          }
          onSaveSettings={handleSaveSettings}
        />
      </div>
      {showAddModal && (
        <AddProductModal
          product={newProduct}
          productError={productError}
          isAddingProduct={isAddingProduct}
          onChange={handleNewProductChange}
          onImageUpload={handleImageUpload}
          onClose={() => setShowAddModal(false)}
          onSubmit={handleAddProduct}
        />
      )}
    </div>
  );
}

export default LowStockAlerts;
