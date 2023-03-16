import { ExternalProvider } from '@ethersproject/providers';
import { BaseContract, BigNumber } from 'ethers';

interface CustomExternalProvider extends ExternalProvider{ 
    on: (e: string, l:(p:Array<string|undefined>) => void) => void,
    networkVersion: string,
    request?: (request: { method: string, params?: any }) => Promise<any>
}

declare global {
    interface Window {
        ethereum?: CustomExternalProvider
    }
}

interface TokenData  {
    name: string,
    symbol: string
}

interface TransactionError  {
    data: {
        message:string
    }
}

export interface Ref<T> {
    value: T
}

export interface StateDapp  {
    tokenData: TokenData | undefined,
    selectedAddress: string | undefined,
    balance: number | undefined,
    txBeingSent: string | undefined,
    transactionError: TransactionError | undefined,
    networkError: string | undefined
}

export interface Token extends BaseContract{
    name?: () => string,
    symbol?: () => string,
    balanceOf?: (addr: string) => string,
    transfer?: (to: string, amount: BigNumber) => {
        hash: string,
        wait: () => {status: number}
    }
}

