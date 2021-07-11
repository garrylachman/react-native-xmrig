import {
    validateWalletAddress
} from './validators'


describe('@validators: validateWalletAddress', () => {


    it('valid address', () => {
        expect(validateWalletAddress("46gPyHjLPPM8HaayVyvCDcF2A8sq8b476VrwKMukrKg21obm1AKEwzoN3u4ooc55FKdNeF5B8vcs4ixbeCyuydr2A2sdsQi")).toEqual(true);
    });

    it('invalid address', () => {
        expect(validateWalletAddress("123")).toEqual(false);
        expect(validateWalletAddress()).toEqual(false);
        expect(validateWalletAddress(undefined)).toEqual(false);
    });

});