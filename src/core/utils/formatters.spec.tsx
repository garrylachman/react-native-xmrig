import { formatHashrate } from "./formatters";

describe('@formatters: formatHashrate', () => {


    it('H', () => {
        expect(formatHashrate("1", 2)).toEqual([1.00, "H"]);
        expect(formatHashrate("10", 2)).toEqual([10.00, "H"]);
        expect(formatHashrate("100", 2)).toEqual([100.00, "H"]);
        expect(formatHashrate("100.1", 1)).toEqual([100.1, "H"]);
    });

    it('kH', () => {
        expect(formatHashrate("1000", 2)).toEqual([1.00, "kH"]);
        expect(formatHashrate("10000", 2)).toEqual([10.00, "kH"]);
        expect(formatHashrate("100000", 2)).toEqual([100.00, "kH"]);
    });

    it('MH', () => {
        expect(formatHashrate("1000000", 2)).toEqual([1.00, "MH"]);
        expect(formatHashrate("10000000", 2)).toEqual([10.00, "MH"]);
        expect(formatHashrate("100000000", 2)).toEqual([100.00, "MH"]);
    });

    it('GH', () => {
        expect(formatHashrate("1000000000", 2)).toEqual([1.00, "GH"]);
        expect(formatHashrate("10000000000", 2)).toEqual([10.00, "GH"]);
        expect(formatHashrate("100000000000", 2)).toEqual([100.00, "GH"]);
    });

    it('invalid', () => {
        expect(formatHashrate("a", 2)).toEqual([0, ""]);
        expect(formatHashrate(undefined, 2)).toEqual([0, ""]);
        expect(formatHashrate(null, 2)).toEqual([0, ""]);
    });

});