import { useEffect, useState } from "react";
import { Plus, Briefcase, Users, Building2, TrendingUp, CheckCircle2 } from "lucide-react";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance.js";
import { API_PATHS } from "../../utils/apipath.js";
import DashboardLayout from "../../components/layout/DashboardLayout.jsx";
import LoadingSpinner from "../../components/LoadingSpinner.jsx";
import JobDashboardCard from "../../components/cards/JobDashboardCard.jsx";
import ApplicantDashboardCard from "../../components/cards/ApplicantDashboardCard.jsx";

const Card = ({ className, children, title, subtitle, headerAction }) => {
  return (
    <div
      className={`bg-white rounded-xl border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200 ${className}`}
    >
      {(title || headerAction) && (
        <div className="flex items-center justify-between p-6 pb-4">
          <div>
            {title && <h3 className="text-lg font-semibold text-gray-900">{title}</h3>}
            {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
          </div>
          {headerAction}
        </div>
      )}
      <div className={title ? "px-6 pb-6" : "p-6"}>{children}</div>
    </div>
  );
};

const StatCard = ({ title, value, icon: Icon, trend, trendValue, color = "blue" }) => {
  const colorClasses = {
    blue: "from-blue-500/80 to-blue-600/80",
    green: "from-emerald-500/80 to-emerald-600/80",
    purple: "from-violet-500/80 to-violet-600/80",
    orange: "from-orange-500/80 to-orange-600/80",
  };
  const iconClasses = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-emerald-50 text-emerald-600",
    purple: "bg-violet-50 text-violet-600",
    orange: "bg-orange-50 text-orange-600",
  };
  return (
    <>
      <Card className={`bg-linear-to-br ${colorClasses[color]} text-white border-0`}>
        <div className="flex items-center justify-between ">
          <div className="">
            <p className="text-white/80 text-sm font-medium ">{title}</p>
            <p className="text-3xl font-bold mt-1">{value}</p>
            {trend && (
              <div className="flex items-center mt-2 text-sm">
                <TrendingUp className="size-4 mr-1" />
                <span className="font-medium">{trendValue}</span>
              </div>
            )}
          </div>
          <div className={`rounded-xl p-3 shadow-sm ${iconClasses[color]}`}>
            <Icon className="size-6" />
          </div>
        </div>
      </Card>
    </>
  );
};

const EmployerDashboard = () => {
  const navigate = useNavigate();

  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const getDashboardOverView = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get(API_PATHS.DASHBOARD.OVERVIEW);
      if (response.status === 200) {
        setDashboardData(response.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    getDashboardOverView();
    return () => {};
  }, []);
  return (
    <DashboardLayout activeMenu={"employer-dashboard"}>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div className=" mx-auto space-y-8 mb-96">
          {/* Dashboard Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <StatCard
              title="Active jobs"
              value={dashboardData?.counts?.totalActiveJobs || 0}
              icon={Briefcase}
              trend={true}
              trendValue={`${dashboardData?.counts?.trends?.activeJobs || 0}%`}
              color="blue"
            />
            <StatCard
              title="Total Application"
              value={dashboardData?.counts?.totalApplication || 0}
              icon={Users}
              trend={true}
              trendValue={`${dashboardData?.counts?.trends?.totalApplication || 0}%`}
              color="green"
            />
            <StatCard
              title="Hired"
              value={dashboardData?.counts?.totalHired || 0}
              icon={CheckCircle2}
              trend={true}
              trendValue={`${dashboardData?.counts?.totalHired?.totalApplication || 0}%`}
              color="purple"
            />
          </div>
          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 ">
            <Card
              title="Recent Job Posts"
              subtitle="Your latest job postings"
              headerAction={
                <button className="" onClick={() => navigate("/manage-jobs")}>
                  View all
                </button>
              }
            >
              <div className="space-y-3 ">
                {dashboardData?.data?.recentJobs?.slice(0, 3)?.map((job, index) => (
                  <JobDashboardCard key={index} job={job} />
                ))}
              </div>
            </Card>

            <Card
              title="Recent Applications"
              subtitle="Latest candidate application"
              headerAction={
                <button
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  onClick={() => navigate("/manage-jobs")}
                >
                  View all
                </button>
              }
            >
              <div className="space-y-3">
                {dashboardData?.data?.recentApplications?.slice(0, 3)?.map((data, index) => (
                  <ApplicantDashboardCard
                    key={index}
                    applicant={data?.applicant}
                    position={
                      typeof data?.job === "object" ? data?.job?.title : ""
                    }
                    time={
                      data?.updatedAt ? moment(data.updatedAt).fromNow() : ""
                    }
                  />
                ))}
              </div>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card title="Quick Actions" subtitle="Common task to get you started">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                {
                  title: "Post new jobs",
                  icon: Plus,
                  color: "bg-blue-50 text-blue-700",
                  path: "/post-job",
                },
                {
                  title: "Review Applications",
                  icon: Users,
                  color: "bg-green-50 text-green-700",
                  path: "/manage-jobs",
                },
                {
                  title: "Company Settings",
                  icon: Building2,
                  color: "bg-orange-50 text-orange-700",
                  path: "/company-profile",
                },
              ].map((action, index) => (
                <button key={index} className="flex items-center space-x-3 rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-sm  transition-all duration-200 text-left p-4" onClick={() => navigate(action.path)}>
                  <div className={`p-2 rounded-lg ${action.color}`}>
                    <action.icon className={``} />
                  </div>
                  <span className="font-medium text-gray-900">{action.title}</span>
                </button>
              ))}
            </div>
          </Card>
        </div>
      )}
    </DashboardLayout>
  );
};

export default EmployerDashboard;
