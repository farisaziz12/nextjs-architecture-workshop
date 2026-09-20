import CircuitBreaker from 'opossum';
// import { CircuitStatus } from '../types';

interface CircuitBreakerOptions {
  name?: string;
  timeout?: number;
  errorThresholdPercentage?: number;
  resetTimeout?: number;
  [key: string]: any;
}

// Configure global settings for all circuit breakers
const defaultOptions = {
  timeout: 3000, // Time in ms before a request is considered failed
  errorThresholdPercentage: 50, // Percentage of failures before opening circuit
  resetTimeout: 10000, // Time in ms to wait before trying again
  rollingCountTimeout: 30000, // Time window for failure percentage calculation
  rollingCountBuckets: 10 // Number of buckets for tracking failures
};

// Create a circuit breaker for a function
export function breaker<T>(fn: (...args: any[]) => Promise<T>, options: CircuitBreakerOptions = {}) {
  const circuitOptions = { ...defaultOptions, ...options };
  const circuit = new CircuitBreaker(fn, circuitOptions);
  
  // Event logging
  circuit.on('open', () => {
    console.log(`Circuit ${options.name || 'unnamed'} is open`);
  });
  
  circuit.on('halfOpen', () => {
    console.log(`Circuit ${options.name || 'unnamed'} is half-open`);
  });
  
  circuit.on('close', () => {
    console.log(`Circuit ${options.name || 'unnamed'} is closed`);
  });
  
  circuit.on('fallback', () => {
    console.log(`Circuit ${options.name || 'unnamed'} fallback executed`);
  });
  
  return circuit;
}