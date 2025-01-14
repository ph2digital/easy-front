# Fluxos de Ações no Chat

Esta documentação descreve as sequências de funções programadas no chat.

## 1. Inicialização do Usuário

### Sequência de Funções
1. `useEffect` para carregar clientes ativos e contas do Google e Facebook.
2. `getSessionFromLocalStorage` para obter a sessão do usuário.

### Referência de Código
- `Chat.tsx`
- `useChatFunctions.ts`

## 2. Envio da Primeira Mensagem

### Sequência de Funções
1. `sendFirstMessage` para enviar a primeira mensagem.
2. `setInitialMessages` para definir as mensagens iniciais.
3. `handleOptionClick` para lidar com o clique da opção.

### Referência de Código
- `Chat.tsx`
- `useChatFunctions.ts`

## 3. Manipulação de Mensagens do Usuário

### Sequência de Funções
1. `handleSendMessage` para enviar a mensagem.
2. `getGPTResponseWithToken` para obter a resposta do GPT.

### Referência de Código
- `Chat.tsx`
- `useChatFunctions.ts`
- `api.ts`

## 4. Recebimento de Respostas

### Sequência de Funções
1. `fetchMessagesForThread` para buscar mensagens da thread.
2. `setMessages` para definir as mensagens no estado.

### Referência de Código
- `Chat.tsx`
- `useChatFunctions.ts`
- `api.ts`

## 5. Adição de Comentários às Mensagens

### Sequência de Funções
1. `handleAddComment` para adicionar um comentário.
2. `handleCommentSubmit` para enviar o comentário.

### Referência de Código
- `Chat.tsx`
- `useChatFunctions.ts`
- `api.ts`

## 6. Alternância entre Chat e Navegador

### Sequência de Funções
1. `useEffect` para adicionar event listeners aos botões de navegação.
2. `setBrowserUrl` para definir a URL do navegador.

### Referência de Código
- `Chat.tsx`

## 7. Login com Facebook

### Sequência de Funções
1. `handleFacebookLogin` para iniciar o login com Facebook.
2. `linkMetaAds` para abrir a janela de OAuth do Facebook.

### Referência de Código
- `Chat.tsx`
- `useChatFunctions.ts`
- `api.ts`

## 8. Polling para Novas Mensagens

### Sequência de Funções
1. `useEffect` para definir o intervalo de polling.
2. `fetchMessagesForThread` para buscar novas mensagens.

### Referência de Código
- `useChatFunctions.ts`
- `api.ts`

## 9. Alternância de Tela Cheia

### Sequência de Funções
1. `toggleFullScreen` para alternar o modo de tela cheia.

### Referência de Código
- `Chat.tsx`

## 10. Seleção de Conta

### Sequência de Funções
1. `handleAccountClick` para selecionar uma conta.

### Referência de Código
- `Chat.tsx`
- `useChatFunctions.ts`

## 11. Seleção de Thread

### Sequência de Funções
1. `handleThreadClick` para selecionar uma thread.
2. `fetchMessages` para buscar mensagens da thread.

### Referência de Código
- `Chat.tsx`
- `useChatFunctions.ts`

## 12. Login com Google

### Sequência de Funções
1. `signInWithGoogle` para iniciar o login com Google.
2. `saveGoogleSessionToDatabase` para salvar a sessão no banco de dados.

### Referência de Código
- `Chat.tsx`
- `useChatFunctions.ts`
- `api.ts`

## 13. Polling de Mensagens

### Sequência de Funções
1. `useEffect` para definir o intervalo de polling.
2. `fetchMessagesForThread` para buscar novas mensagens.

### Referência de Código
- `useChatFunctions.ts`
- `api.ts`

## 14. Submissão de Comentários

### Sequência de Funções
1. `handleAddComment` para adicionar um comentário.
2. `handleCommentSubmit` para enviar o comentário.

### Referência de Código
- `Chat.tsx`
- `useChatFunctions.ts`
- `api.ts`

## 15. Vinculação de Conta

### Sequência de Funções
1. `linkAccountFromHome` para vincular contas a partir da tela inicial.

### Referência de Código
- `api.ts`

## 16. Criação de Campanha

### Sequência de Funções
1. `createCampaign` para criar uma nova campanha.

### Referência de Código
- `api.ts`

## 17. Atualização de Campanha

### Sequência de Funções
1. `updateMetaAdsCampaign` para atualizar uma campanha existente.

### Referência de Código
- `api.ts`

## 18. Exclusão de Campanha

### Sequência de Funções
1. `deleteGoogleAdsCampaign` para excluir uma campanha existente.

### Referência de Código
- `api.ts`

## 19. Criação de Grupo de Anúncios

### Sequência de Funções
1. `createGoogleAdsAdGroup` para criar um novo grupo de anúncios.

### Referência de Código
- `api.ts`

## 20. Exclusão de Grupo de Anúncios

### Sequência de Funções
1. `deleteGoogleAdsAdGroup` para excluir um grupo de anúncios existente.

### Referência de Código
- `api.ts`

## 21. Criação de Anúncio

### Sequência de Funções
1. `createGoogleAdsAd` para criar um novo anúncio.

### Referência de Código
- `api.ts`

## 22. Criação de Palavra-chave

### Sequência de Funções
1. `createGoogleAdsKeyword` para criar uma nova palavra-chave.

### Referência de Código
- `api.ts`

## 23. Criação de Audiência

### Sequência de Funções
1. `createGoogleAdsAudience` para criar uma nova audiência.

### Referência de Código
- `api.ts`

## 24. Criação de Posicionamento

### Sequência de Funções
1. `createGoogleAdsPlacement` para criar um novo posicionamento.

### Referência de Código
- `api.ts`

## 25. Upload de Imagem

### Sequência de Funções
1. `uploadGoogleAdsImage` para fazer upload de imagens para anúncios.

### Referência de Código
- `api.ts`

## 26. Criação de CTA

### Sequência de Funções
1. `createGoogleAdsCTA` para criar novos CTAs (Call to Actions).

### Referência de Código
- `api.ts`

## 27. Ativação de Conta

### Sequência de Funções
1. `activateAccount` para ativar contas.

### Referência de Código
- `api.ts`

## 28. Visualização de Insights de Campanha

### Sequência de Funções
1. `fetchMetaAdsCampaignInsights` para visualizar insights de campanhas.

### Referência de Código
- `api.ts`

## 29. Visualização de Insights de Conjunto de Anúncios

### Sequência de Funções
1. `fetchMetaAdsAdsetInsights` para visualizar insights de conjuntos de anúncios.

### Referência de Código
- `api.ts`

## 30. Visualização de Insights de Anúncio

### Sequência de Funções
1. `fetchMetaAdsAdInsights` para visualizar insights de anúncios.

### Referência de Código
- `api.ts`

## 31. Criação de Audiência Personalizada

### Sequência de Funções
1. `createCustomAudience` para criar audiências personalizadas.

### Referência de Código
- `api.ts`

## 32. Recuperação de Audiências Personalizadas

### Sequência de Funções
1. `fetchCustomAudiences` para recuperar audiências personalizadas.

### Referência de Código
- `api.ts`

## 33. Criação de Campanha Guiada

### Sequência de Funções
1. `createGuidedCampaign` para criar campanhas guiadas.

### Referência de Código
- `api.ts`

## 34. Criação de Campanha Automática

### Sequência de Funções
1. `createAutomaticCampaign` para criar campanhas automáticas.

### Referência de Código
- `api.ts`

## 35. Upload de Arquivos Criativos

### Sequência de Funções
1. `uploadCreativeFiles` para fazer upload de arquivos criativos para anúncios.

### Referência de Código
- `api.ts`

## 36. Solicitação de Criativo Baseado em Concorrente

### Sequência de Funções
1. `requestCreativeBasedOnCompetitor` para solicitar criativos baseados em anúncios de concorrentes.

### Referência de Código
- `api.ts`

## 37. Atualização de Conjunto de Anúncios

### Sequência de Funções
1. `updateMetaAdsAdset` para atualizar conjuntos de anúncios existentes.

### Referência de Código
- `api.ts`

## 38. Atualização de Anúncio

### Sequência de Funções
1. `updateGoogleAdsCampaign` para atualizar anúncios existentes.

### Referência de Código
- `api.ts`

## 39. Recuperação de Contas do Google Ads

### Sequência de Funções
1. `fetchGoogleAdsAccounts` para recuperar contas do Google Ads.

### Referência de Código
- `api.ts`

## 40. Recuperação de Contas de Anúncios do Facebook

### Sequência de Funções
1. `fetchFacebookAdAccounts` para recuperar contas de anúncios do Facebook.

### Referência de Código
- `api.ts`

## 41. Verificação de Contas de Anúncios

### Sequência de Funções
1. `checkAdsAccounts` para verificar contas de anúncios.

### Referência de Código
- `api.ts`

## 42. Verificação de Contas de Anúncios do Facebook

### Sequência de Funções
1. `checkFacebookAdAccounts` para verificar contas de anúncios do Facebook.

### Referência de Código
- `api.ts`

## 43. Recuperação de Campanhas do Google Ads

### Sequência de Funções
1. `fetchGoogleAdsCampaigns` para recuperar campanhas do Google Ads.

### Referência de Código
- `api.ts`

## 44. Criação de Campanha do Google Ads

### Sequência de Funções
1. `createGoogleAdsCampaign` para criar novas campanhas do Google Ads.

### Referência de Código
- `api.ts`

## 45. Atualização de Campanha do Google Ads

### Sequência de Funções
1. `updateGoogleAdsCampaign` para atualizar campanhas do Google Ads.

### Referência de Código
- `api.ts`

## 46. Exclusão de Campanha do Google Ads

### Sequência de Funções
1. `deleteGoogleAdsCampaign` para excluir campanhas do Google Ads.

### Referência de Código
- `api.ts`

## 47. Criação de Grupo de Anúncios do Google Ads

### Sequência de Funções
1. `createGoogleAdsAdGroup` para criar novos grupos de anúncios do Google Ads.

### Referência de Código
- `api.ts`

## 48. Exclusão de Grupo de Anúncios do Google Ads

### Sequência de Funções
1. `deleteGoogleAdsAdGroup` para excluir grupos de anúncios do Google Ads.

### Referência de Código
- `api.ts`

## 49. Criação de Anúncio do Google Ads

### Sequência de Funções
1. `createGoogleAdsAd` para criar novos anúncios do Google Ads.

### Referência de Código
- `api.ts`

## 50. Criação de Palavra-chave do Google Ads

### Sequência de Funções
1. `createGoogleAdsKeyword` para criar novas palavras-chave do Google Ads.

### Referência de Código
- `api.ts`

## 51. Criação de Audiência do Google Ads

### Sequência de Funções
1. `createGoogleAdsAudience` para criar novas audiências do Google Ads.

### Referência de Código
- `api.ts`

## 52. Criação de Posicionamento do Google Ads

### Sequência de Funções
1. `createGoogleAdsPlacement` para criar novos posicionamentos do Google Ads.

### Referência de Código
- `api.ts`