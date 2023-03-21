import { ExternalProvider } from '@ethersproject/providers';
import { BaseContract, BigNumber } from 'ethers';

interface CustomExternalProvider extends ExternalProvider{ 
    on: (e: string, l:(p:Array<string|undefined>) => void) => void,
    networkVersion: string,
    request?: (request: { method: string, params?: any }) => Promise<any>
}

declare global {
    interface Window {
        ethereum: CustomExternalProvider
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
    networkError: string | undefined,
    balanceEthers: number | undefined,
    balanceTokensSC: number | undefined,
    isOwner: boolean | undefined,
    balanceEthersSC: number | undefined,
    totalSupply: number | undefined
}

type value = {value: BigNumber}
export interface Token extends BaseContract{
    name?: () => string,
    symbol?: () => string,
    owner?: () => string,
    totalSupply?: () => string,
    balanceEthersSC?: () => string,
    balanceOf?: (addr: string) => string,
    transfer?: (to: string, amount: BigNumber) => {
        hash: string,
        wait: () => {status: number}
    },
    balanceTokensSC?:() => string ,
    buyTokens?: (amount: string, value: value) => {
        hash: string,
        wait: () => {status: number}
    },
    repayTokens?: (amount: string) => {
        hash: string,
        wait: () => {status: number}
    },
    mint?: (amount: string) => {
        hash: string,
        wait: () => {status: number}
    }, 
    burn?: (amount: string) => {
        hash: string,
        wait: () => {status: number}
    }, 
}

