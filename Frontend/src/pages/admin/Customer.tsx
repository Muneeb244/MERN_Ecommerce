import { ReactElement, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaTrash } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Column } from "react-table";
import { Skeleton } from "../../components/Loading";
import AdminSideBar from "../../components/admin/AdminSideBar";
import TableHOC from "../../components/admin/TableHOC";
import { useAllUsersQuery, useDeleteUserMutation } from "../../redux/api/userAPI";
import { RootState } from "../../redux/store";
import { CustomError } from "../../types/api-types";
import { responseToast } from "../../utils/features";

interface DataType {
  avatar: ReactElement;
  name: string;
  email: string;
  gender: string;
  role:string;
  action: ReactElement;
}

const columns: Column<DataType>[] = [
  {
    Header: "Avatar",
    accessor: "avatar",
  },
  {
    Header: "Name",
    accessor: "name",
  },
  {
    Header: "Email",
    accessor: "email",
  },
  {
    Header: "Gender",
    accessor: "gender",
  },
  {
    Header: "Role",
    accessor: "role",
  },
  {
    Header: "Action",
    accessor: "action",
  },
];

const Customer = () => {

  const { user } = useSelector((state: RootState) => state.userReducer);

  const { isLoading, data, isError, error } = useAllUsersQuery(user?._id!);


  const [rows, setRows] = useState<DataType[]>([]);

  const [deleteUser] = useDeleteUserMutation();

  const deleteHandler = async (userId: string) => {

    if(userId === user?._id!) return toast.error("cannot delete current account");

    const res = await deleteUser({userId, adminId: user?._id!});
    responseToast(res, null, "");
  }

  if (isError) {
    const err = error as CustomError;
    toast.error(err.data.error);
  }

  useEffect(() => {
    if (data)
      setRows(
        data.users.map((i) => ({
          avatar: (
            <img
              style={{
                borderRadius: "50%",
              }}
              src={i.photo}
              alt={i.name}
            />
          ),
          name: i.name,
          email: i.email,
          gender: i.gender,
          role: i.role,
          action: (
            <button onClick={() => deleteHandler(i._id)}>
              <FaTrash />
            </button>
          ),
        }))
      );
  }, [data]);

  const Table = TableHOC<DataType>(
      columns,
      rows,
      "dashboard-product-box",
      "Customers",
      rows.length > 6
    )()

  return (
    <div className="admin-container">
      {/* sidebar */}
      <AdminSideBar />

      {/* main */}
      <main>{isLoading ? <Skeleton length={15} /> : Table}</main>
    </div>
  );
}


export default Customer;
