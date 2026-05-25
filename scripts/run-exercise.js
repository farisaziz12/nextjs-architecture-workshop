#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const child_process = require('child_process');

// Get exercise number from args
const args = process.argv.slice(2);
if (args.length === 0) {
  console.error('Please specify an exercise number, e.g., npm run exercise 01');
  process.exit(1);
}

const exerciseNum = args[0].padStart(2, '0');
const exercisePath = path.join(__dirname, '..', 'exercises', `${exerciseNum}-${getExerciseName(exerciseNum)}`);

if (!fs.existsSync(exercisePath)) {
  console.error(`Exercise ${exerciseNum} not found!`);
  process.exit(1);
}

console.log(`Starting Exercise ${exerciseNum}: ${getExerciseName(exerciseNum)}...`);

// Run the exercise Next.js app
try {
  process.chdir(exercisePath);

  child_process.execSync('pnpm install', { stdio: 'inherit' });

  // Exercises 03 and 04 must run in production build mode.
  // The Next.js dev overlay intercepts client-side errors and React
  // suspense boundary failures, which masks the exact behavior these
  // exercises teach (error boundaries catching errors, critical vs.
  // optional query failure modes). Keep these in build mode.
  if (exerciseNum === '03' || exerciseNum === '04') {
    console.log(`Running build mode for Exercise ${exerciseNum}...`);
    child_process.execSync('pnpm exec next build', { stdio: 'inherit' });
    child_process.execSync('pnpm exec next start -p 3000', { stdio: 'inherit' });
  } else {
    child_process.execSync('pnpm exec next dev -p 3000', { stdio: 'inherit' });
  }
} catch (error) {
  console.error('Error running exercise:', error);
}

// Helper function to get exercise name from number
function getExerciseName(num) {
  const exerciseMap = {
    '01': 'circuit-breaker',
    '02': 'timeout-pattern',
    '03': 'error-boundaries',
    '04': 'query-criticality',
  };
  
  return exerciseMap[num] || 'unknown-exercise';
}