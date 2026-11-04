# Aplicativo de precificação e cadastro Shopee

## Publicação (GitHub Pages)
Mantenha na raiz publicada: `index.html`, `sw.js`, `manifest.json` e a pasta `assets/` completa. A pasta `worker/` não é usada pelo site; ela guarda o proxy opcional da busca de NCM.
Em **Settings → Pages**, selecione a branch principal e a pasta `/(root)`. A câmera exige HTTPS (o endereço do GitHub Pages já é).

Ao atualizar os arquivos, o app recebe a nova versão na próxima abertura com internet. Se algo antigo persistir, feche e abra o app de novo.

## O que mudou nesta versão
- **Consulta rápida limpa:** os padrões aplicados (embalagem, taxas, margem) saíram da tela inicial. Continuam sendo usados nos cálculos e se editam em **Configurações → Parâmetros financeiros padrão**.
- **Busca por GTIN:** ao ler ou digitar o código, o app preenche nome, marca, categoria de referência, **NCM e CEST** (via Cosmos) e, sem proxy, nome e marca pelas bases abertas Open Food/Beauty/Products Facts. Só campos vazios são preenchidos; o que você já digitou não é sobrescrito. Veja `worker/LEIA-ME.md`.
- **Completar NCM em lote:** em Cadastro Shopee → Cadastrados, o botão busca o NCM de todos os cadastros que ainda não têm.
- **NCMs recentes:** o campo NCM sugere os NCMs que você já usou em outros cadastros.
- **Novo visual:** tema claro/escuro/automático (botão no topo), menu lateral no computador e barra inferior no celular, cartões e cores de margem.
- **Correções:** o nome exportado não repete mais a marca quando ela já está no nome; o cache offline não responde mais com a página HTML a uma consulta de API sem internet; o botão de modo (unitário/box) não desliga mais as abas do Cadastro Shopee; margem no limite aparece como atingida.

## Dados
Tudo fica no `localStorage` deste navegador. Use **Configurações → Backup** para exportar o JSON. A configuração da busca (endereço do proxy), o tema e o cache de GTIN ficam à parte e **não entram no backup**.

## Cadastro Shopee e exportação
A exportação altera só a aba **Modelo** do XLSX oficial (`assets/Shopee_mass_upload_..._basic_template.xlsx`), preservando as demais abas. Fotos, atributos específicos de categoria e Anvisa não são preenchidos. Teste um lote pequeno na Central do Vendedor antes de usar em massa. Se a Shopee publicar um modelo novo, troque o arquivo em `assets/` e ajuste o nome em `index.html` e `sw.js`.
