import React, { useEffect, useMemo, useState } from "react";
import AddProductModal from "./AddProductModal";
import BulkInventoryHeader from "./BulkInventoryHeader";
import FilterBar from "./FilterBar";
import ProductTable from "./ProductTable";
import SummaryCards from "./SummaryCards";
import "./BulkInventory.css";

const API_URLS = [
  "http://localhost:3000/products",
  "http://localhost:3001/products",
];

const emptyProduct = {
  name: "",
  sku: "",
  category: "",
  currentStock: 0,
  price: 0,
  status: "Ready",
  image: "",
};

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

function BulkInventory() {
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All Categories");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [newProduct, setNewProduct] = useState(emptyProduct);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const apiUrl = await getWorkingApiUrl();
      const response = await fetch(apiUrl);
      if (!response.ok) throw new Error("Unable to load products");
      const data = await response.json();
      setProducts(
        data.map((product) => ({
          ...product,
          status: getProductStatus(product),
        }))
      );
    } catch (error) {
      console.error(error);
      setMessage(
        "Unable to load products. Please make sure JSON Server is running."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const categories = useMemo(() => {
    const values = products
      .map((product) => product.category)
      .filter(Boolean);
    return ["All Categories", ...new Set(values)];
  }, [products]);

  const filteredProducts = useMemo(() => {
    const searchText = search.toLowerCase().trim();
    return products.filter((product) => {
      const searchMatch =
        product.name?.toLowerCase().includes(searchText) ||
        product.sku?.toLowerCase().includes(searchText);
      const categoryMatch =
        category === "All Categories" || product.category === category;
      return searchMatch && categoryMatch;
    });
  }, [products, search, category]);

  const getProductStatus = (product) => {
    const stock = Number(product.currentStock || 0);
    const status = String(product.status || "").trim();
    if (stock <= 0) return "Out of Stock";
    if (stock <= 10) return "Low Stock";
    if (status === "Not Ready") return "Not Ready";
    return "Ready";
  };

  const getNewStock = (product) =>
    Number(product.currentStock || 0) + Number(product.change || 0);

  const toggleProduct = (id) => {
    setSelectedProducts((previous) =>
      previous.includes(id)
        ? previous.filter((item) => item !== id)
        : [...previous, id]
    );
  };

  const autoSelectProduct = (id) => {
    setSelectedProducts((previous) =>
      previous.includes(id) ? previous : [...previous, id]
    );
  };

  const allSelected =
    filteredProducts.length > 0 &&
    filteredProducts.every((product) => selectedProducts.includes(product.id));

  const handleSelectAll = () => {
    const visibleIds = filteredProducts.map((product) => product.id);
    setSelectedProducts((previous) =>
      allSelected
        ? previous.filter((id) => !visibleIds.includes(id))
        : [...new Set([...previous, ...visibleIds])]
    );
  };

  const updateProduct = (id, changes) => {
    autoSelectProduct(id);
    setProducts((previous) =>
      previous.map((product) =>
        product.id === id ? { ...product, ...changes } : product
      )
    );
  };

  const changeQuantity = (id, amount) =>
    updateProduct(id, {
      change: Number((products.find((product) => product.id === id)?.change || 0) + amount),
    });

  const handleQuantityInput = (id, value) =>
    updateProduct(id, { change: Number(value) || 0 });

  const handlePriceChange = (id, value) =>
    updateProduct(id, { price: value });

  const handleStatusChange = (id, value) => {
    autoSelectProduct(id);
    setProducts((previous) =>
      previous.map((product) => {
        if (product.id !== id) return product;
        const updated = { ...product, status: value };
        return { ...updated, status: getProductStatus(updated) };
      })
    );
  };

  const selectedData = products.filter((product) =>
    selectedProducts.includes(product.id)
  );
  const totalQuantityChange = selectedData.reduce(
    (total, product) => total + Number(product.change || 0),
    0
  );
  const priceUpdates = selectedData.length;

  const handleApplyUpdates = async () => {
    if (selectedProducts.length === 0) {
      setMessage("Please select at least one product.");
      return;
    }

    try {
      setSaving(true);
      setMessage("");
      const apiUrl = await getWorkingApiUrl();
      for (const product of selectedData) {
        const updatedProduct = {
          ...product,
          currentStock: getNewStock(product),
          change: 0,
          price: Number(product.price) || 0,
        };
        const response = await fetch(`${apiUrl}/${product.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedProduct),
        });
        if (!response.ok) throw new Error(`Could not update ${product.name}`);
      }
      await loadProducts();
      setSelectedProducts([]);
      setMessage("Inventory updates saved successfully.");
    } catch (error) {
      console.error(error);
      setMessage("Unable to save inventory updates.");
    } finally {
      setSaving(false);
    }
  };

  const handleNewProductChange = (event) => {
    const { name, value } = event.target;
    setNewProduct((previous) => ({
      ...previous,
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
    reader.onloadend = () =>
      setNewProduct((previous) => ({
        ...previous,
        image: reader.result || "",
      }));
    reader.readAsDataURL(file);
  };

  const handleAddProduct = async (event) => {
    event.preventDefault();
    if (!newProduct.name.trim()) {
      setMessage("Please enter product name.");
      return;
    }
    if (!newProduct.sku.trim()) {
      setMessage("Please enter SKU.");
      return;
    }
    if (!newProduct.category.trim()) {
      setMessage("Please enter category.");
      return;
    }

    try {
      setSaving(true);
      setMessage("");
      const product = {
        name: newProduct.name.trim(),
        sku: newProduct.sku.trim(),
        category: newProduct.category.trim(),
        currentStock: Number(newProduct.currentStock) || 0,
        change: 0,
        price: Number(newProduct.price) || 0,
        status: newProduct.status,
        image: newProduct.image || "",
      };
      const apiUrl = await getWorkingApiUrl();
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
      });
      if (!response.ok) throw new Error("Unable to add product");
      const addedProduct = await response.json();
      setProducts((previous) => [...previous, addedProduct]);
      setNewProduct(emptyProduct);
      setShowAddProduct(false);
      setMessage("Product added successfully.");
    } catch (error) {
      console.error(error);
      setMessage("Unable to add product.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bi-page">
      <BulkInventoryHeader onAddProduct={() => setShowAddProduct(true)} />
      <SummaryCards
        selectedCount={selectedProducts.length}
        totalQuantityChange={totalQuantityChange}
        priceUpdates={priceUpdates}
      />
      <section className="bi-products-card">
        <h2>Select Products</h2>
        <FilterBar
          search={search}
          category={category}
          categories={categories}
          selectedCount={selectedProducts.length}
          saving={saving}
          onSearchChange={setSearch}
          onCategoryChange={setCategory}
          onApplyUpdates={handleApplyUpdates}
        />
        {message && <div className="bi-message">{message}</div>}
        <ProductTable
          products={filteredProducts}
          selectedProducts={selectedProducts}
          loading={loading}
          allSelected={allSelected}
          onSelectAll={handleSelectAll}
          onSelect={toggleProduct}
          onQuantityChange={changeQuantity}
          onQuantityInput={handleQuantityInput}
          onPriceChange={handlePriceChange}
          onStatusChange={handleStatusChange}
          getNewStock={getNewStock}
          getProductStatus={getProductStatus}
        />
      </section>
      {showAddProduct && (
        <AddProductModal
          product={newProduct}
          saving={saving}
          onChange={handleNewProductChange}
          onImageUpload={handleImageUpload}
          onClose={() => setShowAddProduct(false)}
          onSubmit={handleAddProduct}
        />
      )}
    </div>
  );
}

export default BulkInventory;
