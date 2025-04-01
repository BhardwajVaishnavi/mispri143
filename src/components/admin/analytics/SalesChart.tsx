import React from 'react';
import {
  Box,
  Heading,
  Flex,
  Text,
  Tab,
  TabList,
  Tabs,
} from '@chakra-ui/react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const SalesChart = () => {
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

  const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const data = {
    labels,
    datasets: [
      {
        label: 'Revenue',
        data: [6500, 5900, 8000, 8100, 9600, 8800, 7400],
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
      {
        label: 'Orders',
        data: [45, 42, 56, 58, 62, 59, 48],
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
    ],
  };

  return (
    <Box>
      <Flex justify="space-between" align="center" mb={6}>
        <Heading size="md">Sales Overview</Heading>
        <Tabs size="sm" variant="soft-rounded">
          <TabList>
            <Tab>Revenue</Tab>
            <Tab>Orders</Tab>
          </TabList>
        </Tabs>
      </Flex>
      <Line options={options} data={data} height={80} />
    </Box>
  );
};

export default SalesChart;