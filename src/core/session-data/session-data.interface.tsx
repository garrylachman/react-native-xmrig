export enum StartMode {
    START,
    REBANCH,
    STOP
}

export interface IXMRigLogEvent {
    log: string[];
}

export interface IMinerLog {
    ts?: string;
    module?: string;
    message: string;
}