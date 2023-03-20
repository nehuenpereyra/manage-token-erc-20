import autoBind from 'auto-bind';
import { ethers, BigNumber } from 'ethers';
import { StateDapp, Token } from '../types';
import { reactive } from 'vue';

import tokenArtifact from '../contracts/token.json';
import smartContractFile from '../contracts/smart-contract.json';

const smartContract =  JSON.parse(JSON.stringify(smartContractFile))

const ERROR_CODE_TX_REJECTED_BY_USER = 4001;

const toWei = (num: number) => ethers.utils.parseEther(num.toString())
const fromWei = (num: string) => ethers.utils.formatEther(num)

export class EtherController {
  private decimals = 18;
  private price = 0.2;
  public state: StateDapp;
  private token: Token | undefined;
  private pollDataInterval: ReturnType<typeof setInterval> | undefined;
  private provider: any;

  constructor() {
    autoBind(this)
    this.state = reactive(this.initialState());
  }

  setInitialState() {
    this.state = reactive(this.initialState());
  }

  disabledEthereum() {
    return window.ethereum === undefined;
  }

  isSelectedAddress() {
    return this.state.selectedAddress !== undefined;
  }

  isLoading() {
    return !this.state.tokenData || !this.state.balance;
  }

  async connectWallet() {

    if (window.ethereum.request) {
      const [selectedAddress] = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });
      

      if (!this.checkNetwork()) return;

      this.initialize(selectedAddress);

      window.ethereum.on('accountsChanged', ([newAddress]) => {
        this.stopPollingData();

        if (newAddress === undefined) return this.setInitialState();

        this.initialize(newAddress);
      });

      window.ethereum.on('chainChanged', () => {
        this.stopPollingData();
        this.setInitialState();
      });
    }
  }

  private initialState(): StateDapp {
    return {
      tokenData: undefined,
      selectedAddress: undefined,
      balance: undefined,
      txBeingSent: undefined,
      transactionError: undefined,
      networkError: undefined,
      balanceEthers: undefined,
      balanceTokensSC: undefined
    };
  }

  private async initialize(userAddress: string) {

    this.state.selectedAddress = userAddress;
    this.provider = new ethers.providers.Web3Provider(window.ethereum);
    await this.initializeContract();
    await this.getTokenData();
    await this.updateBalanceEthers();
    await this.updateBalanceTokensSC();
    await this.updateBalance();
    this.startPollingData();
    this.setLogo();

  }

  private async initializeContract() {
    const chainId = window.ethereum.networkVersion
    this.token = new ethers.Contract(
      smartContract[chainId],
      tokenArtifact.abi,
      this.provider.getSigner(0)
    );
  }

  private startPollingData() {
    this.pollDataInterval = setInterval(() => {
      this.updateBalance()
      this.updateBalanceEthers()
      this.updateBalanceTokensSC()
    }, 5000);
  }

  stopPollingData() {
    clearInterval(this.pollDataInterval);
    this.pollDataInterval = undefined;
  }

  private async getTokenData() {
    if (this.token && this.token.name && this.token.symbol) 
      try {
        const name = await this.token.name();
        const symbol = await this.token.symbol();

        this.state.tokenData = { name, symbol };
      } catch (error) {
        console.log('Error', error)
      }
  }

  private async updateBalance() {
    if (this.token && this.token.balanceOf && this.state.selectedAddress){
      const balance = await this.token.balanceOf(
        this.state.selectedAddress
      )
      this.state.balance = parseFloat(fromWei(balance))
    }
  }

  private updateBalanceEthers() {
    this.provider.getBalance(this.state.selectedAddress).then(
      (balance: BigNumber) =>{
        this.state.balanceEthers =  parseFloat(fromWei(balance.toString()))
      }) 
  }

  private async updateBalanceTokensSC() {
    if (this.token && this.token.balanceTokensSC && this.state.selectedAddress){
      const balance = await this.token.balanceTokensSC()
      this.state.balanceTokensSC = parseFloat(fromWei(balance))
    }
  }

  async transferTokens(to: string, amount: number) {
    try {
      this.dismissTransactionError();

      if (this.token && this.token.transfer) {
        const total = toWei(amount)
        const tx = await this.token.transfer(to, total);
        this.state.txBeingSent = tx.hash;
        const receipt = await tx.wait();
        if (receipt.status === 0) throw new Error('Transaction failed');
        await this.updateBalance();
      }
    } catch (error: any) {
      if (error.code === ERROR_CODE_TX_REJECTED_BY_USER) return false;
      this.state.transactionError = error;
    } finally {
      this.state.txBeingSent = undefined;
    }
  }

  async buyTokens(amount: number) {
    try {
      this.dismissTransactionError();

      if (this.token && this.token.buyTokens) {
        const totalPriceInWei = toWei(amount);
        const tx = await this.token.buyTokens(toWei(amount/this.price).toString(), {value:totalPriceInWei});
        this.state.txBeingSent = tx.hash;
        const receipt = await tx.wait();
        if (receipt.status === 0) throw new Error('Transaction failed');
        await this.updateBalance();
      }
    } catch (error: any) {
      if (error.code === ERROR_CODE_TX_REJECTED_BY_USER) return false;
      this.state.transactionError = error;
    } finally {
      this.state.txBeingSent = undefined;
    }
  }

  async repayTokens(amount: number) {
    try {
      this.dismissTransactionError();

      if (this.token && this.token.repayTokens) {
        const tx = await this.token.repayTokens(toWei(amount).toString());
        this.state.txBeingSent = tx.hash;
        const receipt = await tx.wait();
        if (receipt.status === 0) throw new Error('Transaction failed');
        await this.updateBalance();
      }
    } catch (error: any) {
      if (error.code === ERROR_CODE_TX_REJECTED_BY_USER) return false;
      this.state.transactionError = error;
    } finally {
      this.state.txBeingSent = undefined;
    }
  }

  public dismissTransactionError() {
    this.state.transactionError = undefined;
  }

  dismissNetworkError() {
    this.state.networkError = undefined;
  }

  getRpcErrorMessage(error: any) {
    if(error){
      if (error.data) return error.data.message;
      return error.message;
    }
    return ''
  }

  private checkNetwork() {
    const chainId = `${window.ethereum.networkVersion}`
    if (smartContract[chainId]) return true;
    
    const chainIds = Object.keys(smartContract)
    
    this.state.networkError = `Please connect Metamask to chainId: ${chainIds}`;
    return false;
  }

  private async setLogo (){
    if(this.state.balance === 0){
      const ethereum = window.ethereum
      try {
        if(ethereum && ethereum.request)
          await ethereum.request({
            method: 'wallet_watchAsset',
            params: {
              type: 'ERC20',
              chainId: '1337',
              options: {
                address: smartContract[ethereum.networkVersion as unknown as number],
                symbol: this.state.tokenData?.symbol,
                decimals: this.decimals,
                image: 'https://cryptologos.cc/logos/multi-collateral-dai-dai-logo.png?v=024' 
              }
            }
          });
      } catch (error) {
        // console.log(error);
      }
    }
  }
}
