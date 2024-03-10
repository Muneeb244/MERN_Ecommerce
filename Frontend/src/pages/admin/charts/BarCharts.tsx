import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { Skeleton } from "../../../components/Loading";
import AdminSideBar from "../../../components/admin/AdminSideBar";
import { BarChart } from "../../../components/admin/Charts";
import { useBarQuery } from "../../../redux/api/dashboardAPI";
import { RootState } from "../../../redux/store";
import { CustomError } from "../../../types/api-types";
import { getLastMonths } from "../../../utils/features";


const {last12Months, last6Months} = getLastMonths()

const BarCharts = () => {

  const { user } = useSelector((state: RootState) => state.userReducer);

  const { isLoading, isError, data, error } = useBarQuery(user?._id!);

  const products = data?.charts.products || [];
  const orders = data?.charts.orders || [];
  const users = data?.charts.users || [];

  if (isError) {
    const err = error as CustomError;
    toast.error(err.data.error);
  }

  return (
    <div className="admin-container">
      <AdminSideBar />

      <main className="chart-container">
        <h1>Bar Charts</h1>
        {isLoading ? <Skeleton length={20} /> : 
        <>
        <section>
          <BarChart
            data_1={products}
            data_2={users}
            title_1="Products"
            title_2="Users"
            bgcolor_1={`hsl(260,50%,30%)`}
            bgcolor_2={`hsl(180,40%,50%)`}
            labels={last6Months}
          />
          <h2>TOP SELLING PRODUCTS & TOP CUSTOMERS</h2>
        </section>

        <section>
          <BarChart
            horizontal={true}
            data_1={orders}
            data_2={[]}
            title_1="Orders"
            title_2=""
            bgcolor_1={`hsl(260,50%,30%)`}
            bgcolor_2=""
            labels={last12Months}
          />
          <h2>ORDERS THROUGHOUT THE YEAR</h2>
        </section>
        </>}
      </main>
    </div>
  );
};

export default BarCharts;
