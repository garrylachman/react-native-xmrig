import {
    parseLogLine
} from './parsers';


describe('@parsers', () => {

    it('no module', () => {
        expect(
            parseLogLine("[2021-07-11 17:53:24] : Pool gulf.moneroocean.stream:10032 connected. Logging in...")
        ).toEqual(
            {message: '[2021-07-11 17:53:24] : Pool gulf.moneroocean.stream:10032 connected. Logging in...'}
        );
    });

    it('ts + module', () => {
        expect(
            parseLogLine("[2021-07-12 03:39:49.924]  net      new job from gulf.moneroocean.stream:10032 diff 5713 algo cn/r height 999048")
        ).toEqual(
            {
                ts: '03:39:49',
                module: 'net',
                message: 'new job from gulf.moneroocean.stream:10032 diff 5713 algo cn/r height 999048'
            }
        );
    });

});