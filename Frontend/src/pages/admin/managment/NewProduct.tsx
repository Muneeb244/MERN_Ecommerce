import { ChangeEvent, useState } from "react";
import AdminSideBar from "../../../components/admin/AdminSideBar";

const NewProduct = () => {
  const [name, setName] = useState<string>("");
  const [price, setPrice] = useState<number>();
  const [stock, setStock] = useState<number>();
  const [photo, setPhoto] = useState<string>("");

  const changeImageHandler = (e:ChangeEvent<HTMLInputElement>) => {
    
    const file:File|undefined = e.target.files?.[0];

    const reader = new FileReader();
    if(file) {
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        if(typeof reader.result === "string") setPhoto(reader.result);
      }
    }
  }

  return (
    <div className="admin-container">
      {/* sidebar */}
      <AdminSideBar />

      {/* main */}
      <main className="product-management">
        <article>
          <form action="">
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
              <label htmlFor="">Photo</label>
              <input
                required
                type="file"
                onChange={changeImageHandler}
              />
            </div>
            {
              photo && <img src={photo} alt="New Image" />
            }
            <button type="submit" >Create</button>
          </form>
        </article>
      </main>
    </div>
  );
};

export default NewProduct;
