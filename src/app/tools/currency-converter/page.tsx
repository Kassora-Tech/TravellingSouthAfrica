"use client";

import { Translatable } from '@/components/translatable';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowRightLeft } from 'lucide-react';
import { useEffect, useState } from 'react';

const supportedCurrencies = ['ZAR', 'USD', 'EUR', 'GBP', 'AUD', 'CAD', 'JPY', 'CNY'];

export default function CurrencyConverterPage() {
  const [amount, setAmount] = useState(1);
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('ZAR');
  const [rates, setRates] = useState<any>({});
  const [result, setResult] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function fetchRates() {
      if (!fromCurrency) return;
      setIsLoading(true);
      try {
        const response = await fetch(`https://api.exchangerate.host/latest?base=${fromCurrency}`);
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
    if (rates && rates[toCurrency]) {
      const rate = rates[toCurrency];
      setResult(amount * rate);
    }
  }, [amount, fromCurrency, toCurrency, rates]);
  
  const handleSwap = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  }

  return (
    <section 
        className="relative flex items-center justify-center min-h-[calc(100vh-80px)] py-16 bg-cover bg-center text-white" 
        style={{ backgroundImage: "url('https://i.ibb.co/xSfW78nr/foreign-exchange-1024x684.webp')" }}
    >
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative container mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold font-headline text-white md:text-5xl">
                <Translatable text="Currency Converter" />
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-neutral-200">
                <Translatable text="Get up-to-date exchange rates for your travel planning." />
            </p>
            <div className="max-w-2xl mx-auto mt-8">
                <Card className="text-foreground">
                    <CardHeader>
                        <CardTitle className="text-left"><Translatable text="Conversion Tool" /></CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                            <div className="space-y-2 text-left">
                                <Label htmlFor="amount"><Translatable text="Amount" /></Label>
                                <Input id="amount" type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} />
                            </div>
                            <div className="space-y-2 text-left">
                                <Label><Translatable text="From" /></Label>
                                <Select value={fromCurrency} onValueChange={setFromCurrency}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="From currency" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {supportedCurrencies.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                             <div className="space-y-2 text-left">
                                <Label><Translatable text="To" /></Label>
                                <Select value={toCurrency} onValueChange={setToCurrency}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="To currency" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {supportedCurrencies.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="flex justify-center my-4">
                            <Button variant="ghost" size="icon" onClick={handleSwap}>
                                <ArrowRightLeft />
                            </Button>
                        </div>

                        {isLoading && <p className="text-center text-muted-foreground"><Translatable text="Loading rates..." /></p>}
                        
                        {!isLoading && result !== null && (
                            <div className="text-center p-6 bg-secondary rounded-lg">
                                <p className="text-muted-foreground"><Translatable text="Result" /></p>
                                <p className="text-3xl font-bold text-primary">
                                    {result.toFixed(2)} {toCurrency}
                                </p>
                                <p className="text-sm text-muted-foreground mt-2">
                                   1 {fromCurrency} = {rates[toCurrency]?.toFixed(4)} {toCurrency}
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    </section>
  );
}
