import localFont from "next/font/local";
import Quadrant1 from "../components/Quadrant1";
import Quadrant2 from "../components/Quadrant2";
import Quadrant3 from "../components/Quadrant3";
import Quadrant4 from "../components/Quadrant4";
// TODO: Import the QuadrantErrorBoundary component
import Link from "next/link";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function Home() {
  return (
    <div
      className={`${geistSans.variable} ${geistMono.variable} min-h-screen p-6 font-[family-name:var(--font-geist-sans)] bg-slate-50`}
    >
      <header className="mb-8 max-w-6xl mx-auto">
        <div className="flex justify-between items-center py-4 border-b border-slate-200">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Error Boundaries Exercise
          </h1>
          <div className="flex gap-4">
            <Link
              href="/fatal-error"
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors shadow-sm"
            >
              Test Global Error
            </Link>
          </div>
        </div>
      </header>

      <main className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
        <div className="h-72 md:h-96 shadow-md rounded-xl overflow-hidden">
          {/* TODO: Wrap Quadrant1 with QuadrantErrorBoundary 
             1. Add an errorTag prop with value "ButtonClickError"
             2. This will prevent the error from crashing the entire app
          */}
          <Quadrant1 />
        </div>
        
        <div className="h-72 md:h-96 shadow-md rounded-xl overflow-hidden">
          {/* TODO: Wrap Quadrant2 with QuadrantErrorBoundary 
             1. Add an errorTag prop with value "InputRenderError" 
             2. This helps with error reporting and debugging
          */}
          <Quadrant2 />
        </div>
        
        <div className="h-72 md:h-96 shadow-md rounded-xl overflow-hidden">
          {/* TODO: Wrap Quadrant3 with QuadrantErrorBoundary 
             1. Add an errorTag prop with value "TimerCountdownError"
             2. Consider adding a custom fallback UI by using the fallback prop (optional challenge)
             3. The fallback can be either a ReactNode or a function that receives the error
          */}
          <Quadrant3 />
        </div>
        
        <div className="h-72 md:h-96 shadow-md rounded-xl overflow-hidden">
          {/* TODO: Wrap Quadrant4 with QuadrantErrorBoundary
             1. Add an errorTag prop with value "ControlQuadrantError"
             2. Notice how errors are isolated to this quadrant only
          */}
          <Quadrant4 />
        </div>
      </main>

      <footer className="mt-12 pt-6 border-t border-slate-200 text-center text-slate-500 text-sm max-w-6xl mx-auto">
        <p className="mb-2">
          Without error boundaries, any error will crash the entire application.
        </p>
        <p className="font-medium">
          Complete the TODOs to implement error boundaries and isolate failures to individual quadrants!
        </p>
      </footer>
    </div>
  );
}
