export const getPriority = (stock) => {
  const value = Number(stock || 0);
  if (value <= 0) return "High";
  if (value <= 10) return "Medium";
  return "Low";
};

export const isResolved = (product) => {
  const stock = Number(product?.stock || 0);
  return Boolean(product?.resolved) && stock > 0;
};

export const getStockMetrics = (products, threshold) => {
  const activeProducts = products.filter((product) => !isResolved(product));
  const lowStock = activeProducts.filter(
    (product) => product.stock > 0 && product.stock <= threshold
  ).length;
  const outOfStock = activeProducts.filter(
    (product) => product.stock === 0
  ).length;
  const resolved = products.filter((product) => isResolved(product)).length;

  return {
    activeAlerts: activeProducts.length,
    lowStock,
    outOfStock,
    resolved,
  };
};

export const calculateStockHealth = (products, threshold) => {
  const activeProducts = products.filter((product) => !isResolved(product));
  const healthyCount = activeProducts.filter(
    (product) => Number(product.stock || 0) > Number(threshold || 10)
  ).length;
  const totalActiveProducts = activeProducts.length;

  return {
    healthyCount,
    stockHealthPercent:
      totalActiveProducts === 0
        ? 0
        : Math.round((healthyCount / totalActiveProducts) * 100),
  };
};
