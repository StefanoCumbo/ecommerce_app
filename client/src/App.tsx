import './App.css';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import {Navbar} from './components/navbar';
import { AuthPage } from './pages/auth';
import { CheckoutPage } from './pages/checkout';
import { PurchasedItemsPage } from './pages/purchased-items';
import { ShopPage } from './pages/shop';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ShopContextProvider } from './context/shop-context';


function App() {
  return (
    <div className='App'>
      <Router>
        <ShopContextProvider>
        <Navbar/>
 

        <Routes>

          <Route path='/'  element={<ShopPage/>}/>
          <Route path='/auth'  element={<AuthPage/>} />
          <Route path='/checkout' element={<CheckoutPage/>} />
          <Route path='/purchased-items' element={<PurchasedItemsPage/>} />




        </Routes>

        <ToastContainer/>
        </ShopContextProvider>


      </Router>
    </div>
  )
}

export default App;
