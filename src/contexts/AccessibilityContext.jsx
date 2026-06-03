import { createContext, useContext, useState, useEffect } from 'react';

const AccessibilityContext = createContext();

export const useAccessibility = () => useContext(AccessibilityContext);

export const AccessibilityProvider = ({ children }) => {
  const [modoSenior, setModoSenior] = useState(false);
  const [altoContraste, setAltoContraste] = useState(false);

  // Carregar do localStorage
  useEffect(() => {
    const savedSenior = localStorage.getItem('modoSenior') === 'true';
    const savedContrast = localStorage.getItem('altoContraste') === 'true';
    setModoSenior(savedSenior);
    setAltoContraste(savedContrast);
  }, []);

  // Aplicar classes no body e salvar
  useEffect(() => {
    if (modoSenior) {
      document.body.classList.add('modo-senior');
    } else {
      document.body.classList.remove('modo-senior');
    }
    localStorage.setItem('modoSenior', modoSenior);
  }, [modoSenior]);

  useEffect(() => {
    if (altoContraste) {
      document.body.classList.add('alto-contraste');
    } else {
      document.body.classList.remove('alto-contraste');
    }
    localStorage.setItem('altoContraste', altoContraste);
  }, [altoContraste]);

  return (
    <AccessibilityContext.Provider value={{ modoSenior, setModoSenior, altoContraste, setAltoContraste }}>
      {children}
    </AccessibilityContext.Provider>
  );
};