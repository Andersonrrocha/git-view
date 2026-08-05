# DevScope

<!-- atlas:início -->
<!-- gerado a partir de storm-atlas/projects/DevScope.md — não editar à mão -->

> Painel de analytics dos teus repositórios do GitHub — gráficos, ranking de contribuidores e insights gerados sozinhos.

## O que é

Uma aplicação web que entra na tua conta do GitHub por OAuth, lista os teus repositórios e abre
cada um numa página de métricas: linguagens, atividade de commits ao longo do ano, mapa de calor
por dia da semana, ranking de contribuidores, issues e pull requests. Por cima dos números roda
um motor de insights que traduz o gráfico em frase — "atividade caiu 60% no último trimestre",
"este repo está parado há 4 meses", "um contribuidor responde por 85% dos commits".

## Por que existe

O GitHub mostra os dados brutos espalhados por várias abas e não conclui nada a partir deles.
Quem tem dezenas de repositórios não consegue responder de relance quais estão vivos, quais
apodreceram e onde o trabalho está concentrado numa pessoa só. O DevScope junta tudo numa
superfície e, principalmente, **interpreta**: em vez de mais um gráfico para o utilizador ler,
entrega a leitura já feita.

## O que faz

- **Login com GitHub por OAuth** (Auth.js v5), com escopo `repo` — inclui repositórios privados
- **Listagem dos repositórios** do utilizador em cards uniformes, com filtro por visibilidade
  (públicos / privados / todos)
- **Página de detalhe por repositório** com métricas de topo em cards
- **Gráfico de linguagens** por proporção de bytes
- **Gráfico de atividade de commits** ao longo das últimas 52 semanas
- **Mapa de calor de atividade** por dia da semana
- **Ranking de contribuidores** por volume de commits
- **Gráfico de issues** abertas contra fechadas
- **Insights automáticos** — sete heurísticas sobre os dados: tendência de atividade, dia mais
  ativo, deteção de repositório parado, dominância de um contribuidor, taxa de fecho de issues
  e taxa de merge de PRs
- **Estados de carregamento com skeletons** em vez de spinners
- **Tema claro e escuro**

## Como funciona

- Monorepo com npm workspaces (`apps/web`), embora hoje só exista uma app — a estrutura foi
  deixada aberta para um serviço futuro
- Next.js 16 com App Router; as chamadas ao GitHub passam por rotas de API próprias
  (`/api/github/...`) para o token nunca chegar ao browser
- O token de acesso é guardado no JWT da sessão pelos callbacks do Auth.js e relido em cada rota
- TanStack Query como camada de cache no cliente; as páginas forçam render dinâmico e
  `no-cache` para não servir métricas velhas
- A API de estatísticas do GitHub responde **202 enquanto ainda calcula** o resultado —
  `githubFetchStats` trata esse caso com retry, senão os gráficos vinham vazios na primeira visita
- Recharts para os gráficos, shadcn/ui e Radix para os componentes

## Estado atual

Funciona ponta a ponta: login, listagem, detalhe, gráficos e insights. Todos os 21 commits são
de um único dia (2026-02-19) — foi construído numa sessão e não foi tocado desde então. Nunca foi
implantado; só corre em `localhost`. O `README` de `apps/web` ainda é o do `create-next-app`.
O nome no remote (`git-view`) é anterior ao rebaptismo para DevScope e nunca foi acertado.

<!-- atlas:fim -->
