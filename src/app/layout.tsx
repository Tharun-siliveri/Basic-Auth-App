import './global.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className='box-border'>
      <body className='flex flex-col m-0 min-h-screen'>
        <Header />
        <div className="flex flex-grow justify-center items-center">
          {children}
        </div>
        <Footer />
      </body>
    </html>
  );
}
