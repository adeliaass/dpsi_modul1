var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var productsRouter = require('./routes/products');
var categoriesRouter = require('./routes/categories');
var authRouter = require('./routes/auth');
var supplierRouter = require('./routes/suppliers');
var ordersRouter = require('./routes/orders');
var shippersRouter = require('./routes/shippers');
var orderDetailsRouter = require('./routes/orderDetails');
var employeesRouter = require('./routes/employees');
var customersRouter = require('./routes/customers'); 

var app = express();

var sequelize = require('./models/index');
var Category = require('./models/category');
var Product = require('./models/product');
var Customer = require('./models/customer');
var Employee = require('./models/employee');
var Order = require('./models/order');
var OrderDetail = require('./models/orderDetail');
var Supplier = require('./models/supplier');
var Shipper = require('./models/supplier');
var User = require('./models/user');

Customer.hasMany(Order, { foreignKey: 'customerID' });
Order.belongsTo(Customer, { foreignKey: 'customerID' });
Employee.hasMany(Order, { foreignKey: 'employeeID' });
Order.belongsTo(Employee, { foreignKey: 'employeeID' });
Shipper.hasMany(Order, { foreignKey: 'shipperID' });
Order.belongsTo(Shipper, { foreignKey: 'shipperID' });
Supplier.hasMany(Product, { foreignKey: 'supplierID' });
Product.belongsTo(Supplier, { foreignKey: 'supplierID' });
Category.hasMany(Product, { foreignKey: 'categoryID' });
Product.belongsTo(Category, { foreignKey: 'categoryID' });
Order.hasMany(OrderDetail, { foreignKey: 'orderID' });
OrderDetail.belongsTo(Order, { foreignKey: 'orderID' });
Product.hasMany(OrderDetail, { foreignKey: 'productID' });
OrderDetail.belongsTo(Product, { foreignKey: 'productID' });

app.use(logger('dev'));
app.use(express.json()); 
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); 

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/products', productsRouter); 
app.use('/categories', categoriesRouter);
app.use('/auth', authRouter);
app.use('/suppliers', supplierRouter);
app.use('/shippers', shippersRouter);
app.use('/orderDetails', orderDetailsRouter);
app.use('/orders', ordersRouter);
app.use('/employees', employeesRouter);
app.use('/customers', customersRouter); 

sequelize.sync()
  .then(() => {
    console.log('Database synchronized');
  })
  .catch(err => {
    console.error('Error synchronizing database:', err);
  });

const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

module.exports = app;