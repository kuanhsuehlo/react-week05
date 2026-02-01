import axios from 'axios';
import { useState } from 'react'


const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

const Login = ({ getProduct, setIsAuth }) => {
    const [account, setAccount] = useState({
        username: '',
        password: ''
    });

    // 帳號和密碼輸入的函式
    const handleInputChange = (e) => {
        // 解構name和value
        const { name, value } = e.target;
        setAccount((preData) => ({
            ...preData, [name]: value
        }))
    }

    // 登入帳密的函式
    const handlerLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${BASE_URL}/v2/admin/signin`, account)
            const { token, expired } = res.data;
            // document.cookie = `hexToken=${token}; expires=${expired}`;
            document.cookie = `hexToken=${token}; expires=${new Date(expired).toUTCString()}; path=/`;

            axios.defaults.headers.common['Authorization'] = token;

            // 這兩個沒辦法單獨移過來，所以只能用props傳遞
            setIsAuth(true);
            getProduct();
        } catch (err) {
            console.log(err);
        }
    }

    return (<div className="d-flex flex-column justify-content-center align-items-center vh-100">
        <h1 className="mb-5">請先登入</h1>
        <form onSubmit={handlerLogin} className="d-flex flex-column gap-3">
            <div className="form-floating mb-3">
                <input name='username' value={account.username} onChange={handleInputChange} type="email" className="form-control" id="username" placeholder="name@example.com" />
                <label htmlFor="username">Email address</label>
            </div>
            <div className="form-floating">
                <input name='password' value={account.password} onChange={handleInputChange} type="password" className="form-control" id="password" placeholder="Password" />
                <label htmlFor="password">Password</label>
            </div>
            <button className="btn btn-primary">登入</button>
        </form>
        <p className="mt-5 mb-3 text-muted">&copy; 2026~∞ - 在家裡發酵</p>
    </div>
    )
}

export default Login