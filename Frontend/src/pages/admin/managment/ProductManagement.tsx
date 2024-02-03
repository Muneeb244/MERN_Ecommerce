import { ChangeEvent, FormEvent, useState } from "react";
import AdminSideBar from "../../../components/admin/AdminSideBar";

const ProductManagement = () => {

  const img =
  "https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8c2hvZXN8ZW58MHx8MHx8&w=1000&q=804";

  const [name, setName] = useState<string>("Puma shoes");
  const [price, setPrice] = useState<number>(2000);
  const [stock, setStock] = useState<number>(10);
  const [photo, setPhoto] = useState<string>(img);

  const [nameUpdate, setNameUpdate] = useState<string>(name);
  const [priceUpdate, setPriceUpdate] = useState<number>(price);
  const [stockUpdate, setStockUpdate] = useState<number>(stock);
  const [photoUpdate, setPhotoUpdate] = useState<string>(photo);

  const changeImageHandler = (e:ChangeEvent<HTMLInputElement>) => {
    
    const file:File|undefined = e.target.files?.[0];

    const reader = new FileReader();
    if(file) {
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        if(typeof reader.result === "string") setPhotoUpdate(reader.result);
      }
    }
  }

  const submitHandler = (e:FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setName(nameUpdate);
    setPrice(priceUpdate);
    setStock(stockUpdate);
    setPhoto(photoUpdate);
    
  }

  return (
    <div className="admin-container">
      {/* sidebar */}
      <AdminSideBar />

      {/* main */}
      <main className="product-management">

    {/* image section */}

    <section>
      <strong>ID - adfafdasf</strong>
      <img src={photo} alt="product" />
      <p>{name}</p>
      {
        stock > 0 ? (
          <span className="green">{stock} Available</span>
        ) :
        (
          <span className="red">Not Available</span>
        )
      }
      <h3>${price}</h3>
    </section>

        <article>
          <form onSubmit={submitHandler} >
            <h2>Manage</h2>
            <div>
              <label htmlFor="">Name</label>
              <input
                required
                type="text"
                placeholder="name"
                value={nameUpdate}
                onChange={(e) => setNameUpdate(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="">Price</label>
              <input
                required
                type="number"
                placeholder="price"
                value={priceUpdate}
                onChange={(e) => setPriceUpdate(Number(e.target.value))}
              />
            </div>
            <div>
              <label htmlFor="">Stock</label>
              <input
                required
                type="number"
                placeholder="stock"
                value={stockUpdate}
                onChange={(e) => setStockUpdate(Number(e.target.value))}
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
              photoUpdate && <img src={photoUpdate} alt="New Image" />
            }
            <button type="submit" >Update</button>
          </form>
        </article>
      </main>
    </div>
  );
};


export default ProductManagement