import React from 'react';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend,
  ArcElement,
  PointElement,
  LineElement
} from 'chart.js';
import { Bar, Pie, Line } from 'react-chartjs-2';
import { Equipment, Rental, Maintenance } from '../../types';

ChartJS.register(
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

interface ChartsProps {
  equipment: Equipment[];
  rentals: Rental[];
  maintenance: Maintenance[];
}

const Charts: React.FC<ChartsProps> = ({ equipment, rentals, maintenance }) => {
  // Equipment by category
  const categories = equipment.reduce((acc: Record<string, number>, item) => {
    acc[item.category] = (acc[item.category] || 0) + 1;
    return acc;
  }, {});

  const categoryData = {
    labels: Object.keys(categories),
    datasets: [
      {
        label: 'Equipment by Category',
        data: Object.values(categories),
        backgroundColor: [
          'rgba(54, 162, 235, 0.7)',
          'rgba(255, 99, 132, 0.7)',
          'rgba(255, 206, 86, 0.7)',
          'rgba(75, 192, 192, 0.7)',
          'rgba(153, 102, 255, 0.7)',
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // Equipment by status
  const statuses = equipment.reduce((acc: Record<string, number>, item) => {
    acc[item.status] = (acc[item.status] || 0) + 1;
    return acc;
  }, {});

  const statusData = {
    labels: Object.keys(statuses),
    datasets: [
      {
        label: 'Equipment by Status',
        data: Object.values(statuses),
        backgroundColor: [
          'rgba(75, 192, 192, 0.7)',
          'rgba(255, 99, 132, 0.7)',
          'rgba(255, 206, 86, 0.7)',
          'rgba(153, 102, 255, 0.7)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // Rental status distribution
  const rentalStatuses = rentals.reduce((acc: Record<string, number>, rental) => {
    acc[rental.status] = (acc[rental.status] || 0) + 1;
    return acc;
  }, {});

  const rentalStatusData = {
    labels: Object.keys(rentalStatuses),
    datasets: [
      {
        label: 'Rentals by Status',
        data: Object.values(rentalStatuses),
        backgroundColor: [
          'rgba(54, 162, 235, 0.7)',
          'rgba(75, 192, 192, 0.7)',
          'rgba(255, 206, 86, 0.7)',
          'rgba(255, 99, 132, 0.7)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // Generate last 6 months for the timeline
  const getLastSixMonths = () => {
    const months = [];
    const today = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const month = new Date(today.getFullYear(), today.getMonth() - i, 1);
      months.push(month.toLocaleString('default', { month: 'short' }));
    }
    
    return months;
  };

  const monthLabels = getLastSixMonths();

  // Mock rental timeline data
  const rentalTimelineData = {
    labels: monthLabels,
    datasets: [
      {
        label: 'Number of Rentals',
        data: [4, 6, 8, 12, 9, 15],
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
    ],
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Equipment by Category</h3>
        <Pie data={categoryData} />
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Equipment Status</h3>
        <Bar 
          data={statusData}
          options={{
            responsive: true,
            plugins: {
              legend: {
                display: false,
              },
            },
            scales: {
              y: {
                beginAtZero: true,
              },
            },
          }}
        />
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Rental Status Distribution</h3>
        <Pie data={rentalStatusData} />
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Rental Timeline</h3>
        <Line 
          data={rentalTimelineData}
          options={{
            responsive: true,
            plugins: {
              legend: {
                display: false,
              },
            },
            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  precision: 0,
                },
              },
            },
          }}
        />
      </div>
    </div>
  );
};

export default Charts;