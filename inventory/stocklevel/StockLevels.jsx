import { useEffect, useMemo, useState } from "react";
import AddProductModal from "./AddProductModal";
import StockLevelFilters from "./StockLevelFilters";
import StockLevelHeader from "./StockLevelHeader";
import StockLevelMetrics from "./StockLevelMetrics";
import StockLevelTable from "./StockLevelTable";
import "./StockLevels.css";

const API_URLS = [
  "http://localhost:3000/products",
  "http://localhost:3001/products",
];

const getWorkingApiUrl = async () => {
  for (const url of API_URLS) {
    try {
      const response = await fetch(url);
      if (response.ok) {
        return url;
      }
    } catch (error) {
      // Try the next configured JSON Server port.
    }
  }

  return API_URLS[0];
};

const getStatusFromStock = (stock) => {
  const value = Number(stock || 0);

  if (value <= 0) return "Out of Stock";
  if (value <= 10) return "Low Stock";
  return "In Stock";
};

const normalizeProduct = (product) => {
  const available = Number(product.currentStock || 0);
  const reserved = Number(product.reserved || product.change || 0);
  const reorderLevel = Number(product.reorderLevel || 10);
  const computedStatus = getStatusFromStock(available);
  const status = computedStatus;

  return {
    ...product,
    id: product.id,
    name: product.name || "Unnamed product",
    sku: product.sku || "N/A",
    category: product.category || "General",
    available,
    reserved,
    reorderLevel,
    status,
    image:
      product.image ||
      "linear-gradient(135deg, rgba(125, 206, 160, 0.45), rgba(255, 255, 255, 0.4))",
  };
};

function StockLevels() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [showAddModal, setShowAddModal] = useState(false);
  const [message, setMessage] = useState("");
  const [newProduct, setNewProduct] = useState({
    name: "",
    sku: "",
    category: "",
    currentStock: 0,
    price: 0,
    status: "Ready",
    image: "",
  });

  const loadProducts = async () => {
    try {
      setLoading(true);
      const apiUrl = await getWorkingApiUrl();
      const response = await fetch(apiUrl);

      if (!response.ok) throw new Error("Unable to load stock levels");

      const data = await response.json();
      setProducts((data || []).map(normalizeProduct));
      setMessage("");
    } catch (error) {
      console.error(error);
      setMessage("Unable to load products. Please make sure JSON Server is running.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const categories = useMemo(() => {
    const unique = [...new Set(products.map((product) => product.category).filter(Boolean))];
    return ["All Categories", ...unique];
  }, [products]);

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();

    return products.filter((product) => {
      const matchesSearch =
        !query ||
        product.name.toLowerCase().includes(query) ||
        product.sku.toLowerCase().includes(query);

      const matchesCategory =
        categoryFilter === "All Categories" || product.category === categoryFilter;

      const matchesStatus =
        statusFilter === "All Status" || product.status === statusFilter;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [categoryFilter, products, search, statusFilter]);

  const metrics = useMemo(() => {
    const totalProducts = products.length;
    const inStock = products.filter((product) => product.status === "In Stock").length;
    const lowStock = products.filter((product) => product.status === "Low Stock").length;
    const outOfStock = products.filter((product) => product.status === "Out of Stock").length;

    return { totalProducts, inStock, lowStock, outOfStock };
  }, [products]);

  const handleNewProductChange = (event) => {
    const { name, value } = event.target;
    setNewProduct((previous) => ({
      ...previous,
      [name]: name === "currentStock" || name === "price" ? Number(value) : value,
    }));
  };

  const handleImageUpload = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setNewProduct((previous) => ({ ...previous, image: reader.result || "" }));
      setMessage("");
    };
    reader.onerror = () => setMessage("Unable to read this image. Please choose another file.");
    reader.readAsDataURL(file);
  };

  const handleAddProduct = async (event) => {
    event.preventDefault();

    const product = {
      name: newProduct.name.trim(),
      sku: newProduct.sku.trim(),
      category: newProduct.category.trim(),
      currentStock: Number(newProduct.currentStock) || 0,
      reserved: 0,
      reorderLevel: 10,
      price: Number(newProduct.price) || 0,
      change: 0,
      image: newProduct.image || "",
    };

    try {
      const apiUrl = await getWorkingApiUrl();
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...product,
          status: getStatusFromStock(product.currentStock),
        }),
      });

      if (!response.ok) throw new Error("Unable to add product");

      const savedProduct = await response.json();
      setProducts((current) => [...current, normalizeProduct(savedProduct)]);
      setNewProduct({ name: "", sku: "", category: "", currentStock: 0, price: 0, status: "Ready", image: "" });
      setShowAddModal(false);
      setMessage("Product added successfully.");
    } catch (error) {
      console.error(error);
      setMessage("Unable to add product.");
    }
  };

  const handleExport = () => {
    const rows = [
      ["Product", "SKU", "Category", "Available", "Reserved", "Reorder level", "Status"],
      ...filteredProducts.map((product) => [
        product.name,
        product.sku,
        product.category,
        product.available,
        product.reserved,
        product.reorderLevel,
        product.status,
      ]),
    ];

    const csv = rows
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "stock-levels.csv";
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="sl-page">
      <StockLevelHeader onAddProduct={() => setShowAddModal(true)} />
      <StockLevelMetrics metrics={metrics} />
      <div className="sl-card">
        <StockLevelFilters
          search={search}
          categoryFilter={categoryFilter}
          statusFilter={statusFilter}
          categories={categories}
          message={message}
          onSearchChange={setSearch}
          onCategoryChange={setCategoryFilter}
          onStatusChange={setStatusFilter}
          onExport={handleExport}
        />

        <div className="sl-table-wrap">
          <StockLevelTable
            products={filteredProducts}
            loading={loading}
          />
        </div>
      </div>

      {showAddModal && (
        <AddProductModal
          product={newProduct}
          onChange={handleNewProductChange}
          onImageUpload={handleImageUpload}
          onClose={() => setShowAddModal(false)}
          onSubmit={handleAddProduct}
        />
      )}
    </div>
  );
}
export default StockLevels;
