import { useEffect } from 'react';
import {
  UsersIcon,
  BuildingOfficeIcon,
  BriefcaseIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';
import { Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import useDashboardStore from '@/stores/dashboardStore';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Dashboard = () => {
  const { 
    stats, 
    attendanceData, 
    departmentData,
    loading,
    fetchStats,
    fetchAttendance,
    fetchDepartments
  } = useDashboardStore();

  useEffect(() => {
    fetchStats();
    fetchAttendance();
    fetchDepartments();
  }, []);

  if (loading.stats || loading.attendance || loading.departments) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="spinner" />
      </div>
    );
  }

  const cards = [
    {
      name: 'Total Employees',
      value: stats?.employeeCount || 0,
      icon: UsersIcon,
      change: '+4.75%',
      changeType: 'positive',
    },
    {
      name: 'Departments',
      value: stats?.departmentCount || 0,
      icon: BuildingOfficeIcon,
      change: '0%',
      changeType: 'neutral',
    },
    {
      name: 'Open Positions',
      value: stats?.openPositions || 0,
      icon: BriefcaseIcon,
      change: '+2.5%',
      changeType: 'positive',
    },
    {
      name: 'Present Today',
      value: stats?.presentToday || 0,
      icon: ClockIcon,
      change: '-3%',
      changeType: 'negative',
    },
  ];

  const attendanceChartData = {
    labels: attendanceData?.labels || [],
    datasets: [
      {
        label: 'Attendance',
        data: attendanceData?.data || [],
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
    ],
  };

  const departmentChartData = {
    labels: departmentData?.labels || [],
    datasets: [
      {
        data: departmentData?.data || [],
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
        ],
      },
    ],
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <div
            key={card.name}
            className="relative overflow-hidden rounded-lg bg-white px-4 pb-12 pt-5 shadow sm:px-6 sm:pt-6"
          >
            <dt>
              <div className="absolute rounded-md bg-primary-500 p-3">
                <card.icon className="h-6 w-6 text-white" aria-hidden="true" />
              </div>
              <p className="ml-16 truncate text-sm font-medium text-gray-500">
                {card.name}
              </p>
            </dt>
            <dd className="ml-16 flex items-baseline pb-6 sm:pb-7">
              <p className="text-2xl font-semibold text-gray-900">
                {card.value}
              </p>
              <p
                className={`ml-2 flex items-baseline text-sm font-semibold ${
                  card.changeType === 'positive'
                    ? 'text-green-600'
                    : card.changeType === 'negative'
                    ? 'text-red-600'
                    : 'text-gray-500'
                }`}
              >
                {card.change}
              </p>
            </dd>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-lg bg-white p-6 shadow">
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            Attendance Trend
          </h3>
          <div className="mt-4 h-[300px]">
            <Line
              data={attendanceChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'bottom',
                  },
                },
              }}
            />
          </div>
        </div>

        <div className="rounded-lg bg-white p-6 shadow">
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            Employee Distribution by Department
          </h3>
          <div className="mt-4 h-[300px]">
            <Doughnut
              data={departmentChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'bottom',
                  },
                },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 