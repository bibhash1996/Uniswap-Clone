import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

type Context = {
  connectWallet: () => void
  currentAccount: string
  formData: { addressTo: string; amount: string }
  setFormData: (param: { addressTo: string; amount: string }) => void
  handleChange: (e: any, name: string) => void
  isLoading: boolean
}

export const TransactionContext = React.createContext<Context>({
  connectWallet: () => {},
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

  return (
    <TransactionContext.Provider
      value={{
        connectWallet,
        currentAccount,
        formData,
        setFormData,
        handleChange,
        isLoading,
      }}
    >
      {props.children}
    </TransactionContext.Provider>
  )
}
