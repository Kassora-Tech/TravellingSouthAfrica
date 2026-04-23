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
  const [rate, setRate] = useState<number | null>(null);
  const [result, setResult] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRate() {
      if (!fromCurrency) return;
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await fetch(`https://www.floatrates.com/daily/${fromCurrency.toLowerCase()}.json`);
        if (!response.ok) {
          throw new Error('Failed to fetch exchange rates.');
        }
        const data = await response.json();
        if (data.zar) {
          setRate(data.zar.rate);
        } else {
          throw new Error(`Could not find ZAR rate for ${fromCurrency}.`);
        }
      } catch (error: any) {
        console.error("Failed to fetch exchange rates", error);
        setError(error.message || "An unexpected error occurred.");
      } finally {
        setIsLoading(false);
      }
    }
    fetchRate();
  }, [fromCurrency]);

  useEffect(() => {
    if (rate !== null) {
      setResult(amount * rate);
    } else {
      setResult(null);
    }
  }, [amount, rate]);

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
                    
                    {error && <p className="text-center text-destructive mt-8">{error}</p>}

                    {!isLoading && !error && result !== null && rate !== null && (
                        <div className="text-center p-6 bg-secondary rounded-lg mt-8">
                            <p className="text-muted-foreground"><Translatable text="Result" /></p>
                            <p className="text-4xl font-bold text-primary">
                                {result.toFixed(2)} {TO_CURRENCY}
                            </p>
                            <p className="text-sm text-muted-foreground mt-2">
                               1 {fromCurrency} = {rate.toFixed(4)} {TO_CURRENCY}
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
