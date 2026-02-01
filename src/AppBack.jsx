import axios from 'axios';
import { useEffect, useState, useRef } from 'react'
import * as bootstrap from 'bootstrap';
import './assets/all.scss'
import ProductModal from './components/ProductModal';
import Pagination from './components/Pagination';
import Login from './views/Login';


const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

// 建立初始化的資料 INITAL_TEMPLATE
const INITAL_TEMPLATE_DATA = {
  id: "",
  title: "",
  category: "",
  origin_price: "",
  price: "",
  unit: "",
  description: "",
  content: "",
  is_enabled: false,
  imageUrl: "",
  imagesUrl: [],
  size: "",
};

function App() {
  // 狀態管理的hook，useState
  // 登入與登入失敗的狀態管理，登入成功後才會變true
  const [isAuth, setIsAuth] = useState(false);
  const [products, setProducts] = useState([]);


  // 產品資料INITAL_TEMPLATE_DATA初始化放入templateProduct的useState
  const [templateProduct, setTemplateProduct] = useState(INITAL_TEMPLATE_DATA);
  const [modalType, setModalType] = useState('');
  // 控制分頁的狀態控制
  const [pagination, setPagination] = useState({});

  const productModalRef = useRef(null);

  // 產品的api
  const getProduct = async (page = 1) => {
    try {
      const res = await axios.get(`${BASE_URL}/v2/api/${API_PATH}/admin/products?page=${page}`,);
      // 產品的狀態放入資料
      setProducts(res.data.products);
      // 分頁的狀態放入資料
      setPagination(res.data.pagination)
    } catch (err) {
      alert('無法取得資料', err);
    }
  }


  useEffect(() => {
    // 檢查登入狀態
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("hexToken="))
      ?.split("=")[1];

    if (token) {
      axios.defaults.headers.common.Authorization = token;
    }

    // useRef的current取得Dom元素
    productModalRef.current = new bootstrap.Modal('#productModal', {
      keyboard: false,
    })

    // 確認登入得函式
    const checkUserlogin = async () => {
      try {
        await axios.post(`${BASE_URL}/v2/api/user/check`)
        setIsAuth(true);
        getProduct();
      } catch (err) {
        alert("權限檢查失敗：", err.response?.data?.message);
        setIsAuth(false);
      }
    }
    checkUserlogin();
  }, [])


  const openModal = (type, product) => {
    setModalType(type);
    setTemplateProduct({
      ...INITAL_TEMPLATE_DATA,
      ...product
    })
    productModalRef.current.show();
  }

  const closeModal = () => {
    productModalRef.current.hide();
  }


  return (
    <>
      {isAuth ? (
        <div className='container py-2'>
          <div className='row'>
            <div className='col'>
              <h2>產品列表</h2>
              <div className='text-end my-4'>
                <button type='button' className='btn btn-primary' onClick={() => openModal('create', INITAL_TEMPLATE_DATA)}>建立新產品</button>
              </div>
              <table className='table'>
                <thead className='text-center'>
                  <tr>
                    <th scope='col'>分類</th>
                    <th scope='col'>產品名稱</th>
                    <th scope='col'>原價</th>
                    <th scope='col'>售價</th>
                    <th scope='col'>是否啟用</th>
                    <th scope='col'>編輯</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr className='text-center' key={product.id}>
                      <td>{product.category}</td>
                      <th scope='row'>{product.title}</th>
                      <td>{product.origin_price}</td>
                      <td>{product.price}</td>
                      <td className={`${product.is_enabled ? "text-success" : "text-danger"}`}>{product.is_enabled ? '啟用' : '未啟用'}</td>
                      <td className='text-center'>
                        <div className="btn-group" role="group" aria-label="Basic example">
                          {/* 編輯的按鈕取得product的資料'edit',product*/}
                          <button type="button" className="btn btn-outline-success btn-sm" onClick={() => openModal('edit', product)}>編輯</button>
                          <button type="button" className="btn btn-outline-danger btn-sm" onClick={() => openModal('delete', product)}>刪除</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : <Login getProduct={getProduct} setIsAuth={setIsAuth} />}

      <ProductModal
        modalType={modalType}
        templateProduct={templateProduct}
        closeModal={closeModal}
        getProduct={getProduct}
      />
      <Pagination
        pagination={pagination}
        onChangePage={getProduct}
      />
    </>
  )
}

export default App
