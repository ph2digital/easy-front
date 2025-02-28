import React from 'react';
import {
  Box,
  Grid,
  Text,
  Flex,
  Badge,
  useColorModeValue,
} from '@chakra-ui/react';

interface StatProps {
  title: string;
  value: string;
  change: string;
  timeframe: string;
  color: string;
  icon: React.ReactNode;
}

interface DashboardStatsProps {
  stats: StatProps[];
}

const DashboardStats: React.FC<DashboardStatsProps> = ({ stats }) => {
  const bgCard = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const textColor = useColorModeValue('gray.600', 'gray.200');

  return (
    <Grid 
      templateColumns={{
        base: "1fr",
        sm: "repeat(2, 1fr)",
        lg: "repeat(4, 1fr)"
      }} 
      gap={6} 
      mb={8}
    >
      {stats.map((stat, index) => (
        <Box
          key={index}
          bg={bgCard}
          p={6}
          borderRadius="lg"
          boxShadow="sm"
          border="1px"
          borderColor={borderColor}
        >
          <Flex justify="space-between" align="center" mb={4}>
            <Text fontSize="sm" color={textColor} fontWeight="medium">
              {stat.title}
            </Text>
            <Box color={stat.color}>{stat.icon}</Box>
          </Flex>
          <Text fontSize="2xl" fontWeight="bold" mb={2}>
            {stat.value}
          </Text>
          <Flex align="center" gap={2}>
            <Badge
              colorScheme={stat.change.startsWith('+') ? 'green' : 'red'}
              fontSize="sm"
              px={2}
              py={1}
              borderRadius="full"
            >
              {stat.change}
            </Badge>
            <Text fontSize="sm" color={textColor}>
              {stat.timeframe}
            </Text>
          </Flex>
        </Box>
      ))}
    </Grid>
  );
};

export default DashboardStats;
