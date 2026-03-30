import "./index.css";
import { AnimatePresence } from "framer-motion";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import Footer from "./components/Footer";
import Header from "./components/Header";
import PageWrapper from "./components/PageWrapper";
import { AuthProvider } from "./context/AuthContext";
import { StoreProvider } from "./context/StoreContext";
import AdminPlaceholderScreen from "./pages/AdminPlaceholderScreen";
import CartScreen from "./pages/CartScreen";
import HomeScreen from "./pages/HomeScreen";
import LoginScreen from "./pages/LoginScreen";
import NotFoundScreen from "./pages/NotFoundScreen";
import OrderListScreen from "./pages/OrderListScreen";
import OrderScreen from "./pages/OrderScreen";
import OrderSuccessScreen from "./pages/OrderSuccessScreen";
import PaymentScreen from "./pages/PaymentScreen";
import PlaceOrderScreen from "./pages/PlaceOrderScreen";
import ProductEditScreen from "./pages/ProductEditScreen";
import ProductListScreen from "./pages/ProductListScreen";
import ProductScreen from "./pages/ProductScreen";
import ProductsScreen from "./pages/ProductsScreen";
import RegisterScreen from "./pages/RegisterScreen";
import ShippingScreen from "./pages/ShippingScreen";
import AdminRoute from "./routes/AdminRoute";
import ProtectedRoute from "./routes/ProtectedRoute";

const withTransition = (element) => <PageWrapper>{element}</PageWrapper>;

function AppRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={withTransition(<HomeScreen />)} />
        <Route path="/products" element={withTransition(<ProductsScreen />)} />
        <Route path="/cart" element={withTransition(<CartScreen />)} />
        <Route path="/login" element={withTransition(<LoginScreen />)} />
        <Route path="/register" element={withTransition(<RegisterScreen />)} />
        <Route path="/product/:id" element={withTransition(<ProductScreen />)} />
        <Route
          path="/shipping"
          element={
            <ProtectedRoute>
              {withTransition(<ShippingScreen />)}
            </ProtectedRoute>
          }
        />
        <Route
          path="/payment"
          element={
            <ProtectedRoute>
              {withTransition(<PaymentScreen />)}
            </ProtectedRoute>
          }
        />
        <Route
          path="/placeorder"
          element={
            <ProtectedRoute>
              {withTransition(<PlaceOrderScreen />)}
            </ProtectedRoute>
          }
        />
        <Route
          path="/order-success/:id"
          element={
            <ProtectedRoute>
              {withTransition(<OrderSuccessScreen />)}
            </ProtectedRoute>
          }
        />
        <Route
          path="/order/:id"
          element={
            <ProtectedRoute>
              {withTransition(<OrderScreen />)}
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/orders"
          element={
            <AdminRoute>
              {withTransition(<OrderListScreen />)}
            </AdminRoute>
          }
        />
        <Route
          path="/admin/products"
          element={
            <AdminRoute>
              {withTransition(<ProductListScreen />)}
            </AdminRoute>
          }
        />
        <Route
          path="/admin/product/:id/edit"
          element={
            <AdminRoute>
              {withTransition(<ProductEditScreen />)}
            </AdminRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <AdminRoute>
              {withTransition(
                <AdminPlaceholderScreen
                  title="Quản lý người dùng"
                  description="Trang này là placeholder cho module quản lý người dùng. Bạn có thể mở rộng sau với danh sách user, cập nhật role và khóa tài khoản."
                />
              )}
            </AdminRoute>
          }
        />
        <Route path="*" element={withTransition(<NotFoundScreen />)} />
      </Routes>
    </AnimatePresence>
  );
}

function AppShell() {
  return (
    <div className="flex min-h-screen flex-col bg-sand-50 text-slate-900">
      <Header />
      <main className="flex-1">
        <AppRoutes />
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <StoreProvider>
        <BrowserRouter>
          <AppShell />
        </BrowserRouter>
      </StoreProvider>
    </AuthProvider>
  );
}

export default App;
