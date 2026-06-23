-- ============================================================
-- Migration 002: Dados de demonstração (Seed)
-- ============================================================

-- Inserir configurações iniciais
INSERT INTO public.settings (
    platform_name,
    description,
    organization,
    official_domain,
    legal_disclaimer
) VALUES (
    'Central de Conhecimento para IA',
    'Conteúdos confiáveis, organizados e acessíveis para pessoas e agentes de inteligência artificial.',
    'Organização Demonstrativa',
    'http://localhost:3000',
    'Este conteúdo é uma reprodução organizada para consulta. Em caso de divergência, prevalece a publicação disponibilizada pela fonte oficial.'
) ON CONFLICT DO NOTHING;

-- Inserir categorias
INSERT INTO public.categories (name, slug, description, icon, display_order) VALUES
    ('Atendimento ao Usuário', 'atendimento', 'Manuais e guias sobre atendimento ao cidadão e ao usuário.', '🤝', 1),
    ('Segurança da Informação', 'seguranca', 'Políticas, normas e procedimentos de segurança da informação.', '🔒', 2),
    ('Regulamentos e Normas', 'regulamentos', 'Regulamentos internos, normas e procedimentos operacionais.', '📋', 3),
    ('Procedimentos Administrativos', 'procedimentos', 'Guias e procedimentos para gestão administrativa.', '⚙️', 4),
    ('Legislação', 'legislacao', 'Leis, decretos, portarias e outros atos normativos.', '⚖️', 5),
    ('Tecnologia', 'tecnologia', 'Manuais técnicos, documentação de sistemas e TI.', '💻', 6),
    ('Saúde', 'saude', 'Protocolos, guias e informações de saúde pública.', '🏥', 7),
    ('Educação', 'educacao', 'Materiais, diretrizes e guias educacionais.', '📚', 8)
ON CONFLICT (slug) DO NOTHING;

-- Inserir itens de demonstração
-- Os IDs de categoria serão resolvidos por subconsulta
INSERT INTO public.knowledge_items (
    title,
    subtitle,
    slug,
    description,
    summary,
    source_type,
    raw_text,
    content_html,
    content_markdown,
    keywords,
    category_id,
    organization,
    status,
    visibility,
    review_status,
    published_at,
    content_hash
)
SELECT
    'Manual de Atendimento ao Usuário',
    'Diretrizes e procedimentos para atendimento de excelência',
    'manual-de-atendimento',
    'Manual completo com diretrizes, procedimentos e boas práticas para atendimento ao usuário, presencial e remoto.',
    'Este manual estabelece as normas e melhores práticas para o atendimento ao usuário, visando garantir qualidade, eficiência e satisfação em todos os pontos de contato da organização.',
    'manual',
    'MANUAL DE ATENDIMENTO AO USUÁRIO

1. OBJETIVO
Este manual tem por objetivo estabelecer diretrizes e procedimentos padronizados para o atendimento ao usuário nos canais presencial, telefônico e digital, garantindo qualidade, eficiência e satisfação.

2. ABRANGÊNCIA
Aplica-se a todos os colaboradores que realizam atendimento ao público, independentemente do setor ou canal utilizado.

3. PRINCÍPIOS DO ATENDIMENTO
3.1 Respeito e cordialidade em todas as interações.
3.2 Clareza e objetividade nas informações prestadas.
3.3 Agilidade no tempo de resposta e resolução.
3.4 Transparência sobre prazos e procedimentos.
3.5 Privacidade e proteção dos dados do usuário.

4. ATENDIMENTO PRESENCIAL
4.1 Cumprimentar o usuário ao chegar.
4.2 Identificar-se com nome e setor.
4.3 Ouvir atentamente a demanda.
4.4 Fornecer informações precisas e completas.
4.5 Registrar o atendimento no sistema.

5. ATENDIMENTO POR TELEFONE
5.1 Atender até o terceiro toque.
5.2 Saudar com nome e setor.
5.3 Falar de forma clara e pausada.
5.4 Confirmar dados antes de encerrar.

6. ATENDIMENTO DIGITAL
6.1 Responder em até 24 horas úteis.
6.2 Usar linguagem formal e acessível.
6.3 Incluir todas as informações solicitadas.

7. SITUAÇÕES ESPECIAIS
7.1 Usuários com deficiência: oferecer atendimento prioritário e adaptado.
7.2 Reclamações: registrar e encaminhar ao setor responsável em até 2 dias úteis.
7.3 Casos urgentes: acionar supervisor imediatamente.

8. AVALIAÇÃO DA QUALIDADE
O atendimento será avaliado periodicamente por meio de pesquisas de satisfação e indicadores de desempenho.',
    '<h1>Manual de Atendimento ao Usuário</h1>
<p><strong>Diretrizes e procedimentos para atendimento de excelência</strong></p>

<h2>1. Objetivo</h2>
<p>Este manual tem por objetivo estabelecer diretrizes e procedimentos padronizados para o atendimento ao usuário nos canais presencial, telefônico e digital, garantindo qualidade, eficiência e satisfação.</p>

<h2>2. Abrangência</h2>
<p>Aplica-se a todos os colaboradores que realizam atendimento ao público, independentemente do setor ou canal utilizado.</p>

<h2>3. Princípios do Atendimento</h2>
<ul>
<li>Respeito e cordialidade em todas as interações</li>
<li>Clareza e objetividade nas informações prestadas</li>
<li>Agilidade no tempo de resposta e resolução</li>
<li>Transparência sobre prazos e procedimentos</li>
<li>Privacidade e proteção dos dados do usuário</li>
</ul>

<h2>4. Atendimento Presencial</h2>
<ol>
<li>Cumprimentar o usuário ao chegar</li>
<li>Identificar-se com nome e setor</li>
<li>Ouvir atentamente a demanda</li>
<li>Fornecer informações precisas e completas</li>
<li>Registrar o atendimento no sistema</li>
</ol>

<h2>5. Atendimento por Telefone</h2>
<ol>
<li>Atender até o terceiro toque</li>
<li>Saudar com nome e setor</li>
<li>Falar de forma clara e pausada</li>
<li>Confirmar dados antes de encerrar</li>
</ol>

<h2>6. Atendimento Digital</h2>
<ol>
<li>Responder em até 24 horas úteis</li>
<li>Usar linguagem formal e acessível</li>
<li>Incluir todas as informações solicitadas</li>
</ol>

<h2>7. Situações Especiais</h2>
<ul>
<li><strong>Usuários com deficiência:</strong> oferecer atendimento prioritário e adaptado</li>
<li><strong>Reclamações:</strong> registrar e encaminhar ao setor responsável em até 2 dias úteis</li>
<li><strong>Casos urgentes:</strong> acionar supervisor imediatamente</li>
</ul>

<h2>8. Avaliação da Qualidade</h2>
<p>O atendimento será avaliado periodicamente por meio de pesquisas de satisfação e indicadores de desempenho.</p>',
    '# Manual de Atendimento ao Usuário

## 1. Objetivo
Este manual tem por objetivo estabelecer diretrizes e procedimentos padronizados para o atendimento ao usuário.

## 2. Abrangência
Aplica-se a todos os colaboradores que realizam atendimento ao público.

## 3. Princípios do Atendimento
- Respeito e cordialidade
- Clareza e objetividade
- Agilidade no tempo de resposta
- Transparência sobre prazos
- Privacidade e proteção dos dados',
    ARRAY['atendimento', 'usuário', 'manual', 'procedimentos', 'qualidade'],
    (SELECT id FROM public.categories WHERE slug = 'atendimento'),
    'Organização Demonstrativa',
    'published',
    'public',
    'reviewed',
    NOW() - INTERVAL '30 days',
    md5('manual-atendimento-v1')
WHERE NOT EXISTS (SELECT 1 FROM public.knowledge_items WHERE slug = 'manual-de-atendimento');

INSERT INTO public.knowledge_items (
    title, subtitle, slug, description, summary, source_type,
    raw_text, content_html, content_markdown, keywords, category_id,
    organization, status, visibility, review_status, published_at, content_hash
)
SELECT
    'Política Institucional de Segurança da Informação',
    'Normas e diretrizes para proteção de dados e sistemas',
    'politica-de-seguranca',
    'Política que estabelece os princípios, diretrizes e responsabilidades para a segurança da informação na organização.',
    'Esta política estabelece as normas, diretrizes e responsabilidades para garantir a confidencialidade, integridade e disponibilidade das informações e sistemas da organização.',
    'manual',
    'POLÍTICA INSTITUCIONAL DE SEGURANÇA DA INFORMAÇÃO

1. OBJETIVO
Estabelecer princípios, diretrizes e responsabilidades para proteger as informações e sistemas da organização contra acessos não autorizados, perdas e danos.

2. ÂMBITO DE APLICAÇÃO
Esta política se aplica a todos os colaboradores, prestadores de serviço e parceiros que acessam sistemas, redes ou informações da organização.

3. PRINCÍPIOS FUNDAMENTAIS
3.1 Confidencialidade: acesso somente a pessoas autorizadas.
3.2 Integridade: informações precisas e completas.
3.3 Disponibilidade: acesso quando necessário.
3.4 Autenticidade: identidade verificada dos usuários.

4. RESPONSABILIDADES
4.1 Comitê de Segurança: aprovar e revisar a política.
4.2 Gestores: garantir conformidade em seus setores.
4.3 Colaboradores: cumprir as normas estabelecidas.
4.4 TI: implementar controles técnicos.

5. CONTROLES DE ACESSO
5.1 Senhas com no mínimo 12 caracteres.
5.2 Autenticação multifator para sistemas críticos.
5.3 Revisão semestral de acessos.
5.4 Bloqueio automático após inatividade.

6. USO ACEITÁVEL
6.1 Recursos tecnológicos para fins profissionais.
6.2 Proibido: instalação de software não autorizado.
6.3 Proibido: compartilhamento de credenciais.
6.4 Proibido: acesso a conteúdo impróprio.

7. INCIDENTES DE SEGURANÇA
7.1 Notificar imediatamente ao time de TI.
7.2 Preservar evidências.
7.3 Cooperar com a investigação.

8. PENALIDADES
O descumprimento sujeitará o infrator às sanções previstas no regimento interno.',
    '<h1>Política Institucional de Segurança da Informação</h1>
<p><strong>Normas e diretrizes para proteção de dados e sistemas</strong></p>

<h2>1. Objetivo</h2>
<p>Estabelecer princípios, diretrizes e responsabilidades para proteger as informações e sistemas da organização contra acessos não autorizados, perdas e danos.</p>

<h2>2. Âmbito de Aplicação</h2>
<p>Esta política se aplica a todos os colaboradores, prestadores de serviço e parceiros que acessam sistemas, redes ou informações da organização.</p>

<h2>3. Princípios Fundamentais</h2>
<ul>
<li><strong>Confidencialidade:</strong> acesso somente a pessoas autorizadas</li>
<li><strong>Integridade:</strong> informações precisas e completas</li>
<li><strong>Disponibilidade:</strong> acesso quando necessário</li>
<li><strong>Autenticidade:</strong> identidade verificada dos usuários</li>
</ul>

<h2>4. Responsabilidades</h2>
<ul>
<li><strong>Comitê de Segurança:</strong> aprovar e revisar a política</li>
<li><strong>Gestores:</strong> garantir conformidade em seus setores</li>
<li><strong>Colaboradores:</strong> cumprir as normas estabelecidas</li>
<li><strong>TI:</strong> implementar controles técnicos</li>
</ul>

<h2>5. Controles de Acesso</h2>
<ul>
<li>Senhas com no mínimo 12 caracteres</li>
<li>Autenticação multifator para sistemas críticos</li>
<li>Revisão semestral de acessos</li>
<li>Bloqueio automático após inatividade</li>
</ul>

<h2>6. Uso Aceitável</h2>
<ul>
<li>Recursos tecnológicos para fins profissionais</li>
<li>Proibido: instalação de software não autorizado</li>
<li>Proibido: compartilhamento de credenciais</li>
</ul>

<h2>7. Incidentes de Segurança</h2>
<ol>
<li>Notificar imediatamente ao time de TI</li>
<li>Preservar evidências</li>
<li>Cooperar com a investigação</li>
</ol>',
    '# Política Institucional de Segurança da Informação

## 1. Objetivo
Proteger informações e sistemas contra acessos não autorizados.

## 2. Princípios
- Confidencialidade
- Integridade
- Disponibilidade
- Autenticidade',
    ARRAY['segurança', 'informação', 'política', 'dados', 'acesso', 'proteção'],
    (SELECT id FROM public.categories WHERE slug = 'seguranca'),
    'Organização Demonstrativa',
    'published',
    'public',
    'reviewed',
    NOW() - INTERVAL '20 days',
    md5('politica-seguranca-v1')
WHERE NOT EXISTS (SELECT 1 FROM public.knowledge_items WHERE slug = 'politica-de-seguranca');

INSERT INTO public.knowledge_items (
    title, subtitle, slug, description, summary, source_type,
    raw_text, content_html, content_markdown, keywords, category_id,
    organization, status, visibility, review_status, published_at, content_hash
)
SELECT
    'Regulamento de Serviço Público',
    'Normas de conduta e funcionamento dos serviços',
    'regulamento-de-servico',
    'Regulamento que define as normas de funcionamento, direitos e obrigações relacionados à prestação dos serviços públicos da organização.',
    'Este regulamento define as normas de funcionamento, os direitos dos usuários e as obrigações da organização na prestação dos serviços públicos.',
    'manual',
    'REGULAMENTO DE SERVIÇO PÚBLICO

1. DISPOSIÇÕES GERAIS
1.1 Este regulamento disciplina a prestação dos serviços públicos oferecidos pela organização.
1.2 Os serviços serão prestados com isonomia, impessoalidade e eficiência.

2. HORÁRIO DE FUNCIONAMENTO
2.1 Atendimento presencial: segunda a sexta, das 8h às 17h.
2.2 Serviços digitais: disponíveis 24 horas, 7 dias por semana.
2.3 Exceções: feriados nacionais, estaduais e municipais.

3. DIREITOS DOS USUÁRIOS
3.1 Receber atendimento cortês e respeitoso.
3.2 Obter informações claras sobre os serviços.
3.3 Ter suas demandas registradas e acompanhadas.
3.4 Apresentar reclamações e sugestões.
3.5 Receber resposta em prazo razoável.

4. DEVERES DOS USUÁRIOS
4.1 Fornecer informações verdadeiras.
4.2 Apresentar documentação completa.
4.3 Respeitar os servidores e demais usuários.
4.4 Cumprir os requisitos do serviço solicitado.

5. PRAZOS
5.1 Serviços simples: até 5 dias úteis.
5.2 Serviços complexos: até 30 dias úteis.
5.3 Urgências: conforme legislação específica.

6. RECURSOS E RECLAMAÇÕES
6.1 Reclamações pelo canal de ouvidoria.
6.2 Prazo de resposta: 20 dias úteis.
6.3 Recurso administrativo disponível.',
    '<h1>Regulamento de Serviço Público</h1>
<p><strong>Normas de conduta e funcionamento dos serviços</strong></p>

<h2>1. Disposições Gerais</h2>
<p>Este regulamento disciplina a prestação dos serviços públicos oferecidos pela organização, com isonomia, impessoalidade e eficiência.</p>

<h2>2. Horário de Funcionamento</h2>
<ul>
<li>Atendimento presencial: segunda a sexta, das 8h às 17h</li>
<li>Serviços digitais: disponíveis 24 horas, 7 dias por semana</li>
<li>Exceções: feriados nacionais, estaduais e municipais</li>
</ul>

<h2>3. Direitos dos Usuários</h2>
<ul>
<li>Receber atendimento cortês e respeitoso</li>
<li>Obter informações claras sobre os serviços</li>
<li>Ter suas demandas registradas e acompanhadas</li>
<li>Apresentar reclamações e sugestões</li>
<li>Receber resposta em prazo razoável</li>
</ul>

<h2>4. Deveres dos Usuários</h2>
<ul>
<li>Fornecer informações verdadeiras</li>
<li>Apresentar documentação completa</li>
<li>Respeitar os servidores e demais usuários</li>
</ul>

<h2>5. Prazos</h2>
<table>
<thead><tr><th>Tipo</th><th>Prazo</th></tr></thead>
<tbody>
<tr><td>Serviços simples</td><td>Até 5 dias úteis</td></tr>
<tr><td>Serviços complexos</td><td>Até 30 dias úteis</td></tr>
<tr><td>Urgências</td><td>Conforme legislação</td></tr>
</tbody>
</table>

<h2>6. Recursos e Reclamações</h2>
<ol>
<li>Reclamações pelo canal de ouvidoria</li>
<li>Prazo de resposta: 20 dias úteis</li>
<li>Recurso administrativo disponível</li>
</ol>',
    NULL,
    ARRAY['regulamento', 'serviço', 'público', 'atendimento', 'direitos', 'prazos'],
    (SELECT id FROM public.categories WHERE slug = 'regulamentos'),
    'Organização Demonstrativa',
    'published',
    'public',
    'reviewed',
    NOW() - INTERVAL '15 days',
    md5('regulamento-servico-v1')
WHERE NOT EXISTS (SELECT 1 FROM public.knowledge_items WHERE slug = 'regulamento-de-servico');

INSERT INTO public.knowledge_items (
    title, subtitle, slug, description, summary, source_type,
    raw_text, content_html, content_markdown, keywords, category_id,
    organization, status, visibility, review_status, published_at, content_hash
)
SELECT
    'Guia de Procedimentos Administrativos',
    'Passo a passo dos principais fluxos administrativos',
    'guia-de-procedimentos',
    'Guia prático com os procedimentos administrativos mais utilizados, incluindo fluxos, formulários e orientações.',
    'Guia prático e objetivo com os principais procedimentos administrativos, fluxos de aprovação e orientações para execução das atividades cotidianas da organização.',
    'manual',
    'GUIA DE PROCEDIMENTOS ADMINISTRATIVOS

1. INTRODUÇÃO
Este guia descreve os principais procedimentos administrativos, orientando colaboradores na execução das atividades cotidianas com eficiência e conformidade.

2. SOLICITAÇÃO DE MATERIAIS
2.1 Preencher formulário eletrônico no sistema.
2.2 Informar justificativa e quantidade.
2.3 Aguardar aprovação do gestor.
2.4 Retirar material no almoxarifado mediante protocolo.

3. CONCESSÃO DE FÉRIAS
3.1 Solicitação com 30 dias de antecedência.
3.2 Aprovação pelo gestor imediato.
3.3 Registro no sistema de RH.
3.4 Envio de aviso de férias ao colaborador.

4. EMISSÃO DE DOCUMENTOS OFICIAIS
4.1 Requisição formal ao setor competente.
4.2 Prazo de emissão: até 5 dias úteis.
4.3 Documentos com validade de 90 dias.
4.4 Renovação mediante nova solicitação.

5. PRESTAÇÃO DE CONTAS
5.1 Relatório mensal até o 5º dia útil.
5.2 Documentação comprobatória anexa.
5.3 Aprovação pela gerência.
5.4 Arquivo por 5 anos mínimo.

6. CONTRATOS E CONVÊNIOS
6.1 Solicitação à área jurídica.
6.2 Análise e minutação.
6.3 Aprovação pela diretoria.
6.4 Assinatura e registro.

7. VIAGENS A SERVIÇO
7.1 Autorização prévia obrigatória.
7.2 Solicitação de diárias e passagens.
7.3 Relatório de viagem em 5 dias úteis.
7.4 Prestação de contas das despesas.',
    '<h1>Guia de Procedimentos Administrativos</h1>
<p><strong>Passo a passo dos principais fluxos administrativos</strong></p>

<h2>1. Introdução</h2>
<p>Este guia descreve os principais procedimentos administrativos, orientando colaboradores na execução das atividades cotidianas com eficiência e conformidade.</p>

<h2>2. Solicitação de Materiais</h2>
<ol>
<li>Preencher formulário eletrônico no sistema</li>
<li>Informar justificativa e quantidade</li>
<li>Aguardar aprovação do gestor</li>
<li>Retirar material no almoxarifado mediante protocolo</li>
</ol>

<h2>3. Concessão de Férias</h2>
<ol>
<li>Solicitação com 30 dias de antecedência</li>
<li>Aprovação pelo gestor imediato</li>
<li>Registro no sistema de RH</li>
<li>Envio de aviso de férias ao colaborador</li>
</ol>

<h2>4. Emissão de Documentos Oficiais</h2>
<ul>
<li>Requisição formal ao setor competente</li>
<li>Prazo de emissão: até 5 dias úteis</li>
<li>Documentos com validade de 90 dias</li>
</ul>

<h2>5. Prestação de Contas</h2>
<table>
<thead><tr><th>Etapa</th><th>Prazo</th></tr></thead>
<tbody>
<tr><td>Relatório mensal</td><td>Até o 5º dia útil</td></tr>
<tr><td>Arquivo dos documentos</td><td>Mínimo 5 anos</td></tr>
</tbody>
</table>

<h2>6. Viagens a Serviço</h2>
<ol>
<li>Autorização prévia obrigatória</li>
<li>Solicitação de diárias e passagens</li>
<li>Relatório de viagem em 5 dias úteis</li>
<li>Prestação de contas das despesas</li>
</ol>',
    NULL,
    ARRAY['procedimentos', 'administrativo', 'guia', 'fluxos', 'aprovação'],
    (SELECT id FROM public.categories WHERE slug = 'procedimentos'),
    'Organização Demonstrativa',
    'published',
    'public',
    'reviewed',
    NOW() - INTERVAL '10 days',
    md5('guia-procedimentos-v1')
WHERE NOT EXISTS (SELECT 1 FROM public.knowledge_items WHERE slug = 'guia-de-procedimentos');
