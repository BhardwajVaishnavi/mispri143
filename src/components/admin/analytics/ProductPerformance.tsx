import React from 'react';
import {
  Box,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Progress,
  Text,
} from '@chakra-ui/react';

const ProductPerformance = () => {
  const products = [
    {
      name: 'Chocolate Cake',
      sales: 234,
      revenue: 23400,
      growth: 15.4,
    },
    {
      name: 'Vanilla Cake',
      sales: 187,
      revenue: 18700,
      growth: 8.2,
    },
    {
      name: 'Red Velvet',
      sales: 156,
      revenue: 15600,
      growth: -3.8,
    },
    {
      name: 'Black Forest',
      sales: 142,
      revenue: 14200,
      growth: 12.5,
    },
    {
      name: 'Fruit Cake',
      sales: 98,
      revenue: 9800,
      growth: 5.7,
    },
  ];

  return (
    <Box>
      <Heading size="md" mb={6}>Top Products</Heading>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Product</Th>
            <Th isNumeric>Sales</Th>
            <Th isNumeric>Growth</Th>
          </Tr>
        </Thead>
        <Tbody>
          {products.map((product) => (
            <Tr key={product.name}>
              <Td>
                <Text fontWeight="medium">{product.name}</Text>
                <Text fontSize="sm" color="gray.500">₹{product.revenue}</Text>
              </Td>
              <Td isNumeric>{product.sales}</Td>
              <Td isNumeric>
                <Text
                  color={product.growth >= 0 ? "green.500" : "red.500"}
                  fontWeight="medium"
                >
                  {product.growth}%
                </Text>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default ProductPerformance;