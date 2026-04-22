"use client";

import { Translatable } from '@/components/translatable';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useEffect, useState } from 'react';

const fromCurrencies = ['USD', 'EUR', 'GBP', 'AUD', 'CAD', 'JPY', 'CNY'];
const TO_CURRENCY = 'ZAR';

export default function CurrencyConverterPage() {
  const [amount, setAmount] = useState(1);
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [rates, setRates] = useState<any>({});
  const [result, setResult] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function fetchRates() {
      if (!fromCurrency) return;
      setIsLoading(true);
      try {
        const response = await fetch(`https://api.frankfurter.app/latest?from=${fromCurrency}&to=${TO_CURRENCY}`);
        const data = await response.json();
        setRates(data.rates);
      } catch (error) {
        console.error("Failed to fetch exchange rates", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchRates();
  }, [fromCurrency]);

  useEffect(() => {
    if (rates && rates[TO_CURRENCY]) {
      const rate = rates[TO_CURRENCY];
      setResult(amount * rate);
    }
  }, [amount, fromCurrency, rates]);

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-xl mx-auto">
        <h1 className="text-4xl font-bold font-headline text-center text-primary">
          <Translatable text="Currency Converter" />
        </h1>
        <p className="mt-4 text-center text-muted-foreground">
          <Translatable text="Convert any major currency to South African Rand (ZAR)." />
        </p>
        <div className="mt-8">
            <Card className="text-foreground">
                <CardHeader>
                    <CardTitle className="text-left"><Translatable text="Convert to ZAR" /></CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                        <div className="space-y-2 text-left">
                            <Label htmlFor="amount"><Translatable text="Amount" /></Label>
                            <Input id="amount" type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} min="0" />
                        </div>
                        <div className="space-y-2 text-left">
                            <Label><Translatable text="From" /></Label>
                            <Select value={fromCurrency} onValueChange={setFromCurrency}>
                                <SelectTrigger>
                                    <SelectValue placeholder="From currency" />
                                </SelectTrigger>
                                <SelectContent>
                                    {fromCurrencies.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {isLoading && <p className="text-center text-muted-foreground mt-8"><Translatable text="Loading rates..." /></p>}
                    
                    {!isLoading && result !== null && (
                        <div className="text-center p-6 bg-secondary rounded-lg mt-8">
                            <p className="text-muted-foreground"><Translatable text="Result" /></p>
                            <p className="text-4xl font-bold text-primary">
                                {result.toFixed(2)} {TO_CURRENCY}
                            </p>
                            <p className="text-sm text-muted-foreground mt-2">
                               1 {fromCurrency} = {rates[TO_CURRENCY]?.toFixed(4)} {TO_CURRENCY}
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
