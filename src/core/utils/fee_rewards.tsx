export const rewardCheckpoints = [
    30,
    60,
    120,
    180,
    240,
    360,
    400,
    500,
    800,
    1200,
    2400,
    4800,
    9600,
    19200,
    38400,
    76800
];


export const getCheckpointByMin = (min:number) => rewardCheckpoints.reverse().filter(v => min >= v).length;