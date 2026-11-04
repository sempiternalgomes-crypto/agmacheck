# Busca de NCM/CEST por GTIN (proxy do Cosmos)

O app roda no navegador. Se o token do Cosmos ficasse dentro do `index.html`, qualquer pessoa que abrisse o site poderia copiá-lo.
Por isso o token fica num **Worker gratuito da Cloudflare**, e o app só conhece o endereço dele.

O app funciona sem isto (só com as bases abertas, que trazem nome e marca, mas **não** NCM). Para o NCM vir sozinho, faça o passo a passo abaixo uma vez.

## O que você precisa
1. Conta no **Cosmos Bluesoft** (cosmos.bluesoft.com.br) com um **token de API**. Confira no site deles o limite de consultas do seu plano e as regras de uso comercial.
2. Conta gratuita na **Cloudflare** (cloudflare.com). Os nomes dos menus podem mudar um pouco com o tempo.

## Passo a passo
1. Na Cloudflare, abra **Workers & Pages** e clique em **Create** → **Create Worker**. Dê um nome (ex.: `cosmos-proxy`) e clique em **Deploy**.
2. Clique em **Edit code**, apague o código de exemplo, cole **todo** o conteúdo do arquivo `cosmos-proxy.js` desta pasta e clique em **Deploy**.
3. Volte ao Worker, abra **Settings → Variables and Secrets** e adicione:
   - **COSMOS_TOKEN** do tipo **Secret**, com o seu token do Cosmos.
   - (opcional) **ALLOWED_ORIGINS** do tipo texto. Já vem configurado para `https://sempiternalgomes-crypto.github.io`. Só preencha se mudar o endereço do site ou quiser liberar mais de um (separe por vírgula).
4. Clique em **Deploy** de novo para aplicar as variáveis.
5. Copie o endereço do Worker (algo como `https://cosmos-proxy.seu-usuario.workers.dev`).
6. No app: **Configurações → Busca automática por GTIN**, cole o endereço, clique em **Salvar** e depois em **Testar conexão**. Deve aparecer "Conexão OK".

## Como funciona
- `/ping` confere se o Worker responde e se o token está configurado.
- `/gtin/<código>` consulta o Cosmos. O Worker guarda a resposta por 30 dias (e "não encontrado" por 1 dia), e o app também guarda no aparelho. Assim o mesmo código não gasta a cota duas vezes.
- Só o site liberado em `ALLOWED_ORIGINS` consegue usar o Worker pelo navegador. Isso dificulta o uso por terceiros, mas não é uma trava absoluta: não divulgue o endereço do Worker.

## Se der erro
- **"Não consegui falar com o proxy"**: endereço errado ou Worker não publicado.
- **"O proxy recusou a chamada"**: token inválido, ou o site não está em `ALLOWED_ORIGINS`.
- **"Limite de consultas atingido"**: cota do Cosmos esgotada; tente mais tarde.
