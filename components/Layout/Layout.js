import Footer from '@/components/Footer';
import Header from '@/components/Header';

export default function Layout({ children }) {
  return <div className="flex flex-col flex-1 min-h-screen">
    <Header />
    {children}
    <Footer />
  </div>
}
