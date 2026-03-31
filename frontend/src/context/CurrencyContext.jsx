import { createContext, useContext, useState, useEffect } from 'react';

const CurrencyContext = createContext();

export const CurrencyProvider = ({ children }) => {
  const [currency, setCurrency] = useState(() => {
    return localStorage.getItem('fintrack_currency') || 'USD';
  });

  const currencyMap = {
    'USD': { symbol: '$', code: 'USD' },
    'EUR': { symbol: '€', code: 'EUR' },
    'GBP': { symbol: '£', code: 'GBP' },
    'INR': { symbol: '₹', code: 'INR' },
    'JPY': { symbol: '¥', code: 'JPY' },
    'AED': { symbol: 'د.إ', code: 'AED' },
    'CNY': { symbol: '¥', code: 'CNY' },
  };

  useEffect(() => {
    localStorage.setItem('fintrack_currency', currency);
  }, [currency]);

  const formatCurrency = (amount) => {
    const { symbol, code } = currencyMap[currency] || currencyMap['USD'];
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: code,
      currencyDisplay: 'narrowSymbol'
    }).format(amount).replace(code, symbol);
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, currencyMap, formatCurrency }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};
