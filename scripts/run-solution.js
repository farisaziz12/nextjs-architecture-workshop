#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const child_process = require('child_process');

// Get solution number from args
const args = process.argv.slice(2);
if (args.length === 0) {
  console.error('Please specify a solution number, e.g., npm run solution 01');
  process.exit(1);
}

const solutionNum = args[0].padStart(2, '0');
const solutionPath = path.join(__dirname, '..', 'solutions', `${solutionNum}-${getSolutionName(solutionNum)}`);

if (!fs.existsSync(solutionPath)) {
  console.error(`Solution ${solutionNum} not found!`);
  process.exit(1);
}

console.log(`Starting Solution ${solutionNum}: ${getSolutionName(solutionNum)}...`);

// Run the solution Next.js app
try {
  process.chdir(solutionPath);
  
  if (solutionNum === '03') {
    console.log('Building and starting solution 03 in production mode...');
    child_process.execSync('npx next build', { stdio: 'inherit' });
    child_process.execSync('npx next start -p 3000', { stdio: 'inherit' });
  } else {
    child_process.execSync('npx next dev -p 3000', { stdio: 'inherit' });
  }
} catch (error) {
  console.error('Error running solution:', error);
}

// Helper function to get solution name from number
function getSolutionName(num) {
  const solutionMap = {
    '01': 'circuit-breaker',
    '02': 'timeout-pattern',
    '03': 'error-boundaries',
    '04': 'query-criticality',
  };
  
  return solutionMap[num] || 'unknown-solution';
}