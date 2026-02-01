import axios from 'axios';
import { useEffect, useState } from "react"
import { useNavigate } from 'react-router';
import Swal from 'sweetalert2';


const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

const Products = () => {

    const [products, setProducts] = useState([]);
    // 切換頁面比較進階的用法useNavigate，目前了解這個太複雜的話可以使用Link單純切換
    const navigate = useNavigate();

    // 使用useEffect的hook，取得api資料
    useEffect(() => {
        const getProducts = async () => {
            try {
                const res = await axios.get(`${BASE_URL}/v2/api/${API_PATH}/products`)
                // 把資料放入setProducts裡
                setProducts(res.data.products);
            } catch (err) {
                Swal.fire({
                    icon: 'error',
                    title: '錯誤',
                    text: err.response?.data?.message || '更新失敗'
                })
            }
        }
        // 這裡要呼叫才會取得
        getProducts();
    }, []);

    const handleroduct = (id) => {
        navigate(`/product/${id}`)
        // try {
        //     const res = await axios.get(`${BASE_URL}/v2/api/${API_PATH}/product/${id}`)
        //     console.log(res.data.product);
        //     navigate(`/product/${id}`, {
        //         state: {
        //             productData: res.data.product
        //         }
        //     })
        // } catch (err) {
        //     console.log(err)
        // }
    }
    return (<div className="container">
        <div className="row">
            {/* 依照前幾次的複習，使用map迴圈把product的資料渲染出來 */}
            {products.map((product) => {
                return (<div className="col-md-4 mb-3" key={product.id}>
                    <div className="card">
                        <img src={product.imageUrl} className="card-img-top" alt={product.title} />
                        <div className="card-body">
                            <h5 className="card-title">{product.title}</h5>
                            <p className="card-text">{product.description}</p>
                            <p className="card-text">
                                <del>
                                    原價:{product.origin_price}
                                </del>
                            </p>
                            <p className="card-text">售價:{product.price}</p>
                            <p className="card-text">
                                <small>數量:{product.unit}</small>
                            </p>
                            <button type='button' className="btn btn-primary" onClick={() => handleroduct(product.id)}>查看商品</button>
                        </div>
                    </div>
                </div>)
            })}
        </div>
    </div>
    )
}

export default Products