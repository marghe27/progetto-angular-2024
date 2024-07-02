# Progetto Personale: Angular e JSON Server

## Descrizione

Questo progetto personale contiene due parti principali:

1. **Server JSON**: Utilizzato per simulare le API del backend, implementato con `json-server` versione `^0.16.3`.
2. **Progetto Angular**: Un'applicazione frontend sviluppata con Angular versione `16.2.0`.

## Struttura del Progetto


### JSON Server

La cartella `json-server` contiene tutto il necessario per avviare un server JSON locale. Questo server utilizza un file `server.js` per la configurazione e un database in formato JSON contenuto nel file `db.json`.

#### Come Avviare il JSON Server

1. Assicurati di aver installato le dipendenze con `npm install`.
2. Avvia il server JSON con il seguente comando:
    ```bash
    node server
    ```
3. Il server risponderà sulla porta `3000`.

### Applicazione Angular

La cartella `project-demo` contiene il codice sorgente dell'applicazione Angular. Questa applicazione si interfaccia con il server JSON per le operazioni CRUD.

#### Come Avviare l'Applicazione Angular

1. Naviga nella cartella `project-demo` e installa le dipendenze con:
    ```bash
    npm install
    ```
2. Avvia l'applicazione Angular con il seguente comando:
    ```bash
    ng serve
    ```
3. Apri il browser e vai all'indirizzo `http://localhost:4200` per vedere l'applicazione in esecuzione.

## Requisiti

- Node.js (versione 14 o superiore)
- npm (versione 6 o superiore)
- Angular CLI (versione 16.2.0)

## Installazione

Per installare tutte le dipendenze del progetto, esegui i seguenti comandi nelle rispettive cartelle (`json-server` e `project-demo`):

```bash
npm install
