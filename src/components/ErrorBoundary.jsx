import { Component } from 'react';

class ErrorBoundary extends Component {
  state = {
    hasError: false,
  };

  static getDerivedStateFromError() {
    return {
      hasError: true,
    };
  }

  render() {
    if (this.state.hasError) {
      return (
        <main role="alert">
          <h1>Questa sezione non è disponibile.</h1>
          <p>
            Si è verificato un errore. Puoi usare la navigazione
            per continuare oppure ricaricare la pagina.
          </p>

          <button
            type="button"
            onClick={() => window.location.reload()}
          >
            Ricarica
          </button>
        </main>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;