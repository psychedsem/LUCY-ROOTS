# LUCY//ROOTS

**Go inward. Grow outward.**

## Links

- Live Demo: https://lucy-roots.web.app
- GitHub: https://github.com/psychedsem/LUCY-ROOTS

LUCY//ROOTS è una single page application React dedicata alla meditazione.

Il progetto unisce un timer programmabile, cronologia locale, soundscape YouTube e una sezione introduttiva alla pratica meditativa. L'identità visiva mescola elementi naturali, solarpunk e psichedelici con piccoli accenti digitali.

## Funzioni principali

- timer con durate rapide e durata personalizzata
- pausa, ripresa e reset del timer
- segnale sonoro al completamento
- cronologia delle sessioni salvata in `localStorage`
- raggruppamento automatico dei timer completati in sessioni
- rinomina delle sessioni
- libreria di soundscape con player YouTube
- selezione rapida del sound e controllo Loop
- sezione Learn dedicata alla meditazione e alla preparazione consapevole alla respirazione olotropica
- navigazione Home, Meditate e Learn con React Router
- layout responsive per desktop, tablet e mobile

## Tecnologie

- React
- React Router
- Vite
- Vitest
- Testing Library
- CSS Modules
- Firebase Hosting

## Avvio locale

~~~bash
npm install
npm run dev
~~~

## Controlli del progetto

~~~bash
npm run test:run
npm run lint
npm run build
~~~

## Struttura essenziale

~~~text
src/
  assets/       immagini e audio
  components/   componenti riutilizzabili
  hooks/        logica del timer
  pages/        Home, Meditate e Learn
  styles/       stile globale e variabili
  utils/        cronologia e integrazione YouTube
~~~

La cronologia viene salvata localmente nel browser tramite `localStorage`.

I contenuti audio sono incorporati da YouTube e richiedono una connessione internet.

## Contatti

Per informazioni sul progetto o per entrare in contatto con me:

- LinkedIn: [Simone "Sem"](https://www.linkedin.com/in/simone-sem/)