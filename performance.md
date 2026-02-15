# Considerações de Performance

Otimizar utilização de recursos, evitar engasgos na utilização da interface

## Geral

- Evitar operações que possam bloquear o Main Proccess ou a UI
- Importar módulos e arquivos dinamicamente conforme necessidade
- Reduzir número de dependencias e procurar por alternativas mais leves (poucas dependencias)

## Main Proccess

- [ ] Usar [Worker Threads](https://nodejs.org/api/worker_threads.html) para computações pesadas no Main Proccess
- [ ] Preferir módulos assincronos do NodeJS

## Renderer Proccess

- Sempre se certificar que o TypeScript tenha como target a versão mais recente do ECMAScript suportada pelo Electron
- Utilizar [requestIdleCallback()](https://developer.mozilla.org/en-US/docs/Web/API/Window/requestIdleCallback) para executar funções de baixa prioridade quando o processo entrar em estado ocioso
- Utilizar [Web Workers](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers) para operações que requerem muito poder de processamento por um longo período de tempo. Levar em consideração as ressalvas [Electron Multithreading](https://www.electronjs.org/docs/latest/tutorial/multithreading)

### Audio Reaction

- [ ] Realizar cálculos em uma Worker Thread
- [ ] Utilizar shader simples para visualizador waveform
