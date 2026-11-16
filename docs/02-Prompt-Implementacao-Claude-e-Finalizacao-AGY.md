# PROMPT DE IMPLEMENTAÇÃO — FLORA MOC

**Uso:** entregar este arquivo e `01-PDR-FloraMOC.md` ao Claude Sonnet.  
**Objetivo:** fazer o Claude construir a aplicação completa no repositório e deixar o AGY CLI responsável pela validação final, GitHub e publicação.  
**Data de referência:** 15/11/2026.

---

# PARTE I — PROMPT PRINCIPAL PARA CLAUDE SONNET

Copie o bloco abaixo para o Claude Sonnet, anexando também o PDR completo.

---

## MISSÃO

Você é o engenheiro de software sênior, arquiteto de aplicações web e designer de produto responsável por implementar o **Flora MOC**, um mapa colaborativo de árvores e plantas de Montes Claros/MG.

Sua tarefa não é apenas sugerir arquitetura, gerar um protótipo visual ou explicar como alguém poderia construir o produto. **Você deve implementar a aplicação real no repositório aberto, criar os arquivos, escrever o código, configurar as integrações, produzir as migrations SQL, implementar as políticas de segurança e deixar o projeto funcionando localmente e pronto para o AGY CLI publicar.**

Leia integralmente `01-PDR-FloraMOC.md` antes de começar. O PDR é a fonte de verdade do produto. Este prompt define o modo de execução e resolve como você deve agir.

### Resultado esperado

Ao terminar, deve existir um projeto React/Vite/TypeScript funcional, com:

- mapa interativo de Montes Claros;
- marcadores agrupados e detalhes dos registros;
- busca e filtros;
- autenticação Supabase;
- cadastro de ocorrências com localização manual ou geolocalização;
- upload opcional de foto;
- identificação popular/científica e grau de certeza;
- status de moderação;
- área de contribuições do usuário;
- denúncia/sugestão de correção;
- painel administrativo protegido por RLS;
- migrations e políticas Supabase versionadas;
- testes, documentação e build passando.

**Não entregue uma demonstração com dados fake como se fosse o produto pronto.** Pode usar dados mockados apenas em testes e estados de desenvolvimento claramente identificados. A aplicação real deve estar conectada ao Supabase por variáveis de ambiente.

---

## 1. REGRAS DE EXECUÇÃO

1. Comece inspecionando o diretório atual, arquivos, package manager, branch e estado do Git. Não apague trabalho existente.
2. Se já houver uma aplicação, preserve o que for útil e integre a nova implementação. Não recrie o projeto por cima sem inspecionar.
3. Se o diretório estiver vazio, crie o projeto com Vite + React + TypeScript.
4. Leia o PDR inteiro antes de escrever componentes.
5. Não faça perguntas sobre decisões já resolvidas no PDR. Use as decisões da seção 24 do PDR.
6. Se encontrar uma ambiguidade pequena, tome a decisão mais simples que preserve a finalidade e documente-a no README.
7. Não reduza o escopo eliminando autenticação, moderação ou segurança para acelerar.
8. Não implemente backend próprio desnecessário. Use Supabase diretamente pelo cliente web com chave publishable e políticas RLS.
9. Não use Google Apps Script como backend principal.
10. Não use Google Maps, Mapbox ou serviço que exija chave paga para o mapa inicial.
11. Não coloque `service_role`, `sb_secret`, senha, token de deploy ou qualquer segredo em variável `VITE_*`, código frontend, arquivo versionado ou log.
12. Não deixe botões decorativos sem ação. Todos os controles visíveis devem funcionar ou estar claramente desabilitados com explicação.
13. Não declare a aplicação pronta se o build não passar ou se fluxos essenciais dependerem de dados falsos.
14. Use versões estáveis e compatíveis das dependências no momento da implementação. Não fixe versões antigas apenas por exemplo deste prompt.
15. Não faça `git push`, não crie produção na Vercel e não publique o domínio nesta etapa. Essa é a função do AGY CLI na Parte II.
16. Não invente credenciais. Quando uma integração exigir URL/chave real, crie `.env.example`, documente onde obtê-la e continue implementando o restante.
17. Se tiver acesso a um Supabase real, não aplique migrations em produção sem autorização explícita e confirmação do ambiente. O seu resultado padrão deve ser migrations revisadas e prontas para aplicação.
18. Evite dependências redundantes, abstrações exageradas e arquitetura prematura.
19. Escreva código legível, tipado, modular e com erros tratados.
20. Trabalhe até completar a implementação, sem parar após apresentar um plano.

---

## 2. STACK OBRIGATÓRIA

Use esta stack, salvo incompatibilidade técnica real que você deverá justificar no relatório:

- React;
- TypeScript em modo estrito;
- Vite;
- Tailwind CSS;
- Lucide React para ícones;
- React Router para rotas;
- `@supabase/supabase-js` para Auth, Database e Storage;
- MapLibre GL JS para o mapa;
- OpenFreeMap Liberty como estilo inicial;
- Zod para validação de dados/formulários;
- React Hook Form, se for útil para formulários;
- Vitest + Testing Library para testes essenciais.

URL do estilo inicial:

```text
https://tiles.openfreemap.org/styles/liberty
```

Centro inicial do mapa em ordem `[longitude, latitude]`:

```ts
[-43.865, -16.7280556]
```

Zoom inicial aproximado: `12`.

Atribuição de mapa precisa continuar visível. O MapLibre com OpenFreeMap deve manter os créditos do estilo/dados. Não remova nem esconda o controle de atribuição.

---

## 3. DIREÇÃO DE DESIGN

Crie um produto visualmente convincente, com acabamento de aplicação real. Não use um template SaaS genérico nem um dashboard corporativo.

### Conceito

**Atlas botânico urbano.** A interface combina cartografia, editorial naturalista e utilidade pública. Deve parecer um mapa vivo e bem cuidado, não um brinquedo ou uma campanha genérica de sustentabilidade.

### Paleta

```css
:root {
  --forest: #183B32;
  --leaf: #6F8F62;
  --sage: #DCE6D5;
  --paper: #F6F5EF;
  --ink: #202722;
  --muted: #737D73;
  --sun: #D9B95B;
  --danger: #B44D43;
}
```

Transforme as cores em tokens semânticos de tema. Garanta contraste legível.

### Interface desktop

- mapa como superfície dominante, ocupando aproximadamente 65% a 75% da tela;
- painel lateral para busca, filtros, lista de resultados e informação contextual;
- marca Flora MOC pequena e elegante;
- CTA “Adicionar planta” destacado e sempre acessível;
- clusters com contagem e marcadores por categoria;
- detalhes da planta em drawer/painel, sem tirar o usuário do contexto do mapa.

### Interface mobile

- mapa ocupando quase toda a viewport;
- cabeçalho compacto;
- busca na parte superior;
- filtros acessíveis em chips ou sheet;
- CTA flutuante “Adicionar planta”;
- detalhes em bottom sheet;
- formulários em etapas curtas;
- controles com área de toque confortável;
- nenhuma funcionalidade dependente de hover.

### Qualidade visual

- hierarquia tipográfica clara;
- espaços consistentes;
- bordas sutis;
- sombras discretas;
- ícones coerentes;
- estados vazios bem desenhados;
- skeletons ou loading states;
- feedback de sucesso/erro;
- animações discretas e respeitando `prefers-reduced-motion`.

Evite gradientes gratuitos, excesso de cards, excesso de bordas e grandes blocos de texto na tela inicial.

---

## 4. EXPERIÊNCIA E FUNCIONALIDADES A IMPLEMENTAR

### 4.1 Mapa público (`/`)

Implementar:

- mapa centrado na sede de Montes Claros;
- pan e zoom;
- consulta dos registros aprovados por bounding box;
- debounce das consultas no evento `moveend`;
- markers/GeoJSON source do MapLibre com clustering nativo;
- desagrupamento ao aproximar;
- cor/ícone por categoria, sem depender somente da cor;
- popup/resumo ao selecionar ponto;
- abrir detalhe completo;
- busca em nome popular e científico;
- filtros por categoria;
- limpar filtros;
- lista alternativa dos resultados da área para acessibilidade;
- estados de carregamento, vazio, erro e mapa indisponível.

Não renderize centenas de marcadores como componentes React separados se puder usar uma fonte GeoJSON/layers do MapLibre.

A consulta pública não pode carregar status pendente, rejeitado ou arquivado.

### 4.2 Autenticação (`/entrar`)

Implementar Supabase Auth com e-mail e senha:

- criar conta;
- entrar;
- sair;
- persistência de sessão;
- recuperação de senha se suportada pela configuração;
- estados de carregamento e erro;
- tratamento para confirmação de e-mail;
- redirecionamento de volta ao fluxo de contribuição após login.

Não armazenar senha manualmente nem criar tabela própria de senhas.

### 4.3 Cadastro (`/contribuir`)

Fluxo curto, com boa UX em celular.

#### Localização

- abrir mapa focado na cidade;
- permitir toque no mapa para posicionar marcador;
- permitir arrastar o marcador;
- botão “Usar minha localização” que solicita permissão apenas após clique;
- tratar permissão negada, navegador incompatível e timeout;
- exibir coordenadas ou indicação de posição selecionada de forma compreensível;
- oferecer opção “Ponto aproximado”.

#### Identificação

Campos:

- nome popular;
- opção “Não sei identificar”;
- nome científico opcional;
- categoria obrigatória;
- grau de identificação: identificada pelo colaborador / provável / desconhecida;
- tipo: indivíduo / grupo;
- quantidade aproximada opcional;
- observação com máximo de 500 caracteres;
- foto opcional.

Quando “Não sei identificar” estiver ativo, preencher `common_name` com `Planta não identificada` e `identification_level` com `unknown`. Não pedir nome científico.

#### Foto

- aceitar JPEG, PNG e WebP;
- no máximo 5 MB;
- uma foto por registro;
- mostrar preview;
- permitir remover/substituir antes do envio;
- comprimir/redimensionar no cliente quando possível;
- reprocessar a imagem para remover EXIF quando possível;
- armazenar no bucket Supabase `plant-photos`, no caminho `{userId}/{uuid}.{ext}`;
- validar MIME, tamanho e caminho também no Supabase Storage.

Se o upload falhar, não criar um registro apontando para imagem inexistente. Permitir ao usuário tentar novamente ou enviar sem foto com explicação clara.

#### Confirmação de responsabilidade

Adicionar checkbox obrigatório com texto equivalente a:

> Confirmo que o ponto está em espaço público ou que a planta pode ser observada de um local público. Não estou registrando endereço residencial, quintal privado, área restrita ou localização que exponha alguém a risco.

Exibir avisos de que o app não recomenda coleta, consumo, poda ou uso medicinal e de que a identificação pode estar incorreta.

#### Envio

- validar com Zod no frontend e constraints no banco;
- subir foto, se existir;
- inserir `plants` com status pending;
- não permitir que o frontend escolha outro status;
- mostrar confirmação de envio pendente de moderação;
- navegar para “Minhas contribuições” ou detalhe privado do envio.

### 4.4 Minhas contribuições (`/minhas-contribuicoes`)

Mostrar somente dados do usuário autenticado:

- lista dos próprios registros;
- imagem/thumbnail;
- nome, categoria e data;
- status com rótulo claro: Em análise, Aprovada, Não aprovada, Arquivada;
- filtro por status;
- abrir detalhes;
- editar/excluir apenas os pendentes;
- confirmação antes de excluir.

Para edição de registro aprovado, implementar fluxo que o retorne a `pending` e deixar claro na interface que ele sairá temporariamente do mapa até nova revisão. Não permitir que o cliente preserve `approved` após alteração.

### 4.5 Denúncia/sugestão de correção

Nos detalhes públicos:

- ação “Sugerir correção”;
- exigir login;
- motivos: identificação incorreta, localização errada, foto/descrição inadequada, localização privada/restrita, outro;
- detalhe opcional até 500 caracteres;
- confirmar envio;
- evitar denúncias abertas repetidas do mesmo usuário para o mesmo registro.

As denúncias e notas internas não aparecem publicamente.

### 4.6 Administração (`/admin`)

Proteger rota visualmente e no banco.

Painel:

- contadores: pendentes, aprovados, denúncias abertas;
- fila de pendentes ordenada por data de criação ascendente;
- filtros por categoria/data;
- cartão/detalhe do registro com foto e mapa;
- editar campos antes de aprovar;
- aprovar;
- rejeitar com nota interna;
- arquivar;
- revisar denúncias e resolver/descartar;
- métricas básicas por categoria e por período.

A autorização deve depender de `public.is_admin()`/política SQL, nunca somente de e-mail ou `localStorage`.

O usuário não administrador que tentar abrir `/admin` recebe página de acesso negado ou redirecionamento para o mapa. As chamadas ao Supabase continuam bloqueadas mesmo se forem executadas manualmente no navegador.

---

## 5. BANCO DE DADOS E MIGRATIONS

Criar diretório `supabase/migrations/` com migrations SQL completas, ordenadas e idempotentes quando viável. Não deixar o esquema apenas descrito no README.

Implementar as entidades abaixo segundo o PDR:

### `public.plants`

Campos mínimos:

- `id uuid primary key default gen_random_uuid()`;
- `created_by uuid not null references auth.users(id)`;
- `common_name text not null`;
- `scientific_name text null`;
- `category text not null`;
- `identification_level text not null`;
- `occurrence_type text not null`;
- `quantity_estimate text not null default 'unknown'`;
- `latitude double precision not null`;
- `longitude double precision not null`;
- `location_precision text not null default 'exact'`;
- `photo_path text null`;
- `description text null`;
- `status text not null default 'pending'`;
- `moderation_note text null`;
- `reviewed_by uuid null references auth.users(id)`;
- `reviewed_at timestamptz null`;
- `created_at timestamptz not null default now()`;
- `updated_at timestamptz not null default now()`.

Adicionar CHECK constraints para enums textuais, tamanho de campos e limites geográficos.

Criar índices para status, autor, data, busca por nome e consulta por latitude/longitude.

### `public.admin_users`

- `user_id uuid primary key references auth.users(id) on delete cascade`;
- `created_at timestamptz not null default now()`.

Criar `public.is_admin()`:

- função SQL ou PL/pgSQL com `SECURITY DEFINER`;
- `search_path` fixo e seguro;
- verifica `auth.uid()` em `public.admin_users`;
- revogar permissões públicas desnecessárias;
- conceder execução apenas aos roles necessários;
- não retornar lista de administradores.

### `public.plant_reports`

- `id uuid primary key default gen_random_uuid()`;
- `plant_id uuid not null references public.plants(id) on delete cascade`;
- `reported_by uuid not null references auth.users(id) on delete cascade`;
- `reason text not null`;
- `details text null`;
- `status text not null default 'open'`;
- `admin_note text null`;
- `resolved_by uuid null references auth.users(id)`;
- `created_at timestamptz not null default now()`;
- `resolved_at timestamptz null`.

Impor índice/restrição para impedir denúncias abertas repetidas do mesmo usuário para o mesmo registro.

### Triggers

Implementar trigger `updated_at`.

Implementar proteção de status:

- usuário comum não pode inserir registro aprovado;
- usuário comum não pode mudar seu status para aprovado/rejeitado/arquivado;
- somente admin pode alterar status e campos de moderação;
- edição de registro aprovado por seu dono deve resultar em `pending` ou ser bloqueada e direcionada para o fluxo seguro definido no produto.

Implementar limites no banco:

- no máximo 5 novos registros por hora por `created_by`;
- no máximo 10 denúncias por dia por `reported_by`.

Se uma trigger for usada, fixar `search_path`, tratar concorrência de forma razoável e não conceder permissões além do necessário. Erros devem produzir mensagens utilizáveis no cliente, sem revelar dados internos.

### RLS

Ativar RLS em todas as tabelas.

`plants`:

- `anon`: selecionar somente `approved`;
- `authenticated`: selecionar `approved` e os próprios registros;
- `authenticated`: inserir somente com `created_by = auth.uid()` e `status = 'pending'`;
- dono: atualizar/excluir somente seus registros pendentes;
- admin: ler e moderar todos;
- usuários comuns não alteram `moderation_note`, `reviewed_by` ou status.

`admin_users`:

- nenhuma escrita pelo cliente;
- evitar expor a tabela;
- bootstrap manual via SQL Editor do Supabase.

`plant_reports`:

- usuário autenticado insere denúncia em nome próprio;
- usuário comum só vê suas denúncias, caso a UX precise;
- admin vê e gerencia todas;
- visitante não lê denúncias.

**Não confie apenas nas policies de UI.** Tente provar a segurança com testes e instruções reproduzíveis.

### Storage

Criar bucket `plant-photos` por migration ou instrução SQL documentada:

- público para leitura apenas conforme a estratégia escolhida no PDR;
- upload autenticado;
- caminho começando pelo UID do usuário;
- MIME permitido: `image/jpeg`, `image/png`, `image/webp`;
- limite de 5 MB;
- usuário não grava no prefixo de outro usuário;
- política de atualização/exclusão restrita.

Se a configuração do bucket e as policies dependerem de migration, incluí-las em migration versionada. Não deixar a etapa crítica apenas como ação manual sem documentação.

---

## 6. DETALHES DE IMPLEMENTAÇÃO DO MAPA

1. Implementar o mapa em componente isolado, com ciclo de vida bem gerenciado (`new Map`, listeners, sources, layers e `map.remove()` ao desmontar).
2. Usar `maplibre-gl/dist/maplibre-gl.css`.
3. Seguir o quick start de MapLibre/OpenFreeMap para Vite. Se a versão escolhida exigir configuração específica de worker, implementar a configuração recomendada pela documentação atual do MapLibre/OpenFreeMap.
4. Não criar múltiplas instâncias acidentais do mapa ao renderizar React.
5. Buscar registros aprovados conforme os bounds atuais.
6. Debounce/controle para não realizar chamadas em excesso.
7. Usar cluster source no MapLibre.
8. Exibir popup/drawer acessível; não depender apenas do popup padrão pequeno em celular.
9. Filtros e busca devem atualizar os dados/visibilidade corretamente.
10. Quando não houver registro, exibir estado vazio e CTA para contribuir.
11. A posição inicial do mapa não é a localização do usuário. Pedir geolocalização apenas depois de clique no botão específico.
12. O mapa deve manter a atribuição exigida pelo provedor.
13. Não usar os tiles raster padrão `tile.openstreetmap.org` como fallback improvisado em produção. Se usar outro provedor, verificar termos e atribuição dele.
14. Guardar URL do estilo em `VITE_MAP_STYLE_URL`.

---

## 7. ESTRUTURA DE PROJETO ESPERADA

Você pode ajustar nomes se a arquitetura ficar mais clara, mas mantenha separação e organização equivalentes:

```text
/
├── public/
│   ├── favicon.svg
│   └── ...
├── src/
│   ├── app/
│   │   ├── App.tsx
│   │   ├── router.tsx
│   │   └── providers.tsx
│   ├── components/
│   │   ├── layout/
│   │   ├── map/
│   │   ├── plants/
│   │   ├── forms/
│   │   └── ui/
│   ├── features/
│   │   ├── auth/
│   │   ├── plants/
│   │   ├── reports/
│   │   └── admin/
│   ├── hooks/
│   ├── lib/
│   │   ├── supabase.ts
│   │   ├── map-config.ts
│   │   └── validation.ts
│   ├── pages/
│   ├── types/
│   ├── styles/
│   └── main.tsx
├── supabase/
│   └── migrations/
├── tests/ ou src/**/*.test.tsx
├── .env.example
├── .gitignore
├── README.md
├── package.json
├── tsconfig*.json
└── vite.config.ts
```

Não crie arquivos vazios só para preencher a árvore.

---

## 8. VARIÁVEIS DE AMBIENTE

Criar `.env.example` contendo apenas nomes e valores vazios/defaults públicos:

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_PUBLISHABLE_KEY=
VITE_MAP_STYLE_URL=https://tiles.openfreemap.org/styles/liberty
VITE_DEFAULT_MAP_LAT=-16.7280556
VITE_DEFAULT_MAP_LNG=-43.8650000
VITE_DEFAULT_MAP_ZOOM=12
VITE_CONTACT_EMAIL=
```

Usar a chave **publishable** atual do Supabase. A variável antiga `anon` pode existir em projetos legados, mas prefira `VITE_SUPABASE_PUBLISHABLE_KEY`.

Validar configuração na inicialização e apresentar erro amigável quando URL/chave estiverem ausentes. Não deixar a aplicação quebrar com stack trace obscuro.

Não criar secret key para o frontend. Não usar a service role no bundle.

---

## 9. TESTES OBRIGATÓRIOS

Criar scripts no `package.json` para:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "lint": "...",
    "typecheck": "...",
    "test": "..."
  }
}
```

Os comandos exatos podem mudar de acordo com as dependências escolhidas, mas devem existir e funcionar.

Testar pelo menos:

- validação de formulário;
- conversão/validação de latitude e longitude;
- estado de planta não identificada;
- regra de visibilidade baseada em status;
- componentes principais de autenticação e formulário (com mocks controlados);
- renderização do estado vazio;
- proteção visual das rotas autenticadas e administrativas.

Documentar testes manuais de integração necessários para RLS, Supabase Auth e Storage. Não afirmar que teste de componente prova a segurança do banco.

---

## 10. README OBRIGATÓRIO

O README deve permitir que outra pessoa coloque o projeto para funcionar sem depender de conversa anterior.

Incluir:

1. descrição do Flora MOC;
2. stack e arquitetura;
3. requisitos locais (Node LTS e npm);
4. instalação;
5. execução local;
6. configuração de `.env.local` a partir de `.env.example`;
7. como criar projeto Supabase;
8. como aplicar migrations com Supabase CLI ou SQL Editor;
9. como configurar Auth e URL de produção;
10. como configurar SMTP antes de abrir confirmação de e-mail ao público;
11. como criar primeiro admin;
12. como verificar políticas RLS;
13. como configurar o bucket e testar upload;
14. como fazer deploy na Vercel;
15. variáveis da Vercel;
16. testes disponíveis;
17. limitações conhecidas;
18. procedimento para trocar provedor/estilo de mapa;
19. aviso sobre custo e pausa do Supabase Free;
20. checklist de lançamento.

### Bootstrap do primeiro administrador

Documente um procedimento sem segredo no frontend:

1. criar uma conta normal usando o fluxo de cadastro;
2. no Supabase Dashboard, localizar o `id` do usuário em Authentication > Users;
3. executar no SQL Editor, substituindo o UUID real:

```sql
insert into public.admin_users (user_id)
values ('UUID_REAL_DO_USUARIO')
on conflict do nothing;
```

4. sair e entrar novamente na aplicação;
5. verificar acesso ao `/admin`.

Nunca colocar o UUID real no código-fonte ou commitar credenciais.

---

## 11. PRIVACIDADE E SEGURANÇA DO PRODUTO

Implementar os avisos do PDR nas telas adequadas. Não inventar uma política legal que prometa o que o sistema não faz.

Regras importantes:

- não expor e-mail ou nome completo do autor;
- não expor denúncias nem notas internas;
- não publicar registros não aprovados;
- não permitir autopromoção a admin;
- não armazenar localização do dispositivo sem ação do usuário;
- não criar tracking de deslocamento;
- validar arquivos no cliente e no Storage;
- escapar conteúdo de usuário;
- não permitir HTML livre na descrição;
- exibir que identificações são comunitárias e não validadas cientificamente;
- deixar claro que a aplicação não orienta consumo, coleta ou uso medicinal.

Adicionar página `/privacidade` com conteúdo inicial honesto e `VITE_CONTACT_EMAIL` como contato configurável. Se não houver contato configurado, apresentar uma mensagem administrativa de configuração pendente apenas em ambiente de desenvolvimento; não publicar em produção uma página com contato fictício.

---

## 12. ACABAMENTO E VERIFICAÇÃO

Antes de concluir:

1. Instale dependências necessárias.
2. Execute lint.
3. Execute typecheck.
4. Execute os testes.
5. Execute build de produção.
6. Corrija todos os erros reais.
7. Faça revisão de responsividade em largura 360 px, tablet e desktop.
8. Revise o fluxo completo de um usuário visitante.
9. Revise o fluxo completo de cadastro de uma planta.
10. Revise o fluxo de administração.
11. Revise permissões RLS e Storage.
12. Procure por `TODO`, `FIXME`, funções vazias, botões sem ação e mocks indevidos.
13. Procure por chaves/segredos e confira `.gitignore`.
14. Garanta que deep links funcionem com o fallback SPA apropriado na Vercel.
15. Garanta que o app explique a falta de configuração Supabase se as env vars ainda não existirem.

Não esconda falhas. Se uma integração não puder ser testada sem credenciais, marque exatamente o que ficou pendente e dê instruções concretas.

---

## 13. O QUE NÃO FAZER

- Não transformar o produto em landing page com mapa ilustrativo.
- Não colocar pins de demonstração no banco de produção.
- Não criar apenas protótipo estático.
- Não substituir Supabase por `localStorage`.
- Não salvar registros apenas no estado React.
- Não permitir registro público sem moderação.
- Não usar `localStorage` como fonte de autorização.
- Não confiar em `isAdmin` calculado apenas no cliente.
- Não usar chave service role no frontend.
- Não publicar foto ou coordenada de local privado sem análise.
- Não fazer identificação de espécie por IA no MVP.
- Não implementar recursos fora de escopo que atrasem os fluxos centrais.
- Não executar push/deploy nesta fase.

---

## 14. DEFINIÇÃO DE CONCLUÍDO PARA CLAUDE

A etapa Claude só estará concluída quando houver:

- aplicação implementada no diretório do projeto;
- migrations SQL completas;
- policies RLS e policies do Storage;
- `.env.example`;
- README de setup/deploy;
- testes e scripts funcionais;
- `npm run lint` aprovado;
- `npm run typecheck` aprovado;
- `npm run test` aprovado;
- `npm run build` aprovado;
- nenhuma chave secreta versionada;
- lista objetiva do que depende de credenciais ou ações no Dashboard.

Ao final, responda com um relatório curto e verificável:

1. funcionalidades concluídas;
2. arquitetura/estrutura criada;
3. migrations criadas;
4. comandos executados e resultados reais;
5. quais variáveis precisam ser preenchidas;
6. ações manuais restantes no Supabase;
7. riscos ou limitações reais;
8. confirmação de que não fez push nem deploy.

**Agora implemente. Não pare na análise.**

---

# PARTE II — PROMPT DE FINALIZAÇÃO PARA AGY CLI

Use este prompt no AGY CLI depois que Claude Sonnet terminar a implementação. Abra o terminal na raiz do projeto.

---

## MISSÃO DO AGY CLI

Você é o release engineer responsável pela última etapa do Flora MOC. Claude Sonnet já implementou o produto. Seu trabalho é **auditar, validar, corrigir problemas objetivos de integração/configuração, aplicar o banco no projeto correto, publicar no GitHub e fazer o deploy na Vercel**.

Você não é responsável por redesenhar ou reescrever o produto. Preserve a implementação feita por Claude.

Leia primeiro:

- `01-PDR-FloraMOC.md`;
- `02-Prompt-Implementacao-Claude-e-Finalizacao-AGY.md`;
- `README.md`;
- migrations em `supabase/migrations/`;
- `.env.example`;
- relatório final de Claude, se estiver salvo no repositório ou disponível no contexto.

### Regra de segurança

Antes de qualquer operação remota, identifique claramente:

- qual repositório Git está aberto;
- qual branch está ativa;
- qual projeto Supabase está linkado;
- qual projeto Vercel será usado;
- se existe `.env` local;
- se as variáveis de produção estão configuradas.

Não exiba valores de segredos no terminal, no relatório, no Git ou em mensagens. Não faça `git add .` sem verificar arquivos ignorados e status. Não use `--force` em push. Não apague dados ou projeto remoto. Não aplique migrations a um projeto Supabase sem verificar o `project ref` e confirmar que é o ambiente de produção desejado.

Se faltar uma credencial, login ou confirmação indispensável, pare somente a operação dependente dessa credencial, faça tudo o que for possível localmente e informe exatamente a ação manual necessária. Não invente credenciais nem URLs.

---

## FASE 1 — AUDITORIA DO PROJETO

1. Execute `pwd` e liste a estrutura do projeto.
2. Execute `git status --short --branch`.
3. Execute `git remote -v` e identifique o repositório sem expor tokens eventualmente embutidos na URL.
4. Leia `package.json`, `.gitignore`, `.env.example`, README e migrations.
5. Verifique se existem arquivos `.env`, `.env.local`, credenciais, dumps de banco ou artefatos que não podem ser commitados.
6. Procure chaves e padrões sensíveis no repositório. Não imprima o valor encontrado; informe apenas o caminho e o tipo do possível segredo.
7. Identifique o package manager e use o lockfile existente. Não troque npm por pnpm ou yarn sem necessidade.
8. Confirme que as rotas, os componentes e o mapa correspondem ao PDR.
9. Não reestruture ou reformate indiscriminadamente o projeto.

Produza mentalmente uma lista de problemas e resolva os que forem objetivos, localizados e seguros.

---

## FASE 2 — VALIDAÇÃO LOCAL

Execute na ordem apropriada:

```bash
npm ci
npm run lint
npm run typecheck
npm run test
npm run build
```

Se o projeto estiver usando outro package manager, utilize o comando equivalente respeitando o lockfile.

Corrija erros reais de lint, tipos, teste e build. Não desative regras para fazer os comandos passarem sem motivo. Não remova testes que falham só para obter um resultado verde.

Depois:

- confira que o output `dist/` foi criado;
- confira que `.env.local` não está sendo versionado;
- teste `npm run dev` quando possível;
- confira a inicialização com variáveis ausentes e com variáveis válidas;
- revise deep links/SPA fallback.

Se não houver credenciais Supabase, não simule sucesso de integração. Continue com build e auditoria, marcando os testes remotos como pendentes.

---

## FASE 3 — SUPABASE E BANCO DE PRODUÇÃO

### 3.1 Conferir o ambiente

1. Verifique se Supabase CLI está instalado ou disponível via `npx supabase`.
2. Verifique status de login/link sem imprimir tokens.
3. Confira `supabase/config.toml`, migrations e ordem de execução.
4. Se o projeto não estiver linkado, não escolha um projeto aleatório. Solicite/aguarde que o responsável informe o `project ref` correto ou use a configuração já existente.
5. Confira no Dashboard/CLI que a referência corresponde ao projeto de produção do Flora MOC.

### 3.2 Aplicar migrations

Somente depois de confirmar o projeto de produção:

```bash
supabase migration list
supabase db push
```

Use `npx supabase` se não houver instalação global.

Se houver divergência de histórico, migration pendente conflitante ou risco de perda de dados, não use reset, não apague migration e não force reparo automático. Diagnostique e apresente o plano seguro.

### 3.3 Conferir banco e segurança

Verificar:

- tabelas `plants`, `admin_users`, `plant_reports` criadas;
- RLS ativa nas tabelas;
- policies presentes e coerentes;
- função `is_admin()` criada com search path seguro;
- constraints de categoria/status/identificação/coordenadas presentes;
- triggers de `updated_at` e rate limit presentes, se previstas;
- bucket `plant-photos` criado;
- regras de Storage ativas;
- leitura pública limitada a registros aprovados;
- inserções autenticadas criam somente pendentes;
- usuário comum não pode aprovar a própria contribuição;
- usuário comum não vê denúncias de terceiros nem notas internas.

Se alguma regra de segurança falhar, corrija a migration e aplique uma migration nova. Evite editar migration que já foi aplicada em produção. Nunca resolva falha desativando RLS.

### 3.4 Bootstrap do administrador

Não invente o usuário administrador.

Se já houver uma conta administradora criada pelo responsável, obtenha o UUID pelo procedimento seguro documentado e execute o `INSERT` em `admin_users` apenas depois de confirmação explícita de que o usuário correto é o responsável do projeto.

Se ainda não houver usuário:

1. deixe o procedimento pronto no README;
2. informe ao responsável que deve criar uma conta no site;
3. depois, inserir o UUID real no SQL Editor;
4. não conceda administração a um e-mail ou UUID presumido.

---

## FASE 4 — CONFIGURAÇÃO DA APLICAÇÃO

Conferir se existem as variáveis:

```env
VITE_SUPABASE_URL
VITE_SUPABASE_PUBLISHABLE_KEY
VITE_MAP_STYLE_URL
VITE_DEFAULT_MAP_LAT
VITE_DEFAULT_MAP_LNG
VITE_DEFAULT_MAP_ZOOM
VITE_CONTACT_EMAIL
```

Regras:

- `VITE_SUPABASE_URL` deve ser a URL do projeto Supabase correto;
- `VITE_SUPABASE_PUBLISHABLE_KEY` deve ser a chave publishable desse mesmo projeto;
- `VITE_MAP_STYLE_URL` deve apontar para estilo válido, por padrão OpenFreeMap Liberty;
- latitude/longitude/zoom devem usar os defaults documentados, salvo decisão do responsável;
- `VITE_CONTACT_EMAIL` deve ser um contato real aprovado pelo responsável.

A chave publishable pode ficar no frontend. Chave `sb_secret`, `service_role`, senha ou token privado nunca pode ter prefixo `VITE_` nem ser enviada ao browser.

Não copie arquivo `.env.local` para o GitHub. Se for necessário criar configuração local, use `.env.local` e confirme `.gitignore` antes.

---

## FASE 5 — CONFIGURAR AUTH E DOMÍNIOS

No Supabase, confirmar:

- Site URL apontando para o domínio de produção quando o domínio existir;
- Redirect URLs incluindo os caminhos de callback necessários;
- confirmação de e-mail configurada de acordo com o método adotado;
- SMTP próprio configurado antes de abrir o cadastro ao público caso a confirmação de e-mail esteja habilitada;
- recuperação de senha e redirects funcionando;
- mensagens de Auth e URL permitidas coerentes com o domínio publicado.

Não desative confirmação de e-mail em produção apenas para simplificar o deploy. Se estiver desativada temporariamente para o piloto, sinalize como decisão provisória e recomende configurar SMTP/confirmar política antes da divulgação ampla.

---

## FASE 6 — GITHUB

Antes de publicar:

1. Revise `git status`.
2. Confirme `.gitignore` para `.env*`, exceto `.env.example`.
3. Não adicione `node_modules`, `dist` se a estratégia do projeto não versionar build, dumps, logs, tokens ou credenciais.
4. Revise diff e migrations.
5. Execute novamente lint, typecheck, tests e build.

Se não houver repositório remoto:

- não crie um repositório público sem autorização;
- solicite o destino/nome ou use o remoto já configurado.

Se houver remoto correto:

- preparar commit com mensagem objetiva, por exemplo `feat: launch Flora MOC collaborative plant map`;
- não incluir segredo;
- não reescrever histórico;
- não usar `--force`;
- enviar para a branch de produção definida (preferencialmente `main`).

Se o push for rejeitado por divergência, não force. Inspecione o histórico e resolva com merge/rebase seguro, explicando qualquer conflito relevante.

---

## FASE 7 — VERCEL E DEPLOY

1. Verifique se Vercel CLI está disponível e autenticada.
2. Verifique se o projeto Vercel já existe e se está associado ao repositório correto.
3. Se o projeto ainda não existir, não crie com um nome/domínio definitivo sem verificar a preferência do responsável. Nome sugerido: `flora-moc`.
4. Configure framework/build:
   - framework: Vite;
   - build: `npm run build`;
   - output: `dist`.
5. Configure as variáveis de ambiente de produção na Vercel, usando os mesmos valores Supabase do projeto correto.
6. Não adicionar `sb_secret`/service role ao projeto frontend.
7. Confirmar fallback SPA para rotas internas.
8. Executar deploy de produção somente após validação e confirmação do responsável sobre o destino.

Se CLI autenticada:

```bash
vercel link
vercel env ls
vercel deploy --prod
```

Os comandos podem variar conforme o estado do projeto. Não executar `vercel link` para um projeto errado. Não imprimir o conteúdo das variáveis.

Depois do deploy, capturar a URL real retornada. Não inventar ou presumir o domínio final.

---

## FASE 8 — TESTE PÓS-DEPLOY

Abrir a URL de produção e testar, no mínimo:

### Visitante

- home abre por HTTPS;
- mapa carrega;
- atribuição do mapa aparece;
- pesquisa e filtros funcionam;
- detalhe de registro aprovado abre;
- registros pendentes não aparecem;
- página de privacidade abre.

### Usuário

- criar conta/entrar;
- logout;
- criar registro com localização manual;
- criar registro não identificado;
- upload de foto válida;
- confirmar que entra como pendente;
- confirmar que aparece em minhas contribuições;
- tentar acesso indevido a `/admin`.

### Administrador

- login de admin;
- fila pendente;
- aprovar registro;
- confirmar que registro aprovado aparece no mapa público;
- rejeitar outro registro;
- abrir denúncia e resolver;
- confirmar que dados internos não aparecem no mapa.

### Mobile

- testar layout em viewport estreita;
- confirmar controles e bottom sheet;
- confirmar que formulário é utilizável;
- confirmar que mapa não bloqueia o botão de cadastro.

Se não houver credenciais de uma conta de teste/administrador, não inventar. Faça os testes anônimos possíveis e liste explicitamente os testes autenticados que dependem de ação do responsável.

---

## FASE 9 — RELATÓRIO FINAL

Ao concluir, entregue um relatório com:

1. status geral: publicado / parcialmente publicado / bloqueado;
2. repositório e branch usados;
3. hash do commit enviado;
4. URL de produção real;
5. identificador/nome do projeto Vercel;
6. projeto Supabase utilizado, sem segredos;
7. migrations aplicadas;
8. resultado de lint, typecheck, testes e build;
9. resultado dos testes pós-deploy;
10. configuração de Auth/SMTP pendente, se houver;
11. bootstrap de admin pendente, se houver;
12. problemas encontrados e correções realizadas;
13. limitações conhecidas;
14. ações manuais restantes do responsável.

**Não escreva “tudo funcionando” se algum fluxo crítico não foi testado. Separe claramente o que foi verificado do que apenas foi preparado.**

---

## 15. INSTRUÇÃO FINAL PARA AGY CLI

Faça a finalização com o mínimo de alterações possível. O produto já foi construído. Seu trabalho é garantir que o código esteja íntegro, que o banco e suas políticas estejam corretos, que o repositório esteja seguro e que a versão publicada funcione.

**Comece pela auditoria local e avance em ordem. Não pule validações para chegar mais rápido ao deploy.**

---

# PARTE III — CHECKLIST HUMANO DE CONTAS E ACESSOS

Esta parte é para o responsável pelo projeto. Claude e AGY podem preparar e verificar os arquivos, mas não devem inventar credenciais nem agir em contas sem autorização.

## Antes da etapa AGY

- [ ] Ter uma conta GitHub disponível.
- [ ] Criar ou escolher um repositório para Flora MOC.
- [ ] Criar um projeto Supabase para produção/piloto.
- [ ] Guardar a Project URL e a Publishable Key em local seguro.
- [ ] Criar conta na Vercel e conectar ao GitHub.
- [ ] Decidir qual e-mail real será o contato público do app.
- [ ] Definir quem será o primeiro administrador.

## No Supabase

- [ ] Confirmar que o projeto Supabase correto foi selecionado.
- [ ] Configurar Authentication URLs para o domínio de produção.
- [ ] Configurar SMTP se a confirmação de e-mail estiver habilitada.
- [ ] Criar conta do primeiro administrador pelo próprio app.
- [ ] Inserir o UUID real do usuário em `public.admin_users` pelo SQL Editor.
- [ ] Verificar RLS e bucket de fotos.

## Na Vercel

- [ ] Importar o repositório correto.
- [ ] Configurar as variáveis `VITE_*` necessárias.
- [ ] Confirmar build `npm run build` e diretório `dist`.
- [ ] Configurar domínio, se houver um domínio próprio.
- [ ] Verificar que nenhuma chave secreta foi adicionada ao frontend.

## Antes de divulgar

- [ ] Fazer um registro real de teste.
- [ ] Aprovar esse registro no painel admin.
- [ ] Confirmar que aparece no mapa público.
- [ ] Testar a contribuição pelo celular.
- [ ] Revisar o texto de privacidade e o contato.
- [ ] Definir uma rotina de moderação para a fila de novos registros.
- [ ] Divulgar o projeto deixando claro que as identificações são colaborativas e podem conter erros.
