import assert from "node:assert/strict";
import test from "node:test";
import {
  calculateStockHealth,
  getPriority,
  getStockMetrics,
  isResolved,
} from "./lowStockUtils.js";

test("priority reflects stock severity", () => {
  assert.equal(getPriority(0), "High");
  assert.equal(getPriority(5), "Medium");
  assert.equal(getPriority(10), "Medium");
  assert.equal(getPriority(11), "Low");
  assert.equal(getPriority(20), "Low");
});

test("resolved means the alert has been explicitly resolved", () => {
  assert.equal(isResolved({ resolved: true, stock: 20 }), true);
  assert.equal(isResolved({ resolved: false, stock: 20 }), false);
  assert.equal(isResolved({ resolved: true, stock: 0 }), false);
});

test("stock health uses active products and excludes resolved items", () => {
  const products = [
    { stock: 0, resolved: false },
    { stock: 5, resolved: false },
    { stock: 20, resolved: false },
    { stock: 30, resolved: true },
  ];

  assert.deepEqual(calculateStockHealth(products, 10), {
    healthyCount: 1,
    stockHealthPercent: 33,
  });
});

test("out-of-stock products remain unhealthy even when marked resolved", () => {
  const products = [
    { stock: 0, resolved: true },
    { stock: 20, resolved: true },
  ];

  assert.deepEqual(calculateStockHealth(products, 10), {
    healthyCount: 0,
    stockHealthPercent: 0,
  });
  assert.deepEqual(getStockMetrics(products, 10), {
    activeAlerts: 1,
    lowStock: 0,
    outOfStock: 1,
    resolved: 1,
  });
});
