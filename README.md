# Calculadora de Troco

Este projeto é uma calculadora de troco para caixas, desenvolvida em HTML, CSS (Bootstrap) e JavaScript. Ele permite configurar as quantidades de cada denominação de dinheiro disponível no caixa e calcular o troco a ser devolvido em uma venda.

## Funcionalidades
- Configuração do caixa com diferentes valores de notas e moedas.
- Cálculo automático do troco com base no valor da compra e valor entregue.
- Exibição do detalhamento do troco (quantidade de cada nota/moeda devolvida).
- Alerta caso o caixa não tenha troco suficiente.
- Armazenamento das configurações e estado do caixa usando `localStorage`.
- Interface responsiva utilizando Bootstrap.

## Estrutura do Projeto
- `index.html`: Página principal para cálculo do troco.
- `config.html`: Página para configurar as quantidades de cada denominação no caixa.
- `script.js`: Lógica JavaScript para cálculo, configuração e exibição dos dados.
- `images/`: Pasta com imagens das notas e moedas (nomeadas pelo valor em centavos, ex: `20000.png` para R$200,00).

## Como Usar
1. Abra `config.html` para configurar as quantidades iniciais de cada nota/moeda no caixa.
2. Salve e volte para `index.html`.
3. Informe o valor da compra e o valor entregue pelo cliente.
4. Clique em "Calcular Troco" para ver o detalhamento do troco a ser devolvido.

## Observações
- O sistema utiliza o `localStorage` do navegador para manter os dados entre visitas.
- Para hospedar, basta subir os arquivos em um serviço como GitHub Pages.
- As imagens das notas/moedas devem estar na pasta `images/` e nomeadas conforme o valor em centavos.

## Exemplo de Imagem
- `images/20000.png` → representa a nota de R$200,00
- `images/1.png` → representa a moeda de R$0,01

## Licença
Este projeto é livre para uso e modificação.
