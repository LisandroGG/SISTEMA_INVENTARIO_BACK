import { Category } from "./category.js";
import { Product } from "./product.js";
import { Sale } from "./sale.js";
import { SaleItem } from "./saleItem.js";
import { Stock } from "./stock.js";
import { StockMovement } from "./stockMovement.js";

// Category -> Product
Category.hasMany(Product, { foreignKey: "categoryId" });
Product.belongsTo(Category, { foreignKey: "categoryId" });

// Product -> Stock
Product.hasOne(Stock, { foreignKey: "productId" });
Stock.belongsTo(Product, { foreignKey: "productId" });

// Product -> StockMovement
Product.hasMany(StockMovement, { foreignKey: "productId" });
StockMovement.belongsTo(Product, { foreignKey: "productId" });

// Sale -> StockMovement
Sale.hasMany(StockMovement, { foreignKey: "saleId" });
StockMovement.belongsTo(Sale, { foreignKey: "saleId" });

// Sale -> SaleItem
Sale.hasMany(SaleItem, { foreignKey: "saleId" });
SaleItem.belongsTo(Sale, { foreignKey: "saleId" });

// Product -> SaleItem
Product.hasMany(SaleItem, { foreignKey: "productId" });
SaleItem.belongsTo(Product, { foreignKey: "productId" });
