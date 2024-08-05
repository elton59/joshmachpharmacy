
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Products from './components/Products';
import ProductDescription from './components/ProductDescription';
import Footer from './components/Footer';
import AddProduct from './components/AddProduct';
import DeleteProduct from './components/DeleteProduct';
import AboutUs from './components/AboutUs';
import Help from './components/Help';
import MyOrders from './components/MyOrders';
import AdminOrders from './components/AdminOders';
import Prescription from './components/Prescription';

function App() {
  return (
    <div className="App">
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Products />} />
          <Route path="/product/:id" element={<ProductDescription />} />
          <Route path="/addproduct" element={<AddProduct />} />
          <Route path="/deleteproduct" element={<DeleteProduct />} />
          <Route path="/aboutus" element={<AboutUs />} />
          <Route path="/help" element={<Help />} />
          <Route path="/myorders" element={<MyOrders />} />
          <Route path="/adminorders" element={<AdminOrders />} />
          <Route path="/prescription" element={<Prescription />} />
        </Routes>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
