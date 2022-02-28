import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { ethers } from 'ethers'
import { contractABI, contractAddress } from '../lib/constants'

type Context = {
  connectWallet: () => void
  sendTransaction: () => void
  currentAccount: string
  formData: { addressTo: string; amount: string }
  setFormData: (param: { addressTo: string; amount: string }) => void
  handleChange: (e: any, name: string) => void
  isLoading: boolean
}

export const TransactionContext = React.createContext<Context>({
  connectWallet: () => {},
  sendTransaction: () => {},
  currentAccount: '',
  formData: { addressTo: '', amount: '' },
  handleChange: () => {},
  isLoading: false,
  setFormData: (param: { addressTo: string; amount: string }) => {},
})

let eth: any

if (typeof window !== 'undefined') {
  eth = (window as any).ethereum
}

export const TransactionProvider = (props: { children: any }) => {
  const [currentAccount, setCurrentAccount] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const [formData, setFormData] = useState({
    addressTo: '',
    amount: '',
  })

  /**
   * Trigger loading modal
   */
  useEffect(() => {
    if (isLoading) {
      router.push(`/?loading=${currentAccount}`)
    } else {
      router.push(`/`)
    }
  }, [isLoading])

  const handleChange = (e: any, name: string) => {
    setFormData((prevState) => ({ ...prevState, [name]: e.target.value }))
  }

  /**
   * Checks if MetaMask is installed and an account is connected
   * @param {*} metamask Injected MetaMask code from the browser
   * @returns
   */
  const checkIfWalletIsConnected = async (metamask = eth) => {
    try {
      if (!metamask) return alert('Please install metamask ')

      const accounts = await (window as any).ethereum.request({
        method: 'eth_accounts',
      })

      if (accounts.length) {
        setCurrentAccount(accounts[0])
      }
    } catch (error) {
      console.error(error)
      throw new Error('No ethereum object.')
    }
  }

  /**
   * Prompts user to connect their MetaMask wallet
   * @param {*} metamask Injected MetaMask code from the browser
   */
  const connectWallet = async (metamask: any = eth) => {
    console.log('Metamask : ', eth)
    try {
      if (!metamask) return alert('Please install metamask ')

      const accounts = await (window as any).ethereum.request({
        method: 'eth_requestAccounts',
      })
      setCurrentAccount(accounts[0])
    } catch (error) {
      console.error(error)
      throw new Error('No ethereum object.')
    }
  }

  useEffect(() => {
    checkIfWalletIsConnected()
  }, [])

  const getEthereumContract = () => {
    const provider = new ethers.providers.Web3Provider((window as any).ethereum)
    const signer = provider.getSigner()
    const transactionContract = new ethers.Contract(
      contractAddress,
      contractABI,
      signer
    )

    return transactionContract
  }

  const sendTransaction = async () => {
    if (!(window as any).ethereum) alert('Install metamask')
    try {
      const { addressTo, amount } = formData
      const transactionContract = getEthereumContract()

      const parsedAmount = ethers.utils.parseEther(amount)

      await (window as any).ethereum.request({
        method: 'eth_sendTransaction',
        params: [
          {
            from: currentAccount,
            to: addressTo,
            // gas: '0x7EF40', // 520000 Gwei
            value: parsedAmount._hex,
          },
        ],
      })
      const transactionHash = await transactionContract.publishTransaction(
        addressTo,
        parsedAmount,
        `Transferring ETH ${parsedAmount} to ${addressTo}`,
        'TRANSFER'
      )
      setIsLoading(true)
      await transactionHash.wait()
      // await saveTransaction(
      //   transactionHash.hash,
      //   amount,
      //   connectedAccount,
      //   addressTo
      // )

      setIsLoading(false)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <TransactionContext.Provider
      value={{
        connectWallet,
        currentAccount,
        formData,
        setFormData,
        handleChange,
        isLoading,
        sendTransaction,
      }}
    >
      {props.children}
    </TransactionContext.Provider>
  )
}
