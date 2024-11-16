'use client'
import { useState } from "react";
import SkeletonRow from "../components/skeletonRow";

type RatesData = {
    base_currency: string,
    rates: {
        [currencyCode:string]: number
    }
}

const availableCurrencies = ['EUR', 'GBP', 'VND', 'AUD'];

export default function CurrentRatesPage() {
    const [selectedCurrencies, setSelectedCurrencies] = useState<string[]>([]);
    const [ratesData, setRatesData] = useState<RatesData | null>(null);
    const [loadingRates, setLoadingRates] = useState<boolean>(false);
    const [errorRates, setErrorRates] = useState<string | null>(null);

    const handleCurrencyChange = (currency:string) => {
        setSelectedCurrencies((prevSelected) => {
            if (currency === 'all') {
                if (prevSelected.length === availableCurrencies.length) return [];
                else return availableCurrencies;
            }
            else {
                if (prevSelected.includes(currency)) {
                    return prevSelected.filter((cur) => cur !== currency);
                } else {
                    return [...prevSelected, currency];
                }
            }
            
        });
    };


    const handleFetchRates = async () => {
        if (selectedCurrencies.length === 0) return;
        
        setLoadingRates(true);
        setErrorRates(null);

        const currenciesParam = selectedCurrencies.join(",");
    
        try {
            const res = await fetch(`api/rates?currencies=${encodeURIComponent(currenciesParam)}`, {
                cache: 'no-store',
            });

            if (!res.ok){
                throw new Error('Failed to fetch rates');
            }

            const data: RatesData = await res.json();
            setRatesData(data);
            
        } catch (error) {
            console.error(error);
            setErrorRates('Failed to load exchange rates');
            setRatesData(null);
        } finally {
            setLoadingRates(false);
        }
    };

    return(
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Select Currencies</h1>
            <div className="mb-4">
                {availableCurrencies.map((currency) => (
                    <label key={currency} className="mr-4">
                        <input type="checkbox" value={currency} checked={selectedCurrencies.includes(currency)} onChange={() => handleCurrencyChange(currency)} className="mr-1"/>
                            {currency}
                    </label>
                ))}
                <label key='all' className="mr-4">
                <input type="checkbox" value='all' checked={selectedCurrencies.length === availableCurrencies.length} onChange={() => handleCurrencyChange('all')} className="mr-1"/>
                    Select All / Clear All
                </label>
                
            </div>
            
            <button 
                onClick={handleFetchRates} 
                className="px-4 py-2 bg-blue-500 text-white rounded-md"
                disabled={selectedCurrencies.length === 0 || loadingRates}
            >
                {loadingRates ? 'Fetching Rates ...' : 'Fetch Rates'}
            </button>

            {errorRates && <p className="text-red-500 mt-4">{errorRates}</p>}
            {(loadingRates || ratesData) && (
                <div className="mt-8">
                     <h2 className="text-xl font-bold mb-4">
                        {loadingRates
                        ? 'Loading Exchange Rates'
                        : `Current Exchange Rates (Base Currency: ${ratesData?.base_currency})`}
                    </h2>
                    <table className="min-w-full bg-white border border-gray-200">
                        <thead>
                            {loadingRates 
                                ? (<SkeletonRow isHeader={true}></SkeletonRow>)
                                : (
                                    <tr>
                                        <th className="border px-4 py-2">Currency</th>
                                        <th className="border px-4 py-2">Rates</th>
                                    </tr>
                                )}
                        </thead>
                        <tbody>
                            {loadingRates 
                                ? selectedCurrencies.map((currency) => (<SkeletonRow key={currency}/>)) 
                                : ratesData 
                                ? Object.entries(ratesData.rates).map(([currency, value]) => (
                                    <tr key={currency} className="text-center">
                                        <td className="border px-4 py-2">{currency}</td>
                                        <td className="border px-4 py-2">{value.toFixed(2)}</td>
                                    </tr>
                                )) 
                                : null
                            }
                        </tbody>
                    </table>
                </div>
            )}
            
        </div>
    );
}
