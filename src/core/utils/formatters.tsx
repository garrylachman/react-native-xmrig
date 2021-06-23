export const formatHashrate = (hr:number|string|null|undefined, fixed: number = 2):[number, string] => {
    if (!hr || isNaN(hr as any)) {
        return [0, ""];
    }
    const fHr = parseFloat(`${hr}`);
    if (hr >= 1000000000000)    {
        return [parseFloat((fHr/1000000000000).toFixed(fixed)), "TH"]
    }
    if (hr >= 1000000000)    {
        return [parseFloat((fHr/1000000000).toFixed(fixed)), "GH"]
    }
    if (hr >= 1000000)    {
        return [parseFloat((fHr/1000000).toFixed(fixed)), "MH"]
    }
    if (hr >= 1000)    {
        return [parseFloat((fHr/1000).toFixed(fixed)), "kH"]
    }
    return [parseFloat(fHr.toFixed(fixed)), "H"];
}