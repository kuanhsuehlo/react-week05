import { Link, Outlet } from "react-router"

const FrontEndLayout = () => {
    return (
        <div>
            <header>
                <ul className="nav">
                    <li className="nav-item">
                        <Link className="nav-link active" aria-current="page" to="/">
                            首頁
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/product">
                            產品
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/cart">
                            購物車
                        </Link>
                    </li>
                </ul>
            </header>
            <main>
                <Outlet />
            </main>
            <footer>
                <p>© 2026 在家裡發酵</p>
            </footer>
        </div>
    )
}

export default FrontEndLayout