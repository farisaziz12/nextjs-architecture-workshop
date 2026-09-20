import Head from 'next/head';
import ProductList from '../components/ProductList';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Head>
        <title>ResilioStore - Resilient E-commerce</title>
        <meta name="description" content="A resilient e-commerce application using Next.js" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4">ResilioStore</h1>
            <p className="text-xl text-blue-100">
              Explore our resilient product catalog designed to provide a smooth shopping experience even under adverse conditions.
            </p>
          </div>
        </div>
      </div>

      <main className="flex-1 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Featured Products</h2>
            <div className="h-1 w-20 bg-blue-600 rounded"></div>
          </div>
          
          <ProductList />
        </div>
      </main>

      <footer className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <p className="text-gray-500 text-center">Next.js Resilience Workshop - Circuit Breaker Pattern</p>
        </div>
      </footer>
    </div>
  );
}