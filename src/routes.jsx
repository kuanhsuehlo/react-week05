import { createHashRouter } from "react-router-dom";
import FrontEndLayout from "./layout/FrontEndLayout";
import Products from "./views/front/Products";
import SingleProduct from "./views/front/SingleProduct";
import NotFound from "./views/front/NotFound";
import Cart from "./views/front/Cart";
import Home from "./views/front/Home";

export const routes = createHashRouter([
    {
        path: "/",
        element: <FrontEndLayout />,
        children: [
            {
                // 首頁只會有一個
                index: true,
                element: <Home />
            },
            {
                path: "product",
                element: <Products />
            },
            {
                // 要帶id
                path: "product/:id",
                element: <SingleProduct />
            },
            {
                path: "cart",
                element: <Cart />
            }
        ]
    },
    {
        // 404找不到頁面
        path: "*",
        element: <NotFound />
    }
])