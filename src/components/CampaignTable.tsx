import React from 'react';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Box,
} from '@chakra-ui/react';

interface Campaign {
  id: string;
  name: string;
  status: string;
  budget: number;
  spent: number;
  impressions: number;
  clicks: number;
  ctr: number;
}

interface CampaignTableProps {
  campaigns: Campaign[];
}

const CampaignTable: React.FC<CampaignTableProps> = ({ campaigns }) => {
  return (
    <Box overflowX="auto">
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Nome</Th>
            <Th>Status</Th>
            <Th isNumeric>Orçamento</Th>
            <Th isNumeric>Gasto</Th>
            <Th isNumeric>Impressões</Th>
            <Th isNumeric>Cliques</Th>
            <Th isNumeric>CTR</Th>
          </Tr>
        </Thead>
        <Tbody>
          {campaigns.map((campaign) => (
            <Tr key={campaign.id}>
              <Td>{campaign.name}</Td>
              <Td>
                <Badge
                  colorScheme={campaign.status === 'active' ? 'green' : 'gray'}
                >
                  {campaign.status === 'active' ? 'Ativo' : 'Inativo'}
                </Badge>
              </Td>
              <Td isNumeric>
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                }).format(campaign.budget)}
              </Td>
              <Td isNumeric>
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                }).format(campaign.spent)}
              </Td>
              <Td isNumeric>
                {new Intl.NumberFormat('pt-BR').format(campaign.impressions)}
              </Td>
              <Td isNumeric>
                {new Intl.NumberFormat('pt-BR').format(campaign.clicks)}
              </Td>
              <Td isNumeric>
                {campaign.ctr.toFixed(2)}%
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default CampaignTable;
