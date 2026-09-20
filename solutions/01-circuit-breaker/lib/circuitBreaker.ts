import CircuitBreaker from 'opossum';

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
  resetTimeout: 1000, // Time in ms to wait before trying again
  rollingCountTimeout: 30000, // Time window for failure percentage calculation
  rollingCountBuckets: 10 // Number of buckets for tracking failures
};

// Color codes for console logs
const colors = {
  red: '\x1b[1;31m',    // Bold Red
  yellow: '\x1b[1;33m', // Bold Yellow
  green: '\x1b[1;32m',  // Bold Green
  blue: '\x1b[1;34m',   // Bold Blue
  reset: '\x1b[0m'
};

// Create a circuit breaker for a function
export function breaker<T>(fn: (...args: any[]) => Promise<T>, options: CircuitBreakerOptions = {}) {
  const circuitOptions = { ...defaultOptions, ...options };
  const circuit = new CircuitBreaker(fn, circuitOptions);
  
  // Event logging with colors
  circuit.on('open', () => {
    console.log(`${colors.red}Circuit ${options.name || 'unnamed'} is open${colors.reset}`);
  });
  
  circuit.on('halfOpen', () => {
    console.log(`${colors.yellow}Circuit ${options.name || 'unnamed'} is half-open${colors.reset}`);
  });
  
  circuit.on('close', () => {
    console.log(`${colors.green}Circuit ${options.name || 'unnamed'} is closed${colors.reset}`);
  });
  
  circuit.on('fallback', () => {
    console.log(`${colors.blue}Circuit ${options.name || 'unnamed'} fallback executed${colors.reset}`);
  });
  
  return circuit;
}