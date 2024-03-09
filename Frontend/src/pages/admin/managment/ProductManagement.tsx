import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import AdminSideBar from "../../../components/admin/AdminSideBar";
import { useSelector } from "react-redux";
import { userReducerInitialState } from "../../../types/reducer-types";
import {
  useDeleteProductMutation,
  useProductDetailsQuery,
  useUpdateProductMutation,
} from "../../../redux/api/productAPI";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { server } from "../../../redux/store";
import { Skeleton } from "../../../components/Loading";
import { responseToast } from "../../../utils/features";
import { FaTrash } from "react-icons/fa";

const ProductManagement = () => {
  const { user } = useSelector(
    (state: { userReducer: userReducerInitialState }) => state.userReducer
  );

  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isLoading, isError } = useProductDetailsQuery(id!);

  const { price, photo, name, stock, category } = data?.product || {
    photo: "",
    category: "",
    name: "",
    price: 0,
    stock: 0,
  };

  const [nameUpdate, setNameUpdate] = useState<string>(name);
  const [priceUpdate, setPriceUpdate] = useState<number>(price);
  const [stockUpdate, setStockUpdate] = useState<number>(stock);
  const [photoUpdate, setPhotoUpdate] = useState<string>("");
  const [categoryUpdate, setCategoryUpdate] = useState<string>(category);

  const [updateProduct] = useUpdateProductMutation();
  const [deleteProduct] = useDeleteProductMutation();

  const changeImageHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const file: File | undefined = e.target.files?.[0];

    const reader = new FileReader();
    if (file) {
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        if (typeof reader.result === "string") setPhotoUpdate(reader.result);
      };
    }
  };

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData();

    if (nameUpdate) formData.set("name", nameUpdate);
    if (priceUpdate) formData.set("price", priceUpdate.toString());
    if (stockUpdate !== undefined)
      formData.set("stock", stockUpdate.toString());
    if (photoUpdate) formData.set("photo", photoUpdate);
    if (categoryUpdate) formData.set("category", category);

    const res = await updateProduct({
      formData,
      userId: user?._id!,
      productId: data?.product._id!,
    });

    responseToast(res, navigate, "/admin/products");
  };

  const deleteHandler = async () => {
    const res = await deleteProduct({
      userId: user?._id!,
      productId: data?.product._id!,
    });

    responseToast(res, navigate, "/admin/products");
  };

  useEffect(() => {
    if (data) {
      setNameUpdate(data?.product.name);
      setPriceUpdate(data?.product.price);
      setStockUpdate(data?.product.stock);
      setCategoryUpdate(data?.product.category);
    }
  }, [data]);

  if (isError) return <Navigate to={'/404'} />

  return (
    <div className="admin-container">
      {/* sidebar */}
      <AdminSideBar />

      {/* main */}
      <main className="product-management">
        {/* image section */}

        {isLoading ? (
          <Skeleton length={20} />
        ) : (
          <>
            <section>
              <strong>ID - {data?.product._id}</strong>
              <img src={`${server}/${photo}`} alt="product" />
              <p>{name}</p>
              {stock > 0 ? (
                <span className="green">{stock} Available</span>
              ) : (
                <span className="red">Not Available</span>
              )}
              <h3>${price}</h3>
            </section>

            <article>
              <button className="product-delete-btn" onClick={deleteHandler}>
                <FaTrash />
              </button>
              <form onSubmit={submitHandler}>
                <h2>Manage</h2>
                <div>
                  <label htmlFor="">Name</label>
                  <input
                    type="text"
                    placeholder="name"
                    value={nameUpdate}
                    onChange={(e) => setNameUpdate(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="">Price</label>
                  <input
                    type="number"
                    placeholder="price"
                    value={priceUpdate}
                    onChange={(e) => setPriceUpdate(Number(e.target.value))}
                  />
                </div>
                <div>
                  <label htmlFor="">Stock</label>
                  <input
                    type="number"
                    placeholder="stock"
                    value={stockUpdate}
                    onChange={(e) => {
                      console.log(stockUpdate)
                      setStockUpdate(Number(e.target.value))
                    }}
                  />
                </div>
                <div>
                  <label htmlFor="">Category</label>
                  <input
                    type="text"
                    placeholder="eg. laptop, camera etc"
                    value={categoryUpdate}
                    onChange={(e) => setCategoryUpdate(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="">Photo</label>
                  <input type="file" onChange={changeImageHandler} />
                </div>
                {photoUpdate && <img src={photoUpdate} alt="New Image" />}
                <button type="submit">Update</button>
              </form>
            </article>
          </>
        )}
      </main>
    </div>
  );
};

export default ProductManagement;
