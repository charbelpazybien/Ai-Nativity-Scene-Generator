
import React from 'react';
import { ImageGenerator } from './components/ImageGenerator';

const App: React.FC = () => {
  return (
    <main className="bg-gray-900 min-h-screen w-full text-white flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-7xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-500">
            AI Nativity Scene Generator
          </h1>
          <p className="mt-2 text-lg text-gray-400">
            Create a beautiful, realistic image of the journey to Bethlehem.
          </p>
        </header>
        <ImageGenerator />
      </div>
    </main>
  );
};

export default App;
