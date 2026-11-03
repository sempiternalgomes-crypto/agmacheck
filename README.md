# Aplicativo local de precificação e cadastro Shopee

## Publicação

Mantenha estes itens juntos na raiz publicada pelo GitHub Pages:

- `index.html`
- `sw.js`
- `manifest.json`
- a pasta `assets/` completa

Em **Settings → Pages**, selecione a branch principal e a pasta `/(root)`. A câmera exige contexto seguro, então use o endereço HTTPS do GitHub Pages. Após o primeiro carregamento, o service worker armazena o aplicativo, as bibliotecas locais e o modelo XLSX para uso offline.

## Dados existentes e identidade visual

O aplicativo continua usando uma instalação e um nome/logotipo configuráveis. A atualização migra os dados antigos para o armazenamento versionado sem apagar os produtos, grupos ou histórico. O localStorage permanece neste navegador e aparelho. Use **Configurações → Backup e restauração** para exportar ou restaurar o JSON completo, que também inclui os produtos de Cadastro Shopee e seus padrões.

## Cadastro Shopee

1. Na aba **Cadastro Shopee**, leia o código com a câmera ou digite o GTIN/EAN e verifique o dígito. A câmera usa ZXing incorporado localmente. O código não consulta serviços externos e não preenche nome, marca ou dados fiscais.
2. Preencha nome, categoria Shopee pelo código numérico, preço/estoque e NCM conforme necessário. Os campos de Anvisa, marca e categoria textual ficam para consulta; o modelo fornecido não tem colunas próprias para Anvisa ou marca.
3. Cadastre as variações como linhas com cada combinação, preço, estoque e SKU opcional.
4. Em **Produtos cadastrados**, pesquise, filtre pendências, edite, selecione um ou vários produtos.
5. Em **Exportar planilha**, valide o lote e gere o XLSX. Só os produtos selecionados entram no arquivo; a base local permanece intacta.

A exportação altera somente a aba **Modelo** do XLSX oficial, inserindo os registros depois das seis linhas estruturais do template. Preserva as sete abas (incluindo as duas ocultas), nomes, identificadores, listas, validações, estilos e os cabeçalhos originais. O arquivo e a biblioteca JSZip são locais. CSOSN, origem e unidade são gravados com as descrições exatas das listas ocultas do próprio modelo, usando os códigos configurados.

Os padrões iniciais são Simples Nacional, CSOSN 102, CFOP 5102/6102, origem 0, UN, peso 0,200 kg e dimensões 5 × 5 × 5 cm. Podem ser alterados em **Configurações → Padrões da planilha Shopee**. O NCM continua individual por produto. Nome e descrição provisória são gerados na exportação quando a descrição está vazia. O modelo não tem uma coluna de regularização Anvisa nem de regime tributário isolado.

O modelo marca a URL de imagem de variação como condicionalmente obrigatória. Como o cadastro não coleta imagens, a exportação de itens com variação pede confirmação, deixa essa coluna vazia e avisa que a Shopee pode exigir complementação. A versão não garante aceitação pela Shopee; teste um lote pequeno na Central do Vendedor antes de usar em massa. Fotos e descrição definitiva podem ser incluídas diretamente na Shopee.

## Importação dos produtos de precificação

Na aba **Produtos**, use **Importar** para acrescentar um CSV exportado pelo aplicativo ou produtos de um backup JSON sem substituir os cadastros atuais. A importação integral de todos os dados continua em **Configurações → Backup e restauração**.
