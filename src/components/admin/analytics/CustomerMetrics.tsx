import React from 'react';
import {
  Box,
  Heading,
  VStack,
  HStack,
  Text,
  CircularProgress,
  CircularProgressLabel,
} from '@chakra-ui/react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const CustomerMetrics = () => {
  const data = {
    labels: ['New', 'Returning', 'Loyal'],
    datasets: [
      {
        data: [30, 45, 25],
        backgroundColor: [
          'rgba(255, 99, 132, 0.8)',
          'rgba(54, 162, 235, 0.8)',
          'rgba(75, 192, 192, 0.8)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(75, 192, 192, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
    },
    cutout: '70%',
  };

  return (
    <Box>
      <Heading size="md" mb={6}>Customer Analysis</Heading>
      <HStack spacing={8} align="start">
        <Box flex={1}>
          <Doughnut data={data} options={options} />
        </Box>
        <VStack spacing={4} align="start" flex={1}>
          <Box>
            <Text fontSize="sm" color="gray.500">Customer Satisfaction</Text>
            <CircularProgress value={92} color="green.400" size="80px">
              <CircularProgressLabel>92%</CircularProgressLabel>
            </CircularProgress>
          </Box>
          <Box>
            <Text fontSize="sm" color="gray.500">Retention Rate</Text>
            <CircularProgress value={78} color="blue.400" size="80px">
              <CircularProgressLabel>78%</CircularProgressLabel>
            </CircularProgress>
          </Box>
        </VStack>
      </HStack>
    </Box>
  );
};

export default CustomerMetrics;