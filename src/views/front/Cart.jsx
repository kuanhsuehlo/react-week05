import axios from "axios";
import { useEffect, useState } from "react";
import Swal from 'sweetalert2';
import { currency } from "../../utils/filter";



const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

const Cart = () => {
    // 這是一個陣列資料
    const [cart, serCart] = useState([])
    // 取得購物車資料
    // 使用useEffect初始化頁面，執行api


    useEffect(() => {
        const getCart = async () => {
            try {
                const res = await axios.get(`${BASE_URL}/v2/api/${API_PATH}/cart`)
                serCart(res.data.data);
            } catch (err) {
                Swal.fire({
                    icon: 'error',
                    title: '錯誤',
                    text: err.response?.data?.message || '取得購物車失敗'
                })
            }
        }
        getCart();
    }, []);

    const updateCart = async (cartId, productId, qty = 1) => {
        try {
            const data = {
                product_id: productId,
                qty
            }
            const res = await axios.put(`${BASE_URL}/v2/api/${API_PATH}/cart/${cartId}`, { data })
            Swal.fire({
                icon: 'success',
                title: '成功',
                text: res.data.message,
                timer: 1500,
                showConfirmButton: false
            })
            const resUpdate = await axios.get(`${BASE_URL}/v2/api/${API_PATH}/cart`)
            serCart(resUpdate.data.data);
        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: '錯誤',
                text: err.response?.data?.message || '更新失敗'
            })
        }
    }

    const delCart = async (cartId) => {
        const result = await Swal.fire({
            title: '確定要刪除嗎?',
            text: "此操作無法復原!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: '確定刪除',
            cancelButtonText: '取消'
        })

        if (result.isConfirmed) {
            try {
                await axios.delete(`${BASE_URL}/v2/api/${API_PATH}/cart/${cartId}`)
                Swal.fire({
                    icon: 'success',
                    title: '已刪除!',
                    text: '商品已從購物車移除',
                    timer: 1500,
                    showConfirmButton: false
                })
                const resDel = await axios.get(`${BASE_URL}/v2/api/${API_PATH}/cart`)
                serCart(resDel.data.data);
            } catch (err) {
                Swal.fire({
                    icon: 'error',
                    title: '錯誤',
                    text: err.response?.data?.message || '刪除失敗'
                })
            }
        }
    }

    const deleteCartAll = async () => {
        const result = await Swal.fire({
            title: '確定要清空購物車嗎?',
            text: "所有商品都會被移除!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: '確定清空',
            cancelButtonText: '取消'
        })

        if (result.isConfirmed) {
            try {
                await axios.delete(`${BASE_URL}/v2/api/${API_PATH}/carts`)
                Swal.fire({
                    icon: 'success',
                    title: '已清空!',
                    text: '購物車已清空',
                    timer: 1500,
                    showConfirmButton: false
                })
                const resDelAll = await axios.get(`${BASE_URL}/v2/api/${API_PATH}/cart`)
                serCart(resDelAll.data.data);
            } catch (err) {
                Swal.fire({
                    icon: 'error',
                    title: '錯誤',
                    text: err.response?.data?.message || '清空失敗'
                })
            }
        }
    }
    return (<div className="container">
        <h2>購物車列表</h2>
        <div className="text-end mt-4">
            <button
                type="button"
                className="btn btn-outline-danger"
                onClick={(e) => deleteCartAll(e)}>
                清空購物車
            </button>
        </div>
        <table className="table">
            <thead>
                <tr>
                    <th scope="col"></th>
                    <th scope="col">品名</th>
                    <th scope="col">數量/單位</th>
                    <th scope="col">小計</th>
                </tr>
            </thead>
            <tbody>
                {cart?.carts?.map((cartProduct) => {
                    return (<tr key={cartProduct.id}>
                        <td>
                            <button
                                type="button"
                                className="btn btn-outline-danger btn-sm"
                                onClick={() => delCart(cartProduct.id)}
                            >
                                刪除
                            </button>
                        </td>
                        <th scope="row">{cartProduct.product.title}</th>
                        <td>
                            <div className="input-group input-group-sm mb-3">
                                {/* 可以增加產品的數量，使用put的方法加入 */}
                                <input type="number"
                                    className="form-control"
                                    aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm"
                                    defaultValue={cartProduct.qty}
                                    onChange={(e) => updateCart(cartProduct.id, cartProduct.product_id, Number(e.target.value))}
                                />
                                <span className="input-group-text" id="inputGroup-sizing-sm">份</span>
                            </div>
                        </td>
                        <td className="text-end">{currency(cartProduct.final_total)}</td>
                    </tr>)
                })}
            </tbody>
            <tfoot>
                <tr>
                    <td className="text-end" colSpan="3">
                        總計
                    </td>
                    <td className="text-end">{currency(cart.final_total)}</td>
                </tr>
            </tfoot>
        </table>
    </div>)
}

export default Cart