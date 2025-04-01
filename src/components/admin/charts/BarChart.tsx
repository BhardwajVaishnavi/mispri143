import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface BarChartProps {
  title?: string;
  data?: any;
}

const BarChart = ({ title, data: providedData }: BarChartProps) => {
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const defaultData = {
    labels: ['Chocolate', 'Vanilla', 'Red Velvet', 'Black Forest', 'Fruit'],
    datasets: [
      {
        label: 'Sales',
        data: [234, 187, 156, 142, 98],
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
    ],
  };

  return (
    <div className="w-full">
      {title && <h2 className="text-lg font-semibold mb-4">{title}</h2>}
      <Bar options={options} data={providedData || defaultData} height={80} />
    </div>
  );
};

export default BarChart;
