import React from 'react';

export const useHashrateHistory = (initial:number[]) => {
    const [history, setHistory] = React.useState<number[]>(initial);
    const add = React.useCallback((value:number) => setHistory(h => [...h, value].slice(-50)), []);
    return {history, add}
}