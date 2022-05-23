import { ec, KeyPair, Signer } from 'starknet'
export interface IWallet<W> {
  wallet: W
  sign: (message: any) => any
  getPublicKey: () => Promise<string>
}

export interface IStarknetWallet extends IWallet<Signer> {
  getAccountPublicKey: () => string
}

export const makeWallet = (rawPk?: string, account?: string) => {
  return Wallet.create(rawPk, account)
}

class Wallet implements IStarknetWallet {
  wallet: Signer
  account: string

  private constructor(keypair: KeyPair, account?: string) {
    this.wallet = new Signer(keypair)
    this.account = account
  }

  static create = (pKey: string, account?: string) => {
    const keyPair = ec.getKeyPair(pKey)
    return new Wallet(keyPair, account)
  }

  sign = () => {}

<<<<<<< HEAD
  getPublicKey = async () => await this.wallet.getPubKey()
  getAccountPublicKey = () => this.account
=======
  getPublicKey = async () => {
    console.log('Getting public key')
    console.log(this.wallet)
    return await this.wallet.getPubKey()
  }
>>>>>>> 6e8176b (working branch changes)
}
