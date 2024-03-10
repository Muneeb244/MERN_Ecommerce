import { ChangeEvent, FormEvent, useState } from "react";
import AdminSideBar from "../../../components/admin/AdminSideBar";
import { useSelector } from "react-redux";
import { userReducerInitialState } from "../../../types/reducer-types";
import { useNewProductMutation } from "../../../redux/api/productAPI";
import toast from "react-hot-toast";
import { responseToast } from "../../../utils/features";
import { useNavigate } from "react-router-dom";

const NewProduct = () => {
  const {user} = useSelector(
    (state: { userReducer: userReducerInitialState }) => state.userReducer
  );

  const [name, setName] = useState<string>("");
  const [price, setPrice] = useState<number>(1000);
  const [stock, setStock] = useState<number>(1);
  const [photo, setPhoto] = useState<string>("");
  const [category, setCategory] = useState<string>("");

  const [newProduct] = useNewProductMutation()
  const navigate = useNavigate()

  const changeImageHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const file: File | undefined = e.target.files?.[0];

    const reader = new FileReader();
    if (file) {
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        if (typeof reader.result === "string") setPhoto(reader.result);
      };
    }
  };

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if(!name || !price || stock < 0 || !photo) toast.error("Enter all fields")

    const formData = new FormData()

    formData.set("photo", photo);
    formData.set("name", name);
    formData.set("price", price.toString());
    formData.set("stock", stock.toString());
    formData.set("category", category);


    const res = await newProduct({id: user?._id!, formData});

    responseToast(res,navigate, "/admin/product")

  }

  return (
    <div className="admin-container">
      {/* sidebar */}
      <AdminSideBar />

      {/* main */}
      <main className="product-management">
        <article>
          <form onSubmit={submitHandler}>
            <h2>New Product</h2>
            <div>
              <label htmlFor="">Name</label>
              <input
                required
                type="text"
                placeholder="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="">Price</label>
              <input
                required
                type="number"
                placeholder="price"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
              />
            </div>
            <div>
              <label htmlFor="">Stock</label>
              <input
                required
                type="number"
                placeholder="stock"
                value={stock}
                onChange={(e) => setStock(Number(e.target.value))}
              />
            </div>
            <div>
              <label>Category</label>
              <input
                required
                type="text"
                placeholder="eg. laptop, camera etc"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="">Photo</label>
              <input required type="file" onChange={changeImageHandler} />
            </div>
            {photo && <img src={photo} alt="New Image" />}
            <button type="submit">Create</button>
          </form>
        </article>
      </main>
    </div>
  );
};

export default NewProduct;
