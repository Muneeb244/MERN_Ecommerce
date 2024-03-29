import { myCache } from "../app.js";
import { asyncMiddleware } from "../middlewares/asyncMidleware.js";
import { Order } from "../models/order.js";
import { Product } from "../models/product.js";
import { User } from "../models/user.js";
import {
  calculatePercentage,
  getChartData,
  getInventories,
} from "../utils/features.js";

export const getDashboardStats = asyncMiddleware(async (req, res, next) => {
  let stats = {};
  const key = "admin-stats";

  if (myCache.has(key)) stats = JSON.parse(myCache.get(key) as string);
  else {
    const today = new Date();
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const thisMonth = {
      start: new Date(today.getFullYear(), today.getMonth(), 1),
      end: today,
    };

    const lastMonth = {
      start: new Date(today.getFullYear(), today.getMonth() - 1, 1),
      end: new Date(today.getFullYear(), today.getMonth(), 0),
    };

    const thisMonthProductsPromise = Product.find({
      createdAt: {
        $gte: thisMonth.start,
        $lte: thisMonth.end,
      },
    });

    const lastMonthProductsPromise = Product.find({
      createdAt: {
        $gte: lastMonth.start,
        $lte: lastMonth.end,
      },
    });

    // for User
    const thisMonthUsersPromise = User.find({
      createdAt: {
        $gte: thisMonth.start,
        $lte: thisMonth.end,
      },
    });

    const lastMonthUsersPromise = User.find({
      createdAt: {
        $gte: lastMonth.start,
        $lte: lastMonth.end,
      },
    });

    // for Orders
    const thisMonthOrdersPromise = Order.find({
      createdAt: {
        $gte: thisMonth.start,
        $lte: thisMonth.end,
      },
    });

    const lastMonthOrdersPromise = Order.find({
      createdAt: {
        $gte: lastMonth.start,
        $lte: lastMonth.end,
      },
    });

    const lastSixOrdersPromise = Order.find({
      createdAt: {
        $gte: sixMonthsAgo,
        $lte: today,
      },
    });

    const latesttransactionPromise = Order.find({})
      .select(["orderItems", "discount", "total", "status"])
      .limit(4);

    const [
      thisMonthProducts,
      thisMonthUsers,
      thisMonthOrders,
      lastMonthProducts,
      lastMonthUsers,
      lastMonthOrders,
      productsCount,
      userCount,
      allOrders,
      lastSixMonthsOrders,
      categories,
      femaleUsersCount,
      latesttransaction,
    ] = await Promise.all([
      thisMonthProductsPromise,
      thisMonthUsersPromise,
      thisMonthOrdersPromise,
      lastMonthProductsPromise,
      lastMonthUsersPromise,
      lastMonthOrdersPromise,
      Product.countDocuments(),
      User.countDocuments(),
      Order.find({}).select("total"),
      lastSixOrdersPromise,
      Product.distinct("category"),
      User.countDocuments({ gender: "female" }),
      latesttransactionPromise,
    ]);

    const thisMonthRevenue = thisMonthOrders.reduce(
      (total, order) => total + (order.total || 0),
      0
    );
    const lastMonthRevenue = lastMonthOrders.reduce(
      (total, order) => total + (order.total || 0),
      0
    );

    const changePercent = {
      revenue: calculatePercentage(thisMonthRevenue, lastMonthRevenue),
      product: calculatePercentage(
        thisMonthUsers.length,
        lastMonthUsers.length
      ),
      user: calculatePercentage(
        thisMonthProducts.length,
        lastMonthProducts.length
      ),
      order: calculatePercentage(
        thisMonthOrders.length,
        lastMonthOrders.length
      ),
    };

    const revenue = allOrders.reduce(
      (total, order) => total + (order.total || 0),
      0
    );

    const count = {
      revenue,
      user: userCount,
      product: productsCount,
      order: allOrders.length,
    };

    const orderMonthCounts = getChartData({
      length: 6,
      today,
      docArr: lastSixMonthsOrders,
    });
    const orderMonthlyRevenue = getChartData({
      length: 6,
      today,
      docArr: lastSixMonthsOrders,
      property: "total",
    });

    const categoryCount: Record<string, number>[] = await getInventories({
      categories,
      productsCount,
    });

    const genderRatio = {
      male: userCount - femaleUsersCount,
      female: femaleUsersCount,
    };

    const modifyTransaction = latesttransaction.map((i) => ({
      _id: i._id,
      discount: i.discount,
      amount: i.total,
      quantity: i.orderItems.length,
      status: i.status,
    }));

    stats = {
      categoryCount,
      changePercent,
      count,
      chart: {
        order: orderMonthCounts,
        revenue: orderMonthlyRevenue,
      },
      genderRatio,
      latestTransaction: modifyTransaction,
    };

    myCache.set(key, JSON.stringify(stats));
  } // else end

  return res.status(200).json({
    success: true,
    stats,
  });
});

// Pie chart
export const getPieCharts = asyncMiddleware(async (req, res, next) => {
  let charts;
  const key = "admin-pie-charts";

  if (myCache.has(key)) {
    charts = JSON.parse(myCache.get(key) as string);
  } else {
    const allOrderPromise = Order.find({}).select([
      "total",
      "discount",
      "subtotal",
      "tax",
      "shippingCharges",
    ]);

    const [
      processingOrder,
      shippedOrder,
      deliveredOrder,
      categories,
      productsCount,
      productsOutOfStock,
      allOrder,
      allUsers,
      adminUsers,
      customerUsers,
    ] = await Promise.all([
      Order.countDocuments({ status: "Processing" }),
      Order.countDocuments({ status: "Shipped" }),
      Order.countDocuments({ status: "Delivered" }),
      Product.distinct("category"),
      Product.countDocuments(),
      Product.countDocuments({ stock: 0 }),
      allOrderPromise,
      User.find({}).select("dob"),
      User.countDocuments({ role: "admin" }),
      User.countDocuments({ role: "user" }),
    ]);

    const orderFullfillment = {
      processing: processingOrder,
      shipped: shippedOrder,
      deliveredOrder,
    };

    const productCategories: Record<string, number>[] = await getInventories({
      categories,
      productsCount,
    });

    const stockAvailability = {
      inStock: productsCount - productsOutOfStock,
      outOfStock: productsOutOfStock,
    };

    //revenueDistribution
    const grossIncome = allOrder.reduce(
      (prev, order) => prev + (order.total || 0),
      0
    );
    const discount = allOrder.reduce(
      (prev, order) => prev + (order.discount || 0),
      0
    );
    const productionCost = allOrder.reduce(
      (prev, order) => prev + (order.shippingCharges || 0),
      0
    );
    const burnt = allOrder.reduce((prev, order) => prev + (order.tax || 0), 0);
    const marketingCost = Math.round(grossIncome * (30 / 100));
    const netMargin =
      grossIncome - discount - productionCost - burnt - marketingCost;

    const revenueDistribution = {
      netMargin,
      discount,
      productionCost,
      burnt,
      marketingCost,
    };

    //Users group count
    const usersAgeGroup = {
      teen: allUsers.filter((i) => i.age < 20).length,
      adult: allUsers.filter((i) => i.age >= 20 && i.age < 40).length,
      old: allUsers.filter((i) => i.age >= 40).length,
    };

    // admins count
    const adminCustomer = {
      admin: adminUsers,
      customer: customerUsers,
    };

    charts = {
      orderFullfillment,
      productCategories,
      stockAvailability,
      revenueDistribution,
      adminCustomer,
      usersAgeGroup,
    };

    myCache.set(key, JSON.stringify(charts) as string);
  } //end else
  return res.status(200).json({
    success: true,
    charts,
  });
});

export const getBarCharts = asyncMiddleware(async (req, res, next) => {
  let charts;
  const key = "admin-bar-charts";

  if (myCache.has(key)) {
    charts = JSON.parse(myCache.get(key) as string);
  } else {
    const today = new Date();

    // Six month ago products and users
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const sixMonthProductsPromise = Product.find({
      createdAt: {
        $gte: sixMonthsAgo,
        $lte: today,
      },
    }).select("createdAt");

    const sixMonthUsersPromise = User.find({
      createdAt: {
        $gte: sixMonthsAgo,
        $lte: today,
      },
    }).select("createdAt");

    //twelve months ago products
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

    const twelveMonthOrdersPromise = Order.find({
      createdAt: {
        $gte: twelveMonthsAgo,
        $lte: today,
      },
    }).select("createdAt");

    const [products, users, orders] = await Promise.all([
      sixMonthProductsPromise,
      sixMonthUsersPromise,
      twelveMonthOrdersPromise,
    ]);

    const productCounts = getChartData({ length: 6, today, docArr: products });
    const userCounts = getChartData({ length: 6, today, docArr: users });
    const orderCounts = getChartData({ length: 12, today, docArr: orders });

    charts = {
      users: userCounts,
      products: productCounts,
      orders: orderCounts,
    };

    myCache.set(key, JSON.stringify(charts));
  } // end else
  return res.status(200).json({
    success: true,
    charts,
  });
});

export const getLineCharts = asyncMiddleware(async (req, res, next) => {
  let charts;
  const key = "admin-line-charts";

  if (myCache.has(key)) {
    charts = JSON.parse(myCache.get(key) as string);
  } else {
    const today = new Date();

    //twelve months ago products
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

    const baseQuery = {
      createdAt: {
        $gte: twelveMonthsAgo,
        $lte: today,
      },
    };

    const twelveMonthProductsPromise =
      Product.find(baseQuery).select("createdAt");

    const twelveMonthUsersPromise = User.find(baseQuery).select("createdAt");

    const twelveMonthOrdersPromise = Order.find(baseQuery).select([
      "createdAt",
      "discount",
      "total",
    ]);

    const [products, users, orders] = await Promise.all([
      twelveMonthProductsPromise,
      twelveMonthUsersPromise,
      twelveMonthOrdersPromise,
    ]);

    const productCounts = getChartData({ length: 12, today, docArr: products });
    const userCounts = getChartData({ length: 12, today, docArr: users });
    const discount = getChartData({
      length: 12,
      today,
      docArr: orders,
      property: "discount",
    });
    const revenue = getChartData({
      length: 12,
      today,
      docArr: orders,
      property: "total",
    });

    charts = {
      users: userCounts,
      products: productCounts,
      discount,
      revenue,
    };

    myCache.set(key, JSON.stringify(charts));
  } // end else
  return res.status(200).json({
    success: true,
    charts,
  });
});
