import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import Loading from "./components/Loading";
import Header from "./components/Header";
const Home = lazy(() => import("./pages/Home"));
const Search = lazy(() => import("./pages/Search"));
const Cart = lazy(() => import("./pages/Cart"));

// Admin Dashboard

const Products = lazy(() => import("./pages/admin/Products"));
const Transaction = lazy(() => import("./pages/admin/Transaction"));
const Customer = lazy(() => import("./pages/admin/Customer"));
const Dashboard = lazy(() => import("./pages/admin/Dashboard"));

const NewProduct = lazy(() => import("./pages/admin/managment/NewProduct"));
const ProductManagement = lazy(
  () => import("./pages/admin/managment/ProductManagement")
);
const TransactionManagement = lazy(
  () => import("./pages/admin/managment/TransactionManagement")
);

const BarChart = lazy(() => import("./pages/admin/charts/BarCharts"));
const PieChart = lazy(() => import("./pages/admin/charts/PieCharts"));
const LineChart = lazy(() => import("./pages/admin/charts/LineCharts"));

const Coupon = lazy(() => import("./pages/admin/apps/Coupon"));
const Stopwatch = lazy(() => import("./pages/admin/apps/Stopwatch"));

const App = () => {
  return (
    <Router>
      <Header/>
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/cart" element={<Cart />} />

          {/* Admin Dashboard */}
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/products" element={<Products />} />
          <Route path="/admin/transaction" element={<Transaction />} />
          <Route path="/admin/customer" element={<Customer />} />

          {/* charts */}
          <Route path="/admin/chart/bar" element={<BarChart />} />
          <Route path="/admin/chart/pie" element={<PieChart />} />
          <Route path="/admin/chart/line" element={<LineChart />} />

          {/* management */}
          <Route path="/admin/product/new" element={<NewProduct />} />
          <Route path="/admin/product/:id" element={<ProductManagement />} />
          <Route
            path="/admin/transaction/:id"
            element={<TransactionManagement />}
          />

          {/* apps */}
          <Route path="/admin/app/coupon" element={<Coupon />} />
          <Route path="/admin/app/stopwatch" element={<Stopwatch />} />
        </Routes>
      </Suspense>
    </Router>
  );
};

export default App;
