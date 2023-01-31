export class Web3AppResponse {
    status: string;

    error?: string;

    transfers : TransferData[]
}

export class TransferData {

    from: string;
    to: string;
    value: string;
    blockTimestamp: number;
}
