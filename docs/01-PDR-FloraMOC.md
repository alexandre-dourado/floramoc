# Flora MOC — PDR do MVP

**Produto:** Flora MOC (nome de trabalho)  
**Subtítulo:** Mapa colaborativo de plantas e árvores de Montes Claros  
**Documento:** Product Requirements Document (PDR)  
**Versão:** 1.0  
**Data:** 15 de novembro de 2026  
**Status:** Especificação inicial para implementação  
**Idioma do produto:** Português do Brasil (`pt-BR`)  
**Plataformas:** Web responsiva, com prioridade para celular  

---

## 1. Resumo executivo

Flora MOC é um mapa colaborativo no qual moradores, estudantes, pesquisadores e visitantes podem registrar a localização de árvores, flores e outras plantas observadas em Montes Claros, Minas Gerais, identificar o que encontraram e consultar registros feitos pela comunidade.

A experiência principal deve ser muito simples:

1. A pessoa abre o mapa da cidade.
2. Explora os pontos já registrados e pode filtrar por tipo de planta ou pesquisar pelo nome.
3. Ao encontrar uma planta ainda não cadastrada, toca em **Adicionar planta**.
4. Marca o ponto no mapa ou usa a localização do próprio dispositivo.
5. Informa o nome conhecido, a categoria e, se souber, o nome científico. Pode anexar uma foto.
6. Envia o registro, que entra em uma fila de moderação.
7. Depois de aprovado, o ponto passa a aparecer publicamente no mapa.

O MVP não pretende produzir um inventário botânico científico nem identificar automaticamente espécies por imagem. Seu objetivo é criar uma primeira camada de conhecimento geográfico comunitário, com dados úteis, rastreáveis e passíveis de correção.

### Decisão central

**Construir primeiro um mapa público confiável, não uma rede social de plantas.** A contribuição, a localização, a identificação e a revisão dos dados são o núcleo do produto. Comentários, curtidas, gamificação, IA e recursos sociais ficam fora do MVP.

---

## 2. Visão, problema e oportunidade

### 2.1 Problema

O conhecimento sobre a presença e a localização de plantas urbanas está disperso. Moradores sabem onde há determinada árvore, jardim, canteiro ou espécie, mas esse conhecimento raramente é registrado de forma geográfica, consultável e coletiva.

A informação existente costuma estar em fotografias, conversas, grupos de mensagens, memória individual ou bases que não foram concebidas para colaboração local.

### 2.2 Oportunidade

Criar um inventário vivo e incremental da flora observável em Montes Claros, alimentado por quem circula pela cidade. Cada contribuição isolada passa a integrar uma visão territorial compartilhada.

O valor do produto aumenta conforme crescem:

- a quantidade de pontos registrados;
- a qualidade das identificações;
- a distribuição dos registros pelos bairros e espaços públicos;
- a atualização e a confiança das informações;
- a participação de moradores, escolas, universidades, coletivos e profissionais ligados ao meio ambiente.

### 2.3 Visão de longo prazo

O MVP deve estabelecer uma base que possa evoluir para um atlas colaborativo da arborização e da flora urbana, com séries temporais, observações sazonais, identificação assistida, dados abertos e parcerias institucionais. Nada disso deve ser pré-requisito para lançar a primeira versão.

---

## 3. Objetivos e critérios de sucesso

### 3.1 Objetivos do MVP

1. Exibir um mapa navegável de Montes Claros.
2. Permitir consultar registros aprovados sem criar conta.
3. Permitir que usuários autenticados submetam novos pontos com identificação e coordenadas.
4. Permitir anexar uma foto opcional ao registro.
5. Distinguir identificação confirmada pelo colaborador, provável ou desconhecida.
6. Evitar que contribuições não revisadas sejam exibidas como dados públicos confirmados.
7. Disponibilizar uma área administrativa mínima para aprovar, rejeitar, corrigir e arquivar registros.
8. Ser utilizável em celular, com conexão móvel comum.
9. Ter custo inicial baixo e uma arquitetura que não dependa de um servidor próprio.

### 3.2 Métricas iniciais

O painel administrativo deverá mostrar, no mínimo:

- total de registros aprovados;
- registros pendentes;
- registros rejeitados/arquivados;
- total de colaboradores que já contribuíram;
- registros por categoria;
- registros criados nos últimos 30 dias.

Para avaliar o piloto, acompanhar manualmente:

| Indicador | Meta inicial sugerida | Observação |
|---|---:|---|
| Registros aprovados | 100 | Primeira massa crítica para testar a experiência |
| Colaboradores únicos | 20 | Pessoas que concluíram pelo menos um envio aprovado |
| Registros com foto | 60% | Foto é recomendada, não obrigatória |
| Registros com nome científico | Sem meta rígida | Não incentivar nomes científicos inventados |
| Distribuição espacial | 5 ou mais áreas/bairros | Evitar concentração exclusiva no Centro |
| Tempo de moderação | Até 72 horas | Meta operacional do piloto, não SLA técnico |

As metas são hipóteses de lançamento, não previsões de uso.

### 3.3 Não objetivos do MVP

Não implementar nesta primeira versão:

- identificação automática de espécies por IA ou visão computacional;
- reconhecimento por câmera em tempo real;
- comentários públicos, chat, seguidores, curtidas ou feed social;
- gamificação, ranking ou competição entre usuários;
- edição colaborativa simultânea;
- desenho de polígonos ou mapeamento de áreas extensas;
- inventário oficial de árvores, laudos ou certificação botânica;
- rotas turísticas ou navegação até os pontos;
- aplicativo nativo Android/iOS;
- funcionamento offline do mapa;
- integração com bases oficiais ou importação automática de dados externos;
- geocodificação reversa ou pesquisa de endereço por serviço externo;
- cobrança, anúncios ou planos pagos.

---

## 4. Público e necessidades

### 4.1 Explorador

Pessoa que quer descobrir quais plantas existem em determinada região, consultar uma árvore ou flor encontrada no caminho ou simplesmente navegar pelo mapa.

**Necessidade:** abrir e usar o mapa imediatamente, sem cadastro obrigatório.

### 4.2 Colaborador ocasional

Morador ou visitante que conhece uma árvore, planta ornamental, flor ou agrupamento e quer registrar sua localização.

**Necessidade:** inserir um ponto em poucos passos, preferencialmente pelo celular, sem precisar conhecer nomenclatura botânica formal.

### 4.3 Colaborador com conhecimento botânico

Pessoa que consegue informar nome comum, gênero, espécie ou observações adicionais.

**Necessidade:** registrar detalhes sem que o aplicativo apresente seu palpite como identificação científica validada.

### 4.4 Moderador/administrador

Pessoa responsável por cuidar da qualidade e da segurança do mapa.

**Necessidade:** revisar envios, conferir fotos e coordenadas, corrigir informações, tratar denúncias e manter o mapa útil.

---

## 5. Princípios de produto

1. **Mapa primeiro:** o mapa é a interface principal, não um elemento decorativo em uma página institucional.
2. **Consulta sem barreira:** não exigir conta para explorar os pontos aprovados.
3. **Contribuição simples:** pedir apenas os dados necessários para produzir um registro útil.
4. **Incerteza explícita:** permitir “não identificada” e distinguir certeza de hipótese.
5. **Moderação antes da publicação:** registros novos não aparecem publicamente até serem aprovados.
6. **Privacidade por padrão:** não expor e-mail, nome completo ou dados desnecessários de quem contribuiu.
7. **Responsabilidade ambiental:** o app documenta observações; não incentiva coleta, poda, consumo ou manipulação das plantas.
8. **Dados corrigíveis:** um registro pode ser denunciado, revisado e atualizado.
9. **Tecnologia simples:** evitar serviços pagos e camadas de infraestrutura que não tragam valor ao piloto.
10. **Acessibilidade:** não depender exclusivamente de cores, gestos ou textos pequenos.

---

## 6. Definição do registro botânico

A unidade básica do MVP será um **registro de ocorrência** representado por um ponto no mapa.

Um ponto pode representar:

- **Indivíduo:** uma árvore ou planta específica;
- **Grupo:** conjunto de plantas semelhantes, canteiro, maciço ou concentração que faça sentido registrar como um único ponto.

O MVP não desenha o contorno de jardins, parques ou áreas verdes. Para grupos, o ponto indica uma localização aproximada representativa.

### 6.1 Categorias

Usar uma lista controlada e traduzida para português:

| Código | Rótulo |
|---|---|
| `tree` | Árvore |
| `shrub` | Arbusto |
| `flower` | Flor / planta com flor |
| `palm` | Palmeira |
| `grass` | Capim / gramínea |
| `succulent` | Suculenta / cacto |
| `herb` | Erva / herbácea |
| `other` | Outra planta |

A categoria descreve o tipo geral, não substitui a identificação da espécie.

### 6.2 Grau de identificação

| Código | Rótulo na interface | Significado |
|---|---|---|
| `identified` | Identificada pelo colaborador | A pessoa considera que sabe a identificação |
| `probable` | Identificação provável | A pessoa tem uma hipótese, mas não certeza |
| `unknown` | Ainda não identificada | Não foi possível identificar a planta |

Esses estados não significam validação científica. Mesmo `identified` deve ser apresentado como informação comunitária, salvo revisão explícita feita por profissional qualificado em uma futura fase.

### 6.3 Campos de um registro

| Campo | Obrigatório | Regra |
|---|---|---|
| Nome popular | Sim, exceto quando “não identificada” for selecionado | Máximo 100 caracteres |
| Nome científico | Não | Máximo 150 caracteres; texto livre no MVP |
| Categoria | Sim | Uma das categorias controladas |
| Grau de identificação | Sim | `identified`, `probable` ou `unknown` |
| Tipo de ocorrência | Sim | Indivíduo ou grupo |
| Quantidade aproximada | Não | Uma, poucas, muitas ou não informada |
| Latitude | Sim | Coordenada válida |
| Longitude | Sim | Coordenada válida |
| Precisão do ponto | Sim | Exata ou aproximada |
| Foto | Não | Uma foto no MVP, recomendada |
| Observação | Não | Até 500 caracteres |
| Declaração de local público/visível | Sim | Consentimento explícito no formulário |
| Status de moderação | Sistema | Pendente, aprovado, rejeitado ou arquivado |
| Criado em / atualizado em | Sistema | Datas automáticas |

**Importante:** o formulário deve aceitar uma planta não identificada. Nesse caso, salvar o nome popular como “Planta não identificada” e o grau como `unknown`. Nunca obrigar a pessoa a inventar uma espécie.

---

## 7. Fluxos principais

### 7.1 Explorar o mapa

1. Usuário acessa a URL pública.
2. O mapa abre centrado na sede de Montes Claros.
3. São carregados somente registros aprovados.
4. O usuário move e aproxima o mapa.
5. Marcadores agrupados (clusters) se separam conforme o zoom aumenta.
6. Ao tocar em um marcador, vê um resumo.
7. Ao selecionar “Ver registro”, abre o detalhe completo.
8. Pode filtrar por categoria e pesquisar pelo nome popular ou científico.

**Regra:** nenhuma informação de registro pendente, rejeitado ou arquivado deve ser disponibilizada na consulta pública.

### 7.2 Criar conta / entrar

1. Usuário seleciona “Contribuir” ou “Entrar”.
2. Pode criar conta com e-mail e senha ou entrar em conta existente.
3. A interface informa claramente quando é necessário confirmar o e-mail.
4. Após autenticação, o usuário retorna ao formulário de contribuição.
5. A aplicação não expõe o e-mail do colaborador no mapa público.

O MVP usa Supabase Auth com e-mail e senha. Para lançamento público com confirmação de e-mail, configurar SMTP próprio no Supabase. O fluxo de desenvolvimento pode operar com as configurações de teste do projeto, mas isso não deve ser confundido com configuração de produção.

### 7.3 Enviar uma planta

1. Usuário seleciona **Adicionar planta**.
2. Se não estiver autenticado, recebe opção de entrar ou criar conta; depois da autenticação, retorna ao fluxo.
3. O app exibe um passo curto de localização.
4. O usuário escolhe uma destas opções:
   - tocar no mapa para posicionar o marcador;
   - usar a localização atual do dispositivo, mediante permissão;
   - ajustar/arrastar o marcador para corrigir a posição.
5. Usuário escolhe categoria e tipo de ocorrência.
6. Informa nome popular ou marca “Não sei identificar”.
7. Opcionalmente informa nome científico, observação e foto.
8. Confirma que o ponto está em área pública ou que pode ser observado de espaço público, sem registrar endereço residencial ou local restrito.
9. Envia.
10. O sistema grava o registro como `pending`.
11. A interface confirma o envio e informa que o ponto será exibido após revisão.
12. O registro aparece em “Minhas contribuições”, com status pendente.

### 7.4 Consultar minhas contribuições

Usuário autenticado pode:

- ver seus registros e seus status;
- abrir o detalhe de um registro próprio;
- editar ou excluir um registro enquanto estiver pendente;
- solicitar correção de um registro já aprovado por meio do mecanismo de denúncia/correção.

Quando o usuário editar um registro aprovado, ele deverá voltar para `pending` e deixar de aparecer no mapa público até nova revisão. A interface deve avisar isso antes de salvar.

### 7.5 Denunciar ou sugerir correção

Em cada registro público, oferecer uma ação discreta **Sugerir correção**. O formulário pergunta o motivo:

- identificação possivelmente incorreta;
- ponto em local errado;
- foto ou descrição inadequada;
- localização privada/restrita;
- outro.

O usuário pode adicionar uma explicação curta. A denúncia fica visível apenas para administradores. Uma pessoa não pode enviar múltiplas denúncias repetidas do mesmo registro com a mesma conta enquanto a anterior estiver aberta.

### 7.6 Moderação administrativa

Rota `/admin`, acessível somente a usuários cadastrados na tabela de administradores.

O painel deverá oferecer:

- contadores de pendentes, aprovados e denúncias abertas;
- lista de pendentes ordenada do mais antigo para o mais recente;
- visualização de foto, dados e localização no mapa;
- edição do nome popular, nome científico, categoria, grau de identificação, observação e coordenadas;
- aprovar;
- rejeitar com motivo interno;
- arquivar registro aprovado;
- abrir e resolver denúncias;
- filtrar a fila por categoria e data.

A ação de aprovar deve ser explícita. Não aprovar automaticamente por falta de moderação.

---

## 8. Estrutura de telas e navegação

### 8.1 Rotas

| Rota | Acesso | Conteúdo |
|---|---|---|
| `/` | Público | Mapa principal, busca, filtros e pontos aprovados |
| `/plantas/:id` | Público | Detalhe de um registro aprovado |
| `/entrar` | Público | Login e criação de conta |
| `/contribuir` | Autenticado | Formulário de registro com mapa |
| `/minhas-contribuicoes` | Autenticado | Lista e status dos registros do usuário |
| `/admin` | Administrador | Painel de moderação |
| `/privacidade` | Público | Aviso de privacidade resumido |
| `*` | Público | Página de não encontrado |

O detalhe do registro também pode ser exibido em um drawer/modal sobre o mapa, desde que tenha URL compartilhável `/plantas/:id`.

### 8.2 Desktop

- Cabeçalho compacto com marca Flora MOC, busca, filtros e ações de conta.
- Mapa ocupando aproximadamente 65% a 75% da área útil.
- Painel lateral com resumo, lista dos resultados da área e chamada para contribuir.
- Marcadores claros e clusters numerados.
- Ação **Adicionar planta** sempre visível.

### 8.3 Mobile

- Mapa como tela principal em quase toda a altura disponível.
- Cabeçalho compacto, sem ocupar grande área vertical.
- Busca acessível na parte superior.
- Filtros em chips ou painel inferior.
- Botão flutuante **Adicionar planta**.
- Detalhe em bottom sheet/drawer.
- Formulário com etapas curtas e botões confortáveis para toque.
- Não depender de hover.

### 8.4 Estados de interface obrigatórios

Toda tela que consulta dados precisa tratar:

- carregando;
- sem resultados;
- erro de conexão;
- erro de autenticação;
- foto indisponível;
- localização negada pelo navegador;
- mapa sem tiles / estilo indisponível;
- envio bem-sucedido;
- envio pendente de moderação;
- formulário inválido.

---

## 9. Requisitos funcionais

Prioridade: **P0** = obrigatório para o MVP; **P1** = importante, mas pode entrar logo após o primeiro piloto; **P2** = futuro.

| ID | Prioridade | Requisito | Critério de aceite |
|---|---|---|---|
| FR-01 | P0 | Exibir mapa de Montes Claros | Mapa carrega centrado na cidade e permite pan/zoom |
| FR-02 | P0 | Consultar pontos aprovados | Visitante visualiza todos os pontos permitidos pela área consultada |
| FR-03 | P0 | Clustering de marcadores | Marcadores próximos agrupam em zoom baixo e se separam em zoom alto |
| FR-04 | P0 | Ver detalhe do registro | Clique abre nome, categoria, identificação, foto, observação e precisão |
| FR-05 | P0 | Pesquisar por nome | Pesquisa encontra correspondências em nome popular e científico |
| FR-06 | P0 | Filtrar categoria | Filtro pode ser combinado com busca e removido facilmente |
| FR-07 | P0 | Criar conta e entrar | E-mail/senha via Supabase Auth, com mensagens de erro claras |
| FR-08 | P0 | Exigir autenticação para contribuir | Visitante é encaminhado ao login e retorna ao fluxo depois de autenticar |
| FR-09 | P0 | Marcar localização manualmente | Toque no mapa posiciona/ajusta o ponto |
| FR-10 | P0 | Usar geolocalização do dispositivo | Permissão é solicitada apenas após ação do usuário; falhas são explicadas |
| FR-11 | P0 | Cadastrar identificação | Nome popular, categoria e grau de identificação são persistidos |
| FR-12 | P0 | Permitir registro não identificado | É possível enviar com `unknown` e nome “Planta não identificada” |
| FR-13 | P0 | Anexar uma imagem | Upload opcional com validação de tipo e tamanho |
| FR-14 | P0 | Manter envio pendente | Todo novo registro nasce como `pending` e não aparece publicamente |
| FR-15 | P0 | Minhas contribuições | Usuário vê seus próprios registros e status |
| FR-16 | P0 | Painel administrativo protegido | Apenas administrador consegue acessar e executar ações administrativas |
| FR-17 | P0 | Aprovar/rejeitar/editar | Admin altera status e dados; alterações ficam registradas por data e responsável |
| FR-18 | P0 | Denunciar/sugerir correção | Usuário autenticado envia motivo e detalhe curto |
| FR-19 | P0 | Aplicar RLS | Leitura, inserção, edição e exclusão seguem políticas no banco, não apenas na interface |
| FR-20 | P0 | Aviso de privacidade e responsabilidade | Formulário e página explicam limites, finalidade e cautelas |
| FR-21 | P0 | Responsividade | Fluxos principais funcionam em largura de 360 px até desktop |
| FR-22 | P0 | Estados de carregamento e erro | Nenhuma tela fica travada em branco ou sem feedback |
| FR-23 | P1 | Compartilhar detalhe | URL do registro aprovado pode ser copiada/compartilhada |
| FR-24 | P1 | Métricas administrativas | Painel mostra contagens básicas e distribuição por categoria |
| FR-25 | P1 | Editar registro aprovado | Edição retorna o registro para moderação antes de reaparecer publicamente |
| FR-26 | P2 | Identificação assistida por IA | Fora do MVP |

---

## 10. Regras de negócio

1. Somente registros com `status = 'approved'` podem ser consultados publicamente.
2. Todo registro novo nasce com `status = 'pending'`, definido e protegido no banco.
3. O autor pode consultar seus próprios registros, inclusive pendentes e rejeitados.
4. O autor só pode editar/excluir diretamente seus próprios registros pendentes.
5. Edição de registro aprovado deve voltar a `pending` para nova revisão.
6. Somente administradores podem aprovar, rejeitar, arquivar, resolver denúncias e alterar `reviewed_by`.
7. E-mail, UUID do autor, dados de autenticação e motivos internos de rejeição não devem ser exibidos na consulta pública.
8. Foto é opcional, mas o app deve incentivar uma imagem nítida e segura.
9. Localização aproximada é permitida e deve ser identificada como aproximada.
10. Não aceitar registros que incentivem acesso a propriedade privada, coleta de espécies, retirada de mudas ou manipulação perigosa.
11. Não afirmar que uma planta é comestível, medicinal, segura ou tóxica com base apenas no registro comunitário.
12. Não usar “espécie confirmada” como selo científico. Usar “identificação informada pela comunidade”.
13. Cada usuário pode criar no máximo 5 registros por hora no MVP. O limite deve ser imposto no banco, não apenas na interface.
14. Cada usuário pode abrir no máximo 10 denúncias por dia. Impor limite no banco ou por rotina equivalente segura.
15. Uma denúncia aberta por usuário/registro é suficiente; denúncias repetidas devem ser bloqueadas por restrição única ou verificação transacional.
16. Não publicar o nome completo do colaborador. Se houver nome de exibição, ele deve ser opcional e não aparecer na primeira versão pública.

---

## 11. Arquitetura técnica recomendada

### 11.1 Stack

| Camada | Tecnologia | Função |
|---|---|---|
| Frontend | React + TypeScript + Vite | SPA responsiva |
| Estilos | Tailwind CSS + CSS variables | Sistema visual consistente e rápido de manter |
| Componentes/ícones | Componentes próprios + Lucide React | UI e ícones |
| Mapa | MapLibre GL JS | Renderização e interação com mapa vetorial |
| Tiles/estilo | OpenFreeMap, estilo Liberty | Mapa base sem chave de API no MVP |
| Backend | Supabase | Postgres, Auth e Storage |
| Segurança | PostgreSQL Row Level Security (RLS) | Autorização aplicada no banco |
| Hospedagem | Vercel | Build e hospedagem do frontend |
| Código | GitHub | Repositório e histórico |

### 11.2 Por que não usar Google Apps Script como backend principal

O Google Apps Script é excelente para automações, planilhas e fluxos internos, mas não é a melhor base para este MVP. O produto precisa de autenticação de usuários, armazenamento de fotos, políticas de acesso por registro, consultas geográficas por área do mapa e uma fila de moderação. Supabase/Postgres resolve essas necessidades de forma mais direta.

GAS pode ser usado posteriormente para relatórios, notificações ou exportações administrativas, mas não deve ser um componente obrigatório da primeira versão.

### 11.3 Por que MapLibre + OpenFreeMap

MapLibre é uma biblioteca aberta para mapas interativos no navegador. OpenFreeMap fornece estilos e tiles derivados de OpenStreetMap sem exigir chave de API para o uso da instância pública. A documentação indica o estilo Liberty em `https://tiles.openfreemap.org/styles/liberty` e a atribuição automática quando MapLibre é usado.

A instância pública não oferece SLA garantido. Portanto:

- configurar a URL do estilo por variável de ambiente;
- manter a atribuição visível;
- não fazer download em massa de tiles;
- permitir trocar o provedor sem reescrever a aplicação;
- considerar provedor contratado ou tiles próprios se o uso crescer ou se a disponibilidade se tornar requisito crítico.

### 11.4 Centro inicial do mapa

Usar o centro aproximado da sede de Montes Claros:

- Latitude: `-16.7280556`
- Longitude: `-43.8650000`
- Zoom inicial sugerido: `12`

As coordenadas derivam da informação publicada pela página de geografia do Município de Montes Claros: 16°43'41" S, 43°51'54" O. O centro e o zoom devem ficar em uma constante/configuração fácil de alterar. Não implementar, neste MVP, uma cerca geográfica rígida baseada em um retângulo improvisado.

### 11.5 Consultas de mapa

- Consultar apenas registros aprovados.
- Usar os limites visíveis do mapa (`bounds`) para carregar pontos da área atual.
- Debounce em eventos de movimento do mapa para evitar chamadas excessivas.
- Limitar a quantidade de registros por consulta; definir limite inicial de 1.000 pontos e prever aviso/estratégia de paginação se exceder.
- Aplicar filtros de categoria e pesquisa sem perder o estado do mapa.
- Converter os resultados para GeoJSON e usar clustering nativo do MapLibre.
- Não enviar a localização atual do usuário para serviços externos, além do que é necessário para posicionar o mapa localmente.

---

## 12. Modelo de dados proposto

O esquema final deve ser entregue em migrations SQL versionadas no repositório. Os nomes abaixo são a referência do produto.

### 12.1 `public.plants`

| Coluna | Tipo | Regra |
|---|---|---|
| `id` | `uuid` | PK, `gen_random_uuid()` |
| `created_by` | `uuid` | FK `auth.users(id)`, obrigatório |
| `common_name` | `text` | obrigatório, até 100 caracteres |
| `scientific_name` | `text` | opcional, até 150 caracteres |
| `category` | `text`/enum | categoria controlada |
| `identification_level` | `text`/enum | `identified`, `probable`, `unknown` |
| `occurrence_type` | `text`/enum | `individual`, `group` |
| `quantity_estimate` | `text`/enum | `one`, `few`, `many`, `unknown` |
| `latitude` | `double precision` | entre -90 e 90 |
| `longitude` | `double precision` | entre -180 e 180 |
| `location_precision` | `text`/enum | `exact`, `approximate` |
| `photo_path` | `text` | caminho do objeto no Storage, opcional |
| `description` | `text` | até 500 caracteres |
| `status` | `text`/enum | `pending`, `approved`, `rejected`, `archived`; default pending |
| `moderation_note` | `text` | interno, não público |
| `reviewed_by` | `uuid` | FK `auth.users(id)`, opcional |
| `reviewed_at` | `timestamptz` | opcional |
| `created_at` | `timestamptz` | default `now()` |
| `updated_at` | `timestamptz` | trigger |

Índices:

- `status`;
- `created_by`;
- `created_at`;
- `(latitude, longitude)` para as consultas simples por bounding box;
- `lower(common_name)` e `lower(scientific_name)` ou índice apropriado para a busca textual.

Para uma base pequena, latitude/longitude com filtros por bounding box é suficiente. Não introduzir PostGIS no MVP sem necessidade comprovada. A arquitetura poderá migrar para `geography(Point, 4326)` quando consultas espaciais mais avançadas justificarem.

### 12.2 `public.admin_users`

| Coluna | Tipo | Regra |
|---|---|---|
| `user_id` | `uuid` | PK e FK para `auth.users(id)` |
| `created_at` | `timestamptz` | default `now()` |

A tabela não deve ser editável pelo frontend normal. Um administrador inicial será incluído manualmente pelo painel SQL do Supabase, depois de criar sua conta.

Criar função SQL `public.is_admin()` com `SECURITY DEFINER`, `search_path` fixo e permissões cuidadosamente limitadas, para verificar `auth.uid()` em `admin_users`. Não confiar em variável local, e-mail enviado pelo cliente, `user_metadata` ou estado visual do frontend para conceder privilégios administrativos.

### 12.3 `public.plant_reports`

| Coluna | Tipo | Regra |
|---|---|---|
| `id` | `uuid` | PK |
| `plant_id` | `uuid` | FK `plants(id)` |
| `reported_by` | `uuid` | FK `auth.users(id)` |
| `reason` | `text`/enum | categoria de denúncia |
| `details` | `text` | opcional, até 500 caracteres |
| `status` | `text`/enum | `open`, `resolved`, `dismissed` |
| `admin_note` | `text` | interno |
| `resolved_by` | `uuid` | FK `auth.users(id)`, opcional |
| `created_at` | `timestamptz` | default `now()` |
| `resolved_at` | `timestamptz` | opcional |

Impor unicidade para impedir mais de uma denúncia aberta por usuário para o mesmo registro. A implementação pode usar índice único parcial ou lógica transacional equivalente.

### 12.4 `public.profiles` (opcional, se necessário)

Não criar tabela de perfil se a aplicação não precisar de nome de exibição ou outras informações. O MVP deve minimizar dados pessoais. O identificador de autenticação já é suficiente para relacionar os registros ao autor.

---

## 13. Segurança, RLS e Storage

### 13.1 Princípio

A segurança precisa ser garantida no banco. Ocultar botões no React não é autorização.

Ativar RLS em todas as tabelas públicas.

### 13.2 Regras de acesso esperadas

**`plants`:**

- visitante (`anon`): `SELECT` somente registros `approved`;
- usuário autenticado: `SELECT` de registros aprovados e de seus próprios registros em qualquer status;
- usuário autenticado: `INSERT` apenas com `created_by = auth.uid()` e `status = 'pending'`;
- usuário autenticado: `UPDATE` apenas em registros próprios ainda pendentes, mantendo `status = 'pending'`;
- usuário autenticado: `DELETE` apenas em registros próprios pendentes;
- administrador: acesso de leitura e atualização para moderação, usando `is_admin()`;
- usuário comum nunca pode alterar `status`, `reviewed_by` ou `moderation_note` para obter aprovação.

**`admin_users`:**

- sem leitura/escrita direta para usuários comuns;
- administração inicial feita pelo SQL Editor;
- verificação via função segura `is_admin()`.

**`plant_reports`:**

- usuário autenticado pode inserir denúncia vinculada a seu próprio `auth.uid()`;
- denunciante pode consultar apenas as próprias denúncias, se a tela precisar desse dado;
- apenas administradores podem ver todas as denúncias e alterar status/resolução;
- dados de denúncia nunca são públicos.

### 13.3 Storage

Criar bucket `plant-photos`:

- leitura pública apenas das imagens associadas a registros aprovados, ou bucket público com nomes não previsíveis e política de upload restrita; a estratégia escolhida deve estar documentada;
- upload apenas por usuário autenticado;
- caminho padronizado: `{auth.uid()}/{uuid}.{ext}`;
- aceitar somente JPEG, PNG e WebP;
- tamanho máximo: 5 MB por arquivo;
- restringir upload ao prefixo do próprio usuário;
- permitir que o autor remova arquivos próprios enquanto o registro estiver pendente, sem apagar foto de registro aprovado de terceiros;
- nunca expor chave `service_role` ou `sb_secret` no frontend.

Preferir reprocessar a imagem no navegador (canvas) para remover metadados EXIF e reduzir tamanho antes do upload. Se essa operação falhar, avisar e permitir continuar apenas se a política do app permitir; não travar o cadastro sem explicar.

### 13.4 Antiabuso básico

- Limite de 5 novos registros por hora por usuário.
- Limite de 10 denúncias por dia por usuário.
- Validar limites no banco com trigger ou RPC transacional, não apenas no cliente.
- Validar tamanho, MIME type e extensão de arquivo.
- Validar coordenadas no banco.
- Escapar/renderizar texto de usuário com segurança; nunca injetar HTML de descrição.
- Exigir confirmação do usuário antes de exclusão.
- Mensagens de erro públicas não devem expor SQL, chaves, stack traces ou detalhes internos.

---

## 14. Privacidade, LGPD e responsabilidade ambiental

Este projeto é um catálogo colaborativo de observações. Não deve parecer um serviço de monitoramento de pessoas ou de localização em tempo real.

### 14.1 Dados pessoais mínimos

- Não exigir nome completo, telefone, endereço ou CPF.
- Usar e-mail apenas para autenticação e comunicação transacional do Supabase.
- Não exibir publicamente o e-mail ou o identificador do autor.
- Não coletar geolocalização em segundo plano.
- Pedir localização do dispositivo apenas quando a pessoa acionar “Usar minha localização”.
- Não guardar o histórico de deslocamento do usuário.
- Não incorporar rastreadores de publicidade no MVP.

### 14.2 Texto mínimo de privacidade

A página `/privacidade` deve explicar, em linguagem acessível:

- que o cadastro usa e-mail para autenticação;
- que coordenadas, identificação, observação e foto são armazenadas para formar o mapa colaborativo;
- que registros só se tornam públicos depois de moderação;
- que o e-mail e os dados de autenticação não são exibidos publicamente;
- que a pessoa pode solicitar exclusão da conta ou de contribuições, respeitadas obrigações legítimas de segurança/moderação;
- quais serviços de infraestrutura processam os dados (Supabase, Vercel e provedor de mapa);
- um canal de contato do responsável pelo projeto, configurável antes da publicação.

O texto deve ser revisado pelo responsável do projeto antes do lançamento público. Não alegar conformidade jurídica formal sem revisão apropriada.

### 14.3 Segurança ambiental e de localização

O formulário deve exigir uma confirmação como:

> Confirmo que o ponto está em espaço público ou que a planta pode ser observada de um local público. Não estou registrando endereço residencial, quintal privado, área restrita ou localização que exponha alguém a risco.

Adicionar avisos visíveis:

- Não entre em terreno privado para fotografar ou marcar uma planta.
- Não retire folhas, flores, frutos, sementes ou mudas para fazer o registro.
- Não consuma nem use uma planta como medicamento com base nas informações do mapa.
- A identificação é comunitária e pode estar incorreta.
- Espécies raras, ameaçadas ou sensíveis podem exigir ocultação ou generalização da coordenada; administradores devem poder rejeitar ou aproximar o ponto.

Não publicar coordenadas extremamente precisas de ocorrência sensível quando isso puder incentivar coleta ou dano. No MVP, o administrador pode editar manualmente a posição para aproximá-la antes da aprovação.

---

## 15. Direção visual e experiência

### 15.1 Conceito visual

**Atlas botânico urbano:** uma ferramenta cartográfica contemporânea, com linguagem editorial e naturalista. Não deve parecer aplicativo infantil, template genérico de sustentabilidade ou painel corporativo.

### 15.2 Paleta inicial sugerida

| Token | Cor | Uso |
|---|---|---|
| `forest` | `#183B32` | Marca, navegação, ações principais |
| `leaf` | `#6F8F62` | Marcadores e elementos naturais |
| `sage` | `#DCE6D5` | Superfícies secundárias |
| `paper` | `#F6F5EF` | Fundo de painéis |
| `ink` | `#202722` | Texto principal |
| `muted` | `#737D73` | Texto auxiliar |
| `sun` | `#D9B95B` | Destaques pontuais |
| `danger` | `#B44D43` | Erros e denúncias |

A paleta deve ser implementada como CSS variables para facilitar ajuste.

### 15.3 Tipografia e componentes

- Tipografia sem serifa, legível, com hierarquia editorial clara.
- Títulos podem usar uma serifada discreta como contraste, desde que carregue rápido e não prejudique leitura.
- Cartões claros, bordas sutis, sombras leves.
- Marcadores com ícones simples ou formas distintas por categoria.
- Não codificar categoria apenas por cor: incluir ícone ou rótulo acessível.
- Botões com estados hover, focus, active e disabled.
- Feedback de ação em toast e/ou mensagem inline.

### 15.4 Marca

Nome de trabalho: **Flora MOC**. Assinatura: **Um mapa vivo das plantas de Montes Claros.** O nome deve ficar centralizado em uma constante para futura troca, sem espalhar texto de marca por dezenas de componentes.

---

## 16. Acessibilidade e qualidade

- Alvo de toque recomendado de pelo menos 44 × 44 px.
- Contraste WCAG AA para texto normal sempre que possível.
- Formulários com `label` real, mensagens de erro associadas e navegação por teclado.
- Modais/drawers com foco gerenciado e possibilidade de fechar pelo teclado.
- Ícones decorativos com `aria-hidden`; botões só com ícone precisam de `aria-label`.
- Não transmitir categoria/status somente por cor.
- Respeitar `prefers-reduced-motion`.
- O mapa precisa ter alternativa em lista para pessoas que não conseguem usar gestos ou navegação espacial.
- Layout deve funcionar a partir de 360 px de largura.
- Imagens devem ter texto alternativo útil ou `alt` vazio quando decorativas.

### Performance

- Carregar o mapa e os dados de forma eficiente.
- Lazy-load de imagens dos detalhes.
- Redimensionar/comprimir fotos antes do upload.
- Evitar renderização React de todos os marcadores individualmente; usar GeoJSON source/layers com clustering no MapLibre.
- Debounce da busca e do carregamento por viewport.
- Não consultar novamente em cada pixel de movimento; consultar em `moveend`.
- Dividir rotas administrativas e componentes pesados quando útil.

---

## 17. Configuração e variáveis de ambiente

O projeto deve conter `.env.example`, sem valores reais:

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_PUBLISHABLE_KEY=
VITE_MAP_STYLE_URL=https://tiles.openfreemap.org/styles/liberty
VITE_DEFAULT_MAP_LAT=-16.7280556
VITE_DEFAULT_MAP_LNG=-43.8650000
VITE_DEFAULT_MAP_ZOOM=12
VITE_CONTACT_EMAIL=
```

As duas variáveis do Supabase são necessárias para conectar o frontend.

**Nunca** usar `VITE_SUPABASE_SECRET_KEY`, `VITE_SUPABASE_SERVICE_ROLE_KEY` ou qualquer segredo com prefixo `VITE_`. Variáveis `VITE_` são incorporadas ao bundle do navegador.

O frontend usa apenas a chave publishable do Supabase. RLS é obrigatório. Nenhuma chave secreta é necessária para esta arquitetura de cliente direto.

---

## 18. Requisitos de implantação

### 18.1 Ambientes

- Local: Vite dev server e projeto Supabase de desenvolvimento.
- Produção: Vercel + projeto Supabase de produção.

Não misturar banco de teste com produção sem intenção explícita.

### 18.2 Repositório

- Repositório GitHub com README.
- `main` como branch de produção.
- `.gitignore` incluindo `.env`, `.env.local`, `node_modules`, `dist` e arquivos locais sensíveis.
- migrations em `supabase/migrations/`.
- `.env.example` versionado, sem segredos.
- scripts de lint, typecheck, test e build.

### 18.3 Vercel

- Importar repositório do GitHub.
- Framework preset Vite (ou detectar automaticamente).
- Build command `npm run build`.
- Output directory `dist`.
- Configurar variáveis de ambiente de produção.
- Configurar rewrite/SPA fallback para rotas como `/plantas/:id`, `/contribuir` e `/admin`, se necessário.
- Confirmar que o domínio abre em HTTPS.

O plano Hobby da Vercel é voltado a projetos pessoais e tem limites de uso; verificar os termos e a elegibilidade atuais caso o projeto passe a ser operado comercialmente ou por uma instituição.

### 18.4 Supabase

- Criar projeto.
- Aplicar migrations.
- Verificar RLS e Storage.
- Configurar URL de produção em Auth > URL Configuration.
- Configurar SMTP se a confirmação de e-mail for usada em produção.
- Criar o primeiro usuário administrador e inserir seu `user_id` em `admin_users` pelo SQL Editor.
- Configurar política de retenção e procedimento de backup apropriado antes de crescer.

### 18.5 Limitações do plano gratuito

Na consulta de 15/11/2026, a página de preços do Supabase informa, entre outros limites do Free: 500 MB de banco, 1 GB de Storage, 5 GB de egress e pausa de projetos gratuitos após uma semana de inatividade. O plano gratuito é adequado para validar o MVP, mas a pausa por inatividade deve ser considerada no piloto. Verificar sempre os limites vigentes antes do lançamento.

---

## 19. Plano de entrega em etapas

### Etapa A — Construção por Claude Sonnet

Entregar a aplicação funcional em código, incluindo:

- frontend React/Vite/TypeScript;
- mapa MapLibre/OpenFreeMap;
- autenticação;
- formulários de registro;
- upload de fotos;
- consulta, busca e filtros;
- minhas contribuições;
- painel de moderação;
- migrations SQL;
- RLS e políticas de Storage;
- validações e limites antiabuso;
- testes básicos;
- `.env.example`;
- README completo;
- build local aprovado.

Claude não precisa publicar nem fazer push se o responsável reservou essas operações para o AGY CLI.

### Etapa B — Revisão e acabamento pelo responsável

- revisar identidade e textos;
- criar contas/serviços;
- preencher variáveis de ambiente;
- conferir o fluxo do administrador;
- validar em celular real;
- decidir contato público e política final.

### Etapa C — Finalização pelo AGY CLI

O AGY CLI deve atuar como release engineer:

- inspecionar o projeto produzido por Claude;
- corrigir apenas problemas concretos de build, configuração, integração e deploy;
- validar migrations e RLS;
- aplicar migrations no Supabase de produção, com autorização;
- configurar variáveis na Vercel sem expor segredos;
- executar testes/build;
- preparar commit e push para o GitHub;
- criar/atualizar projeto Vercel e fazer deploy;
- verificar a URL publicada e os fluxos essenciais;
- entregar relatório final com URLs, commit, deploy e pendências.

O AGY CLI não deve reescrever a aplicação nem trocar a stack sem uma justificativa técnica indispensável.

---

## 20. Testes e critérios de aceite finais

### 20.1 Testes funcionais

1. Visitante abre `/` e vê o mapa.
2. Visitante consegue buscar e filtrar pontos aprovados.
3. Visitante não consegue ler registros pendentes/rejeitados via API.
4. Visitante tenta contribuir e é encaminhado ao login.
5. Usuário cria conta e entra.
6. Usuário marca uma localização tocando no mapa.
7. Usuário consegue usar a localização do dispositivo, se autorizar.
8. Usuário envia um registro identificado.
9. Usuário envia um registro não identificado.
10. Usuário pode anexar foto válida.
11. Arquivo não permitido ou acima do limite é recusado com mensagem compreensível.
12. Novo registro fica pendente e não aparece no mapa público.
13. Usuário vê o próprio registro em “Minhas contribuições”.
14. Usuário não consegue alterar status para aprovado.
15. Usuário não consegue editar registro de outra pessoa.
16. Administrador entra e vê a fila.
17. Administrador aprova registro e ele passa a aparecer no mapa.
18. Administrador rejeita registro e ele não aparece publicamente.
19. Usuário envia denúncia e ela aparece somente no painel administrativo.
20. Usuário comum não acessa `/admin` nem operações administrativas via chamada direta.
21. Atualizar a página em rota interna não resulta em 404 na Vercel.
22. Layout funciona em 360 px, tablet e desktop.

### 20.2 Testes de segurança obrigatórios

- testar RLS anon e authenticated;
- tentar inserir registro com `created_by` de outra pessoa;
- tentar inserir registro já como `approved`;
- tentar promover o próprio usuário a administrador;
- tentar ler `moderation_note` publicamente;
- tentar ler denúncias de terceiros;
- tentar upload em diretório de outro usuário;
- confirmar que nenhuma chave secreta está no bundle, no Git ou em `.env.example`;
- validar que texto de usuário não executa HTML/script.

### 20.3 Critério de “pronto para publicar”

O MVP só pode ser considerado pronto quando:

- `npm run build` passa;
- `npm run lint` passa;
- `npm run typecheck` passa;
- testes definidos passam;
- migrations estão versionadas e aplicadas no ambiente correto;
- RLS foi testado;
- o usuário administrador consegue aprovar um registro;
- o registro aprovado aparece publicamente;
- o domínio publicado funciona em celular;
- a política de privacidade contém contato real e foi revisada;
- não existem segredos no repositório.

---

## 21. Riscos e respostas

| Risco | Impacto | Mitigação no MVP |
|---|---|---|
| Identificação errada | Dado enganoso | Grau de certeza, identificação não obrigatória e moderação |
| Spam ou vandalismo | Perda de confiança | Login, RLS, limites no banco, fila de aprovação e denúncias |
| Ponto em propriedade privada | Risco de privacidade/invasão | Declaração obrigatória, aviso claro e moderação |
| Exposição de espécie sensível | Dano ambiental | Aproximar/ocultar ponto e rejeitar quando necessário |
| Foto com metadados | Exposição de localização/fotógrafo | Reprocessar imagem no cliente e não publicar dados do autor |
| Baixa cobertura geográfica | Mapa concentrado | Divulgar em universidades, escolas, bairros e coletivos; medir cobertura |
| Serviço de mapas indisponível | Mapa não carrega | URL configurável e possibilidade de trocar provedor |
| Projeto Supabase pausado | Indisponibilidade temporária | Monitorar atividade e considerar plano pago quando necessário |
| Crescimento de dados/fotos | Custo/latência | Compressão, limites e paginação; rever plano ao atingir limites |
| Falta de moderador | Acúmulo de pendências | Começar com escopo pequeno e definir responsáveis antes de divulgar |

---

## 22. Evoluções possíveis após o MVP

Somente depois de validar uso real:

- PWA instalável;
- exportação CSV/GeoJSON de dados públicos;
- filtros por estação, floração e frutificação;
- observações sazonais separadas do registro de ocorrência;
- múltiplas fotos por registro;
- sugestão comunitária de identificação com histórico de propostas;
- integração com iNaturalist ou bases taxonômicas, respeitando licenças e atribuição;
- identificação assistida por IA com aviso de incerteza e validação humana;
- desenho de polígonos para áreas verdes;
- mapa de arborização pública com campos de condição/manejo, se houver parceria;
- painel de distribuição por bairros e indicadores públicos;
- API pública e parceria com instituições de ensino;
- notificações por e-mail quando o registro for aprovado ou precisar de ajuste.

Nenhuma evolução deve ser adicionada antes de observar onde o fluxo de cadastro e moderação realmente apresenta dificuldade.

---

## 23. Referências técnicas consultadas

Links de documentação consultados em 15/11/2026. As condições de planos e serviços podem mudar; confirmar antes da implantação.

- Prefeitura de Montes Claros, Geografia: https://portal.montesclaros.mg.gov.br/cidade/geografia
- Supabase Pricing: https://supabase.com/pricing
- Supabase React Auth Quickstart: https://supabase.com/docs/guides/auth/quickstarts/react
- Supabase API Keys: https://supabase.com/docs/guides/getting-started/api-keys
- Supabase Security / Data API: https://supabase.com/docs/guides/database/secure-data
- OpenFreeMap: https://openfreemap.org/
- OpenFreeMap Quick Start: https://openfreemap.org/quick_start/
- MapLibre GL JS: https://maplibre.org/maplibre-gl-js/docs/
- Vercel Hobby Plan: https://vercel.com/docs/plans/hobby

---

## 24. Decisões já tomadas para não bloquear a implementação

Este documento resolve antecipadamente as principais ambiguidades para que a equipe de implementação não precise interromper o trabalho por questões que podem ser decididas agora:

1. Nome de trabalho: Flora MOC.
2. Consulta pública sem login.
3. Login obrigatório para cadastrar e denunciar.
4. Cadastro por e-mail e senha via Supabase Auth.
5. Novos registros ficam pendentes até aprovação.
6. Uma ocorrência é um ponto, que pode representar indivíduo ou grupo.
7. Foto opcional, limitada a uma imagem no MVP.
8. Identificação pode ser desconhecida.
9. Mapa base MapLibre + OpenFreeMap Liberty.
10. Centro inicial aproximado da sede de Montes Claros: `[-43.865, -16.7280556]` em ordem `[longitude, latitude]`.
11. React + Vite + TypeScript, hospedado na Vercel.
12. Supabase para Auth, Postgres e Storage.
13. GitHub como repositório.
14. Claude Sonnet implementa o produto; AGY CLI valida e finaliza GitHub/Vercel.
15. Não implementar identificação automática por IA, rede social ou polígonos no MVP.

**Definição de sucesso:** uma pessoa consegue abrir o site, localizar uma árvore, registrar sua posição e identificação, enviar uma foto, ter o registro revisado por um administrador e depois encontrar esse ponto no mapa público. Todo o resto é secundário.
