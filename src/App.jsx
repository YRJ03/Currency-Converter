import { useState, useEffect } from "react";
import axios from "axios";
import './App.css';

const App = () => {
  const [amount, setAmount] = useState(1); 
  const [fromCurrency, setFromCurrency] = useState("USD"); 
  const [toCurrency, setToCurrency] = useState("EUR"); 
  const [convertedAmount, setConvertedAmount] = useState(null);
  const [currencies, setCurrencies] = useState([]); 

  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        const response = await axios.get("https://api.exchangerate-api.com/v4/latest/USD");
        setCurrencies(Object.keys(response.data.rates)); 
      } catch (error) {
        console.error("Error fetching currency data", error);
      }
    };
    fetchCurrencies();
  }, []);

  useEffect(() => {
    const fetchConversionRate = async () => {
      if (fromCurrency === toCurrency) {
        setConvertedAmount(amount); 
        return;
      }

      try {
        const response = await axios.get(`https://api.exchangerate-api.com/v4/latest/${fromCurrency}`);
        const rate = response.data.rates[toCurrency]; 
        const convertedValue = (amount * rate).toFixed(2); 
        setConvertedAmount(convertedValue); 
      } catch (error) {
        console.error("Error fetching exchange rate", error);
      }
    };

    fetchConversionRate();
  }, [amount, fromCurrency, toCurrency]); 

  const handleAmountChange = (e) => {
    const value = e.target.value;
    if (value >= 0) {
      setAmount(value); 
    }
  };

  const handleFromCurrencyChange = (e) => {
    setFromCurrency(e.target.value); 
  };

  const handleToCurrencyChange = (e) => {
    setToCurrency(e.target.value); 
  };

  return (
    <div className="app">
      <h1>Currency Converter</h1>

      <div className="converter-container">
        <div className="input-group">
          <input
            type="number"
            value={amount}
            onChange={handleAmountChange}
            min="0"
            step="0.01"
            className="amount-input"
          />
          <select value={fromCurrency} onChange={handleFromCurrencyChange} className="currency-select">
            {currencies.map((currency) => (
              <option key={currency} value={currency}>
                {currency}
              </option>
            ))}
          </select>
        </div>

        <span className="equals">=</span>

        <div className="output-group">
          <input
            type="text"
            value={convertedAmount || "0"}  
            disabled
            className="amount-input"
          />
          <select value={toCurrency} onChange={handleToCurrencyChange} className="currency-select">
            {currencies.map((currency) => (
              <option key={currency} value={currency}>
                {currency}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="rate-info">
        {convertedAmount && (
          <p>
            1 {fromCurrency} = {(convertedAmount / amount).toFixed(2)} {toCurrency} 
          </p>
        )}
      </div>
    </div>
  );
};

export default App;
