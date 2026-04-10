import { Category } from "./category.js";
import { Product } from "./product.js";
import { Sale } from "./sale.js";
import { SaleItem } from "./saleItem.js";
import { Stock } from "./stock.js";
import { StockMovement } from "./stockMovement.js";

// Category -> Product
Category.hasMany(Product, { foreignKey: "categoryId", as: "products" });
Product.belongsTo(Category, { foreignKey: "categoryId", as: "category" });

// Product -> Stock
Product.hasOne(Stock, {
	foreignKey: "productId",
	as: "stock",
	onDelete: "CASCADE",
});
Stock.belongsTo(Product, { foreignKey: "productId", as: "product" });

// Product -> StockMovement
Product.hasMany(StockMovement, {
	foreignKey: "productId",
	as: "stockMovements",
});
StockMovement.belongsTo(Product, { foreignKey: "productId", as: "product" });

// Sale -> StockMovement
Sale.hasMany(StockMovement, { foreignKey: "saleId", as: "stockMovements" });
StockMovement.belongsTo(Sale, { foreignKey: "saleId", as: "sale" });

// Sale -> SaleItem
Sale.hasMany(SaleItem, { foreignKey: "saleId", as: "items" });
SaleItem.belongsTo(Sale, { foreignKey: "saleId", as: "sale" });

// Product -> SaleItem
Product.hasMany(SaleItem, { foreignKey: "productId", as: "saleItems" });
SaleItem.belongsTo(Product, { foreignKey: "productId", as: "product" });
