import AdminSideBar from "../../../components/admin/AdminSideBar";
import { BarChart } from "../../../components/admin/Charts";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "Aug",
  "Sept",
  "Oct",
  "Nov",
  "Dec",
];

const BarCharts = () => {
  return (
    <div className="admin-container">
      <AdminSideBar />

      <main className="chart-container">
        <h1>Bar Charts</h1>
        <section>
          <BarChart
            data_1={[299, 444, 343, 556, 778, 455, 990]}
            data_2={[300, 144, 433, 655, 237, 755, 190]}
            title_1="Products"
            title_2="Users"
            bgcolor_1={`hsl(260,50%,30%)`}
            bgcolor_2={`hsl(180,40%,50%)`}
          />
          <h2>TOP SELLING PRODUCTS & TOP CUSTOMERS</h2>
        </section>

        <section>
          <BarChart
            horizontal={true}
            data_1={[
              200, 444, 343, 556, 778, 455, 990, 444, 122, 334, 890, 909,
            ]}
            data_2={[]}
            title_1="Products"
            title_2=""
            bgcolor_1={`hsl(260,50%,30%)`}
            bgcolor_2=""
            labels={months}
          />
          <h2>ORDERS THROUGHOUT THE YEAR</h2>
        </section>
      </main>
    </div>
  );
};

export default BarCharts;
