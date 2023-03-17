import { ethers } from 'ethers';
import autoBind from 'auto-bind'
import { StateDapp, Token } from '../types';
import { reactive } from 'vue'
/* Importamos TokenArtifact y contractAddress aquí, 
 ya que los usaremos con ethers.
 */
import TokenArtifact from '../contracts/Token.json';
import contractAddress from '../contracts/contract-address.json';

/* Esta es la identificación de la red Hardhat que establecemos en
 nuestro hardhat.config.js. Aquí hay una lista de ID de red 
 https://docs.metamask.io/guide/ethereum-provider.html#properties
 para usar al implementar otras redes.
*/
const HARDHAT_NETWORK_ID = '31337'; // ganache 5777 | hardhat 1337

// Este es un código de error que indica que el usuario canceló una transacción.
const ERROR_CODE_TX_REJECTED_BY_USER = 4001;

// Funciones de utilidad
const toWei = (num: number) => ethers.utils.parseEther(num.toString())
const fromWei = (num: string) => ethers.utils.formatEther(num)

export class UseEthers {
  private decimals = 18;
  public state: StateDapp;
  private token: Token | undefined;
  private pollDataInterval: ReturnType<typeof setInterval> | undefined;

  constructor() {
    autoBind(this)
    this.state = reactive(this.initialState());
  }

  // Establece el estado inicial.
  setInitialState() {
    this.state = reactive(this.initialState());
  }

  /* Las billeteras de Ethereum inyectan en windows un object Ethereum.
  Si no se ha inyectado, le indicaremos al usuario que instale MetaMask. 
  */
  disabledEthereum() {
    return window.ethereum === undefined;
  }

  isSelectedAddress() {
    return this.state.selectedAddress !== undefined;
  }

  /* Si los datos del token o el saldo del usuario aún no se han cargado,
  mostramos un componente de carga.
  */
  isLoading() {
    return !this.state.tokenData || !this.state.balance;
  }

  async connectWallet() {
    // Este método se ejecuta cuando el usuario hace clic en la conexión. Conecta el
    // DAPP a la billetera del usuario y la inicializa.

    // Para conectarse a la billetera del usuario, tenemos que ejecutar este método.
    // Devuelve una promesa que se resolverá a la dirección del usuario.
    if (window.ethereum && window.ethereum.request) {
      const [selectedAddress] = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });

      // Una vez que tenemos la dirección, podemos inicializar la aplicación.

      // Primero revisamos la red
      if (!this.checkNetwork()) return;

      this.initialize(selectedAddress);

      // Lo reinicializamos cada vez que el usuario cambia su cuenta.
      window.ethereum.on('accountsChanged', ([newAddress]) => {
        this.stopPollingData();
        // El evento `Accountschanged` se puede activar con un Newaddress indefinido.
        // Esto sucede cuando el usuario elimina el DAPP del "Conectado
        // a lista de sitios permitidos el acceso a sus direcciones "(Metamask> Configuración> Conexiones)
        // Para evitar errores, restablecemos el estado DAPP
        if (newAddress === undefined) return this.setInitialState();

        this.initialize(newAddress);
      });

      // Restablecemos el estado DAPP si la red se cambia
      window.ethereum.on('chainChanged', () => {
        this.stopPollingData();
        this.setInitialState();
      });
    }
  }

  private initialState(): StateDapp {
    return {
      // La información del token (es decir, el nombre y símbolo).
      tokenData: undefined,
      // La dirección y el equilibrio del usuario.
      selectedAddress: undefined,
      balance: undefined,
      /* La identificación sobre las transacciones que se envían y 
            cualquier posible error con ellas.
            */
      txBeingSent: undefined,
      transactionError: undefined,
      networkError: undefined
    };
  }

  private async initialize(userAddress: string) {
    // Este método inicializa el DAPP.

    //Primero almacenamos la dirección del usuario en el estado del componente.
    this.state.selectedAddress = userAddress;

    /* Luego, inicializamos éteres, obtenemos los datos del token y comenzamos a sondear
    para el saldo del usuario.
    Obtener los datos del token y el equilibrio del usuario son específicos para este
    proyecto.
    */

    await this.initializeEthers();
    await this.getTokenData();
    await this.updateBalance();
    this.startPollingData();
    this.setLogo();
  }

  private async initializeEthers() {
    let provider;
    // Primero inicializamos ethers creando un proveedor usando window.
    if (window.ethereum)
      provider = new ethers.providers.Web3Provider(window.ethereum);

    //console.log('provider', await provider?.getCode(contractAddress.Token))
    
    /* Luego, inicializamos el contrato usando ese proveedor y el token artefacto. 
    Puedes hacer lo mismo con tus contratos.
    */
    /* tslint:disable-next-line */
    this.token = new ethers.Contract(
      contractAddress.Token,
      TokenArtifact.abi,
      provider?.getSigner(0)
    );
  }

  private startPollingData() {
    this.pollDataInterval = setInterval(() => this.updateBalance(), 1000);
  }

  stopPollingData() {
    clearInterval(this.pollDataInterval);
    this.pollDataInterval = undefined;
  }

  /* Los siguientes dos métodos que acaban de leer del contrato y almacenan los resultados
    en el estado del componente.
*/
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

  /* Este método envía una transacción Ethereum para transferir tokens.
  Si bien esta acción es específica para esta aplicación, ilustra cómo enviar una transacción.
  */
  async transferTokens(to: string, amount: number) {
    /* Enviar una transacción es una operación compleja:
        - el usuario puede rechazarlo
        - puede fallar antes de llegar a la red Ethereum (es decir, si el usuario
        no tiene ETH para pagar el gas del TX)
        - Tiene que extraerse, por lo que no se confirma de inmediato.
        Tenga en cuenta que algunas redes de prueba, como Hardhat Network, hacen la mía
        Transacciones de inmediato, pero su DAPP debe estar preparado para
        otras redes.
        - Puede fallar una vez extraído.
    
        Este método maneja todas esas cosas, así que sigue leyendo para aprender a
        hazlo.
    */
    try {
      // Si falla una transacción, guardamos ese error en el estado del componente.
      // Solo guardamos uno de esos errores, por lo que antes de enviar una segunda transacción,
      // Limpialo.
      this.dismissTransactionError();

      // Enviamos la transacción y guardamos su hash en el estado de DAPP. Este
      // La forma en que podemos indicar que estamos esperando que se extraiga.
      if (this.token && this.token.transfer) {
        const total = toWei(amount)
        const tx = await this.token.transfer(to, total);
        this.state.txBeingSent = tx.hash;
        
        // Usamos .wait() para esperar a que se extraiga la transacción. Este método
        // Devuelve el recibo de la transacción.
        const receipt = await tx.wait();

        // El recibo contiene un indicador de estado, que es 0 para indicar un error.
        // No podemos saber el error exacto que hizo que la transacción fallara cuando
        // fue minado, así que lanzamos este genérico.
        if (receipt.status === 0) throw new Error('Transaction failed');

        // Si llegamos aquí, la transacción fue exitosa, por lo que es posible que desee
        // Actualiza tu estado. Aquí, actualizamos el saldo del usuario.
        await this.updateBalance();
      }
    } catch (error: any) {
      // Verificamos el código de error para ver si se produjo este error porque el
      // El usuario rechazó un TX. Si ese es el caso, no hacemos nada.
      if (error.code === ERROR_CODE_TX_REJECTED_BY_USER) return false;

      // Otros errores se registran y almacenan en el estado de DAPP. Esto se usa para
      // Muéstrales al usuario y para la depuración.
      this.state.transactionError = error;
    } finally {
      // Cuando termina el try/catch, ya no estamos enviando un TX, así que finalizamos
      // esta parte del estado.
      this.state.txBeingSent = undefined;
    }
  }

  // Este método solo borra parte del estado.
  public dismissTransactionError() {
    this.state.transactionError = undefined;
  }

  // Este método solo borra parte del estado.
  dismissNetworkError() {
    this.state.networkError = undefined;
  }

  // Este es un método de utilidad que convierte un error RPC en un mensaje legible por humanos.
  getRpcErrorMessage(error: any) {
    if(error){
      if (error.data) return error.data.message;
      return error.message;
    }
    return ''
  }

  // Este método verifica si la red seleccionada de metamask es localhost: 8545.
  private checkNetwork() {
    if (window.ethereum)
      if (window.ethereum.networkVersion === HARDHAT_NETWORK_ID) return true;

    this.state.networkError = 'Please connect Metamask to Localhost:8545';

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
                address: contractAddress.Token,
                symbol: this.state.tokenData?.symbol,
                decimals: this.decimals,
                image: 'https://cryptologos.cc/logos/multi-collateral-dai-dai-logo.png?v=024' 
              }
            }
          });
      } catch (error) {
        console.log(error);
      }
    }
  }
}
