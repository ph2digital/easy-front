import React from 'react';
import styles from './styles/PrivacyPolicy.module.css';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className={styles.container}>
      <h1>Política de Privacidade</h1>
      <p><strong>Última atualização: 02/12/2024</strong></p>
      <p>Bem-vindo à nossa plataforma de Software de Campanhas Publicitárias Automatizadas com Marketplace para Infoprodutores, Afiliados e Anunciantes. Esta Política de Privacidade descreve como coletamos, usamos, armazenamos e protegemos suas informações pessoais e dados quando você utiliza nossos serviços.</p>
      
      <h2>1. Informações Coletadas</h2>
      <p>Coletamos informações para fornecer uma experiência eficiente e personalizada em nossa plataforma. Isso inclui:</p>
      
      <h3>1.1 Informações Fornecidas por Você</h3>
      <ul>
        <li>Nome, e-mail, telefone e outros dados fornecidos durante o cadastro.</li>
        <li>Informações financeiras, como dados de pagamento, para processar compras e comissões.</li>
        <li>Dados dos infoprodutos cadastrados no marketplace.</li>
      </ul>
      
      <h3>1.2 Informações Coletadas Automaticamente</h3>
      <ul>
        <li>Dados de navegação, como endereço IP, tipo de navegador, páginas visitadas e tempo de acesso.</li>
        <li>Informações de dispositivos, como sistema operacional e identificadores únicos.</li>
        <li>Dados de desempenho de campanhas publicitárias, como CPA, CTR e ROI, integrados pelas APIs dos canais de anúncio (Meta Ads, Google Ads, TikTok Ads).</li>
      </ul>
      
      <h3>1.3 Dados de Terceiros</h3>
      <ul>
        <li>Informações de contas conectadas (como Meta Ads, Google Ads e TikTok Ads).</li>
        <li>Dados de desempenho e histórico de campanhas obtidos via integrações.</li>
      </ul>
      
      <h2>2. Uso das Informações</h2>
      <p>Utilizamos as informações coletadas para os seguintes fins:</p>
      <ul>
        <li><strong>Operação do Sistema</strong>: Criar, gerenciar e otimizar campanhas publicitárias.</li>
        <li><strong>Marketplace</strong>: Facilitar a conexão entre produtores e afiliados, incluindo gestão de comissões.</li>
        <li><strong>Melhorias do Produto</strong>: Analisar métricas de uso para aprimorar funcionalidades e a experiência do usuário.</li>
        <li><strong>Comunicação</strong>: Enviar notificações importantes, atualizações de funcionalidades e materiais promocionais.</li>
        <li><strong>Conformidade Legal</strong>: Garantir a conformidade com obrigações legais e regulatórias.</li>
      </ul>
      
      <h2>3. Compartilhamento de Dados</h2>
      <p>Não compartilhamos suas informações pessoais com terceiros, exceto nas seguintes situações:</p>
      <ul>
        <li><strong>Parceiros de Integração</strong>: Compartilhamos dados com plataformas de anúncios (Meta Ads, Google Ads, TikTok Ads) para facilitar a criação e gestão de campanhas.</li>
        <li><strong>Afiliados</strong>: Dados de desempenho de campanhas podem ser compartilhados com afiliados no contexto do marketplace.</li>
        <li><strong>Processadores de Pagamento</strong>: Informações financeiras podem ser compartilhadas com terceiros responsáveis por processar pagamentos.</li>
        <li><strong>Requisição Legal</strong>: Compartilharemos dados se for exigido por lei ou ordem judicial.</li>
      </ul>
      
      <h2>4. Segurança dos Dados</h2>
      <p>Adotamos medidas técnicas e organizacionais para proteger suas informações contra acesso não autorizado, perda ou destruição. Isso inclui:</p>
      <ul>
        <li>Uso de criptografia para transmissão de dados sensíveis.</li>
        <li>Controle de acesso rigoroso para limitar o uso de dados a pessoas autorizadas.</li>
        <li>Auditorias regulares para verificar a conformidade com normas de segurança.</li>
      </ul>
      
      <h2>5. Retenção de Dados</h2>
      <p>Armazenamos suas informações enquanto forem necessárias para oferecer nossos serviços ou conforme exigido por lei. Você pode solicitar a exclusão de seus dados, sujeito a requisitos legais ou contratuais.</p>
      
      <h2>6. Seus Direitos</h2>
      <p>Você possui os seguintes direitos em relação aos seus dados:</p>
      <ul>
        <li><strong>Acesso e Correção</strong>: Solicitar acesso ou corrigir informações pessoais incorretas.</li>
        <li><strong>Exclusão</strong>: Solicitar a exclusão de suas informações pessoais.</li>
        <li><strong>Revogação de Consentimento</strong>: Retirar seu consentimento para usos específicos de seus dados.</li>
        <li><strong>Portabilidade de Dados</strong>: Solicitar a transferência de seus dados para outra plataforma.</li>
      </ul>
      <p>Para exercer seus direitos, entre em contato conosco pelo e-mail assessoriaph2@gmail.com.</p>
      
      <h2>7. Cookies</h2>
      <p>Utilizamos cookies para melhorar sua experiência em nossa plataforma. Eles ajudam a:</p>
      <ul>
        <li>Lembrar preferências do usuário.</li>
        <li>Fornecer conteúdo personalizado.</li>
        <li>Analisar métricas de desempenho do site.</li>
      </ul>
      <p>Você pode gerenciar suas configurações de cookies em seu navegador.</p>
      
      <h2>8. Atualizações desta Política</h2>
      <p>Esta Política de Privacidade pode ser atualizada periodicamente. Recomendamos que você revise este documento regularmente para estar informado sobre nossas práticas de privacidade.</p>
      
      <h2>9. Contato</h2>
      <p>Se tiver dúvidas ou preocupações sobre esta Política de Privacidade ou nossas práticas de proteção de dados, entre em contato através do e-mail assessoriaph2@gmail.com.</p>
      
      <p><strong>Confiamos que esta Política de Privacidade oferece a transparência necessária para que você utilize nossa plataforma com segurança.</strong></p>
    </div>
  );
};

export default PrivacyPolicy;