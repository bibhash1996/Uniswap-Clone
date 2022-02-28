import '../styles/globals.css'
import { TransactionProvider } from '../context/transactionContext'

function MyApp({ Component, pageProps }: any) {
  return (
    <TransactionProvider>
      <Component {...pageProps} />
    </TransactionProvider>
  )
}

export default MyApp
