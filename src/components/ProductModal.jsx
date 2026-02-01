import axios from 'axios';
import { useEffect, useState } from "react";


const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

const ProductModal = ({
    modalType,
    templateProduct,
    closeModal,
    getProduct,

}) => {

    const [tempData, setTempData] = useState(templateProduct);

    useEffect(() => {
        setTempData(templateProduct);
    }, [templateProduct])

    // 輸入編輯和新增的函式
    const handleModalInputChange = (e) => {
        // 和handleInputChange依樣，解構name和value，只是useState的狀態不同
        const { name, value, checked, type } = e.target;
        setTempData((preData) => ({
            ...preData,
            [name]: type === 'checkbox' ? checked : value,
        }))
    }

    // 綁定副圖片的函式
    const handleImageChange = (index, value) => {
        setTempData((pre) => {
            const newImage = [...pre.imagesUrl];
            newImage[index] = value;

            // 跟助教一起練習
            // 驗證填寫最後一個空的輸入框時，自動新增空白輸入框
            // if (
            //   value !== "" &&
            //   index === newImage.length - 1 &&
            //   newImage.length < 5
            // ) {
            //   newImage.push("");
            // }

            // // 清空輸入框時，移除最後的空白輸入框
            // if (
            //   value === "" &&
            //   newImage.length > 1 &&
            //   newImage[newImage.length - 1] === ""
            // ) {
            //   newImage.pop();
            // }


            return {
                ...pre,
                imagesUrl: newImage
            }
        })
    }

    // 新增圖片的函式
    const handleAddImage = () => {
        setTempData((pre) => {
            const newImage = [...pre.imagesUrl];
            newImage.push('');
            return {
                ...pre,
                imagesUrl: newImage
            }
        })
    }

    // 刪除圖片的函式
    const handleRemoveImage = () => {
        setTempData((pre) => {
            const newImage = [...pre.imagesUrl];
            newImage.pop('');
            return {
                ...pre,
                imagesUrl: newImage
            }
        })
    }

    const updateProduct = async (id) => {
        let url = `${BASE_URL}/v2/api/${API_PATH}/admin/product`
        let method = 'post'

        if (modalType === 'edit') {
            url = `${BASE_URL}/v2/api/${API_PATH}/admin/product/${id}`
            method = 'put'
        }

        const productData = {
            data: {
                ...tempData,
                origin_price: Number(tempData.origin_price),
                price: Number(tempData.price),
                is_enabled: tempData.is_enabled ? 1 : 0,
                imagesUrl: [...tempData.imagesUrl.filter((url) => url !== "")],
            },
        };

        try {
            const res = await axios[method](url, productData)
            console.log(res.data.message);
            alert('更新完成');
            getProduct();
            closeModal();
        } catch (err) {
            alert(err, '更新錯誤');
        }
    }

    const uploadImage = async (e) => {
        const file = e.target.files?.[0];
        if (!file) {
            alert('沒有上傳')
            return
        }
        try {
            const formData = new FormData()
            formData.append('file-to-upload', file)
            const res = await axios.post(`${BASE_URL}/v2/api/${API_PATH}/admin/upload`, formData)
            setTempData((pre) => ({
                ...pre,
                imageUrl: res.data.imageUrl
            }))
        } catch (err) {
            alert('無法取得圖片', err.res)
        }
    }

    const delProduct = async (id) => {
        try {
            const res = await axios.delete(`${BASE_URL}/api/${API_PATH}/admin/product/${id}`)
            console.log(res.data.message);
            alert("產品刪除成功！");
            getProduct();
            closeModal();
        } catch (err) {
            alert(err, '無法刪除')
        }
    }

    return (<>
        {/*Modal*/}
        <div className="modal fade" id="productModal" tabIndex="-1" aria-labelledby="productModalLabel" aria-hidden="true">
            <div className="modal-dialog modal-xl">
                <div className="modal-content border-0">
                    <div className={`modal-header bg-${modalType === 'delete' ? 'danger' : 'primary'} text-white`}>
                        <h5 id="productModalLabel" className="modal-title">
                            <span>{modalType === 'delete' ? '刪除' : modalType === 'edit' ? '編輯' : '新增'}產品</span>
                        </h5>
                        <button
                            type="button"
                            className="btn-close btn-close-white"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                        ></button>
                    </div>
                    <div className="modal-body">
                        {
                            modalType === 'delete' ? (
                                <p className="fs-4">
                                    確定要刪除
                                    <span className="text-danger">{tempData.title}</span>嗎？
                                </p>
                            ) : (
                                <div className="row">
                                    <div className="col-sm-4">
                                        <div className="mb-2">
                                            <div className="mb-3">
                                                <label htmlFor="fileUpload" className="form-label">
                                                    上傳圖片
                                                </label>
                                                <input
                                                    type="file"
                                                    name="fileUpload"
                                                    className="form-control"
                                                    id="fileUpload"
                                                    accept=".jpg,.jpeg,.png"
                                                    onChange={(e) => uploadImage(e)}
                                                />
                                            </div>
                                            <div className="mb-3">
                                                <label htmlFor="imageUrl" className="form-label">
                                                    輸入圖片網址
                                                </label>
                                                <input
                                                    type="text"
                                                    id="imageUrl"
                                                    name="imageUrl"
                                                    className="form-control"
                                                    placeholder="請輸入圖片連結"
                                                    value={tempData.imageUrl}
                                                    onChange={(e) => handleModalInputChange(e)}
                                                />
                                            </div>
                                            {tempData.imageUrl && (
                                                <img className="img-fluid" src={tempData.imageUrl} alt={tempData.title} />
                                            )}
                                        </div>
                                        <div>
                                            {tempData.imagesUrl.map((url, index) => (
                                                <div key={index}>
                                                    <label htmlFor="imageUrl" className="form-label">
                                                        輸入圖片網址
                                                    </label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        placeholder={`圖片網址${index + 1}`}
                                                        value={url}
                                                        onChange={(e) => handleImageChange(index, e.target.value)}
                                                    />
                                                    {
                                                        url && (
                                                            <img
                                                                className="img-fluid"
                                                                src={url}
                                                                alt={`副圖${index + 1}`}
                                                            />
                                                        )
                                                    }
                                                </div>
                                            ))}
                                            {/* 優化驗證的部分 */}
                                            {
                                                tempData.imagesUrl.length < 5 &&
                                                tempData.imagesUrl[tempData.imagesUrl.length - 1] !== "" &&
                                                <button className="btn btn-outline-primary btn-sm d-block w-100" onClick={() => handleAddImage()}>
                                                    新增圖片
                                                </button>
                                            }
                                        </div>
                                        <div>
                                            {
                                                tempData.imagesUrl.length >= 1 &&
                                                <button className="btn btn-outline-danger btn-sm d-block w-100" onClick={() => handleRemoveImage()}>
                                                    刪除圖片
                                                </button>
                                            }
                                        </div>
                                    </div>
                                    <div className="col-sm-8">
                                        <div className="mb-3">
                                            <label htmlFor="title" className="form-label">標題</label>
                                            <input
                                                name="title"
                                                id="title"
                                                type="text"
                                                className="form-control"
                                                placeholder="請輸入標題"
                                                value={tempData.title}
                                                onChange={(e) => handleModalInputChange(e)}
                                            />
                                        </div>

                                        <div className="row">
                                            <div className="mb-3 col-md-6">
                                                <label htmlFor="category" className="form-label">分類</label>
                                                <input
                                                    name="category"
                                                    id="category"
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="請輸入分類"
                                                    value={tempData.category}
                                                    onChange={(e) => handleModalInputChange(e)}
                                                />
                                            </div>
                                            <div className="mb-3 col-md-6">
                                                <label htmlFor="unit" className="form-label">單位</label>
                                                <input
                                                    name="unit"
                                                    id="unit"
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="請輸入單位"
                                                    value={tempData.unit}
                                                    onChange={(e) => handleModalInputChange(e)}
                                                />
                                            </div>
                                        </div>

                                        <div className="row">
                                            <div className="mb-3 col-md-6">
                                                <label htmlFor="origin_price" className="form-label">原價</label>
                                                <input
                                                    name="origin_price"
                                                    id="origin_price"
                                                    type="number"
                                                    min="0"
                                                    className="form-control"
                                                    placeholder="請輸入原價"
                                                    value={tempData.origin_price}
                                                    onChange={(e) => handleModalInputChange(e)}
                                                />
                                            </div>
                                            <div className="mb-3 col-md-6">
                                                <label htmlFor="price" className="form-label">售價</label>
                                                <input
                                                    name="price"
                                                    id="price"
                                                    type="number"
                                                    min="0"
                                                    className="form-control"
                                                    placeholder="請輸入售價"
                                                    value={tempData.price}
                                                    onChange={(e) => handleModalInputChange(e)}
                                                />
                                            </div>
                                        </div>
                                        <hr />

                                        <div className="mb-3">
                                            <label htmlFor="description" className="form-label">產品描述</label>
                                            <textarea
                                                name="description"
                                                id="description"
                                                className="form-control"
                                                placeholder="請輸入產品描述"
                                                value={tempData.description}
                                                onChange={(e) => handleModalInputChange(e)}
                                            ></textarea>
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="content" className="form-label">說明內容</label>
                                            <textarea
                                                name="content"
                                                id="content"
                                                className="form-control"
                                                placeholder="請輸入說明內容"
                                                value={tempData.content}
                                                onChange={(e) => handleModalInputChange(e)}
                                            ></textarea>
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-check-label" htmlFor="size">
                                                尺寸
                                            </label>
                                            <select
                                                id="size"
                                                name="size"
                                                className="form-select"
                                                aria-label="Default select example"
                                                value={tempData.size}
                                                onChange={(e) => handleModalInputChange(e)}
                                            >
                                                <option value="">請選擇</option>
                                                <option value="lg">六吋</option>
                                                <option value="md">八吋</option>
                                                <option value="sm">十二吋</option>
                                            </select>
                                        </div>
                                        <div className="mb-3">
                                            <div className="form-check">
                                                <input
                                                    name="is_enabled"
                                                    id="is_enabled"
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    checked={tempData.is_enabled}
                                                    onChange={(e) => handleModalInputChange(e)}
                                                />
                                                <label className="form-check-label" htmlFor="is_enabled">
                                                    是否啟用
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        }
                    </div>
                    <div className="modal-footer">
                        {modalType === 'delete' ? (
                            <button
                                type="button"
                                className="btn btn-danger"
                                onClick={() => delProduct(tempData.id)}
                            >
                                刪除
                            </button>
                        ) : (
                            <>
                                <button
                                    type="button"
                                    className="btn btn-outline-secondary"
                                    data-bs-dismiss="modal"
                                    onClick={() => closeModal()}
                                >
                                    取消
                                </button>
                                <button type="button" className="btn btn-primary"
                                    onClick={() => updateProduct(tempData.id)}
                                >確認</button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    </>)
}

export default ProductModal