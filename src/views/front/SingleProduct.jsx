import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import Swal from 'sweetalert2';

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

const SingleProduct = () => {
    // 這個是想要練習助教的useNavigate跟著做一遍
    // 這個是利用useLocation來傳遞產品資料
    // const location = useLocation();
    // const product = location.state?.productData

    // 使用useParams取得products頁面的id
    const { id } = useParams();
    const [product, setProduct] = useState();

    useEffect(() => {
        const handleroduct = async (id) => {
            try {
                const res = await axios.get(`${BASE_URL}/v2/api/${API_PATH}/product/${id}`)
                setProduct(res.data.product);
            } catch (err) {
                Swal.fire({
                    icon: 'error',
                    title: '錯誤',
                    text: err.response?.data?.message || '更新失敗'
                })
            }
        }
        handleroduct(id);
    }, [id]);

    const addToCart = async (id, qty = 1) => {
        const data = {
            product_id: id,
            qty
        }
        try {
            const res = await axios.post(`${BASE_URL}/v2/api/${API_PATH}/cart`, { data })
            Swal.fire({
                icon: 'success',
                title: '成功',
                text: res.data.message,
                timer: 1500,
                showConfirmButton: false
            })
        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: '錯誤',
                text: err.response?.data?.message || '更新失敗'
            })
        }
    }

    return (!product ? <h2>查無產品</h2> : (<div className='container'>
        <div className='row'>
            <div className="col mb-3" key={product.id}>
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
                        {/* 寫入加入購物車 */}
                        <button type='button' className="btn btn-primary" onClick={() => addToCart(product.id)}>加入購物車</button>
                    </div>
                </div>
            </div>
        </div>
    </div>)
    )
}

export default SingleProduct