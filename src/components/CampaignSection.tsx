import React from 'react';
import {
  Box,
  Flex,
  Button,
  Heading,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import CampaignTable from './CampaignTable';

interface CampaignSectionProps {
  loading: boolean;
  error: string | null;
  campaigns: any[];
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

const CampaignSection: React.FC<CampaignSectionProps> = ({
  loading,
  error,
  campaigns,
  activeFilter,
  onFilterChange,
}) => {
  const bgCard = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const textColor = useColorModeValue('gray.600', 'gray.200');
  const headingColor = useColorModeValue('gray.700', 'white');

  return (
    <Box
      bg={bgCard}
      borderRadius="lg"
      boxShadow="sm"
      border="1px"
      borderColor={borderColor}
      overflow="hidden"
      mb={8}
    >
      <Flex 
        p={{ base: 4, md: 6 }} 
        borderBottom="1px" 
        borderColor={borderColor} 
        justify="space-between" 
        align="center"
        flexDirection={{ base: "column", sm: "row" }}
        gap={{ base: 4, sm: 0 }}
      >
        <Heading size="md" color={headingColor}>Campanhas</Heading>
        <Flex gap={2} flexWrap="wrap" justify={{ base: "center", sm: "flex-end" }}>
          <Button
            size="sm"
            variant={activeFilter === 'all' ? 'solid' : 'ghost'}
            colorScheme="blue"
            onClick={() => onFilterChange('all')}
          >
            Todas
          </Button>
          <Button
            size="sm"
            variant={activeFilter === 'active' ? 'solid' : 'ghost'}
            colorScheme="blue"
            onClick={() => onFilterChange('active')}
          >
            Ativas
          </Button>
          <Button
            size="sm"
            variant={activeFilter === 'paused' ? 'solid' : 'ghost'}
            colorScheme="blue"
            onClick={() => onFilterChange('paused')}
          >
            Pausadas
          </Button>
        </Flex>
      </Flex>

      <Box p={{ base: 4, md: 6 }}>
        {loading ? (
          <Box p={6} textAlign="center">
            <Text color={textColor}>Carregando campanhas...</Text>
          </Box>
        ) : error ? (
          <Box p={6} textAlign="center">
            <Text color="red.500">{error}</Text>
          </Box>
        ) : (
          <Box overflowX="auto">
            <CampaignTable campaigns={campaigns} />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default CampaignSection;
