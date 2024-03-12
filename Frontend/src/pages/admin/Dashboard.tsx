import { BiMaleFemale } from "react-icons/bi";
import { BsSearch } from "react-icons/bs";
import { FaRegBell } from "react-icons/fa";
import { HiTrendingDown, HiTrendingUp } from "react-icons/hi";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import userImage from "../../assets/userpic.png";
import { Skeleton } from "../../components/Loading";
import AdminSideBar from "../../components/admin/AdminSideBar";
import { BarChart, DoughnutChart } from "../../components/admin/Charts";
import DashboardTable from "../../components/admin/DashboardTable";
import { useStatsQuery } from "../../redux/api/dashboardAPI";
import { RootState } from "../../redux/store";
import { getLastMonths } from "../../utils/features";

const Dashboard = () => {
  const { user } = useSelector((state: RootState) => state.userReducer);

  const { isLoading, isError, data } = useStatsQuery(user?._id!);

  const stats = data?.stats!;

  if (isError) return <Navigate to={"/"} />;

  return (
    <div className="admin-container">
      {/* sidebar */}
      <AdminSideBar />

      {/* main */}
      <main className="dashboard">
        {isLoading ? (
          <Skeleton length={20} />
        ) : (
          <>
            {/* bar */}

            <div className="bar">
              <BsSearch />
              <input type="text" placeholder="Search for data, users, docs" />
              <FaRegBell />
              <img src={user?.photo || userImage} alt="User" />
            </div>

            {/* section1 */}

            <section className="widget-container">
              <WidgetItem
                percent={stats.changePercent.revenue}
                amount={true}
                value={stats.count.revenue}
                heading="Revenue"
                color="rgb(0,155,255)"
              />
              <WidgetItem
                percent={stats.changePercent.user}
                value={stats.count.user}
                heading="Users"
                color="rgb(0,198,202)"
              />
              <WidgetItem
                percent={stats.changePercent.order}
                value={stats.count.order}
                heading="Transaction"
                color="rgb(255,196,0)"
              />
              <WidgetItem
                percent={stats.changePercent.product}
                value={stats.count.product}
                heading="Products"
                color="rgb(76 0 255)"
              />
            </section>

            {/* Graph section */}
            <section className="graph-container">
              {/* chart */}
              <div className="revenue-chart">
                <h2>Revenue & Transaction</h2>

                {/* Graph here */}
                <BarChart
                  labels={getLastMonths().last6Months}
                  data_1={stats.chart.revenue}
                  data_2={stats.chart.order}
                  title_1="Revenue"
                  title_2="Transaction"
                  bgcolor_1="rgb(0,115,255)"
                  bgcolor_2="rgb(52,162,235,0.8)"
                />
              </div>

              {/* categories stock */}
              <div className="dashboard-categories">
                <h2>Inventory</h2>
                <div>
                  {stats.categoryCount.map((item) => {
                    const [heading, value] = Object.entries(item)[0];

                    return (
                      <CategoryItem
                        key={heading}
                        heading={heading}
                        value={Number(value)}
                        color={`hsl(${Number(value) * 4},${value}%, 50%)`}
                      />
                    );
                  })}
                </div>
              </div>
            </section>

            <section className="transaction-container">
              <div className="gender-chart">
                <h2>Gender Ratio</h2>

                <DoughnutChart
                  labels={["Female", "Male"]}
                  data={[stats.genderRatio.female, stats.genderRatio.male]}
                  backgroundColor={["hsl(340,82%,56%", "rgba(53,162,235,0.8)"]}
                  cutout={90}
                />

                <p>
                  <BiMaleFemale />
                </p>
              </div>

              {/* table */}

              <DashboardTable data={stats.latestTransaction} />
            </section>
          </>
        )}
      </main>
    </div>
  );
};

interface WidgetItemProps {
  heading: string;
  value: number;
  percent: number;
  color: string;
  amount?: boolean;
}

const WidgetItem = ({
  heading,
  value,
  percent,
  color,
  amount = false,
}: WidgetItemProps) => (
  <article className="widget">
    <div className="Widget-info">
      <p>{heading}</p>
      <h4>{amount ? `RS.${value}` : value}</h4>
      {percent > 0 ? (
        <span className="green">
          <HiTrendingUp /> +{percent}%{" "}
        </span>
      ) : (
        <span className="red">
          <HiTrendingDown /> {percent}%{" "}
        </span>
      )}
    </div>

    <div
      className="widget-circle"
      style={{
        background: `conic-gradient(
      ${color} ${(Math.abs(percent) / 100) * 360}deg,
      rgb(255, 255, 255) 0
    )`,
      }}
    >
      <span style={{ color }}>
        {percent > 0 && `${percent > 10000 ? 9999 : percent}%`}
        {percent < 0 && `${percent < -10000 ? -9999 : percent}%`}
      </span>
    </div>
  </article>
);

interface CategoryItemProps {
  color: string;
  value: number;
  heading: string;
}

// for categories
const CategoryItem = ({ color, value, heading }: CategoryItemProps) => (
  <div className="category-item">
    <h5>{heading}</h5>
    <div>
      <div
        style={{
          backgroundColor: color,
          width: `${value}%`,
        }}
      ></div>
    </div>
    <span>{value}%</span>
  </div>
);

export default Dashboard;
