import { useState, useEffect } from 'react';
import { Product } from '../types';
import ProductCard from './ProductCard';
import ProductSkeleton from './ProductSkeleton';
// 🦆 Task 4: uncomment this import — you'll mount the component below.
// import CircuitStatusIndicator from './CircuitStatusIndicator';

export default function ProductList() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);

    // 🦆 Task 4: add state for the circuit status. Default it to 'closed'.
    // const [circuitStatus, setCircuitStatus] = useState<CircuitStatus>('closed');

    useEffect(() => {
        async function loadProducts() {
            try {
                setLoading(true);
                const response = await fetch('/api/products');

                if (!response.ok) {
                    throw new Error(`Error: ${response.status}`);
                }

                const data = await response.json();

                // 🦆 Task 4 (cont.): read the circuit status off the API response.
                // The API will start sending `data.circuitStatus` once Task 3 in `pages/api/products/index.ts` is done.
                // if (data.circuitStatus) {
                //   setCircuitStatus(data.circuitStatus);
                // }

                if (data.message) {
                    setMessage(data.message);
                }

                setProducts(data.products || []);
                setError(null);
            } catch (err) {
                console.error('Failed to load products:', err);
                setError(err instanceof Error ? err.message : 'An unknown error occurred');
            } finally {
                setLoading(false);
            }
        }

        loadProducts();
    }, []);

    if (loading) return <ProductSkeleton count={6} />;

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-md p-6 text-center">
                <p className="text-red-800 mb-4">Error loading products: {error}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                    Try Again
                </button>
            </div>
        );
    }

    // 💯 Stretch: also render a top-level banner when the circuit is open, separate
    // from the indicator — for example, a yellow strip explaining "showing cached data."

    return (
        <div>
            {/* 🦆 Task 5: mount <CircuitStatusIndicator status={circuitStatus} /> here.
                After this, the banner becomes red when the mock-API failure rate is high
                and the circuit trips, and goes green once it recovers. */}

            {message && (
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 rounded-md">
                    <p className="text-yellow-800">{message}</p>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.length > 0 ? (
                    products.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))
                ) : (
                    <p className="col-span-full text-center text-gray-500 py-10">No products found.</p>
                )}
            </div>
        </div>
    );
}