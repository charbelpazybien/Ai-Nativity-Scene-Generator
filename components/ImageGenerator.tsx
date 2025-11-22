import React, { useState, useCallback } from 'react';
import { generateImage } from '../services/geminiService';
import { Spinner } from './Spinner';

const initialPrompt = "A highly realistic 16:9 image of Joseph and Mary on their way to Bethlehem. Mary is riding a donkey. They are crossing vast desert dunes under a starry night sky with a large, bright star. The atmosphere is very gentle and tranquil.";

export const ImageGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState<string>(initialPrompt);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [addElement, setAddElement] = useState<string>('');

  const performGeneration = useCallback(async (currentPrompt: string) => {
    if (!currentPrompt || isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      const imageUrl = await generateImage(currentPrompt);
      setGeneratedImage(imageUrl);
      setPrompt(currentPrompt); // Update main prompt to reflect the latest version
      setAddElement(''); // Clear the input field after successful generation
    } catch (err) {
      setError(err as string);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading]);

  const handleGenerateClick = useCallback(() => {
    performGeneration(prompt);
  }, [prompt, performGeneration]);

  const handleAddElementClick = useCallback(() => {
    if (!addElement) return;
    const newPrompt = `${prompt}. Also, add ${addElement}.`;
    performGeneration(newPrompt);
  }, [addElement, prompt, performGeneration]);

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl shadow-2xl p-6 md:p-8 space-y-6">
      <div className="space-y-3">
        <label htmlFor="prompt" className="block text-lg font-medium text-amber-300">
          Image Prompt
        </label>
        <textarea
          id="prompt"
          rows={5}
          className="w-full bg-gray-900 border border-gray-600 rounded-lg p-3 text-gray-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition duration-200 resize-none"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe the image you want to create..."
        />
      </div>
      
      <button
        onClick={handleGenerateClick}
        disabled={isLoading || !prompt}
        className="w-full flex items-center justify-center gap-x-3 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-gray-900 font-bold py-3 px-6 rounded-lg shadow-lg transition-transform transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
      >
        {isLoading && !generatedImage ? (
          <>
            <Spinner />
            Generating...
          </>
        ) : (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {generatedImage ? 'Regenerate With Above Prompt' : 'Generate Image'}
          </>
        )}
      </button>

      <div className="relative mt-8 min-h-[400px] bg-gray-900/50 border border-gray-700 rounded-lg flex items-center justify-center p-4">
        {isLoading && (
          <div className="absolute inset-0 bg-gray-900/80 rounded-lg flex flex-col items-center justify-center z-10">
            <Spinner className="w-12 h-12 mx-auto mb-4" />
            <p className="text-lg font-semibold">The AI is painting your scene...</p>
            <p className="text-sm">This can take a moment. Thank you for your patience.</p>
          </div>
        )}

        {error && !isLoading && <p className="text-red-400 text-center">{error}</p>}
        
        {generatedImage && (
            <div className={`w-full transition-opacity duration-300 ${isLoading ? 'opacity-30' : 'opacity-100'}`}>
                <img src={generatedImage} alt="Generated nativity scene" className="rounded-lg shadow-xl w-full h-auto object-contain" />
            </div>
        )}

        {!isLoading && !error && !generatedImage && (
          <div className="text-center text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="mt-2">Your generated image will appear here.</p>
          </div>
        )}
      </div>

      {generatedImage && !isLoading && (
        <div className="pt-6 border-t border-gray-700/50">
          <div className="space-y-3">
             <label htmlFor="addElement" className="block text-lg font-medium text-amber-300">
                Add another element to the scene?
             </label>
             <div className="flex flex-col sm:flex-row gap-3">
                <input
                  id="addElement"
                  type="text"
                  className="flex-grow bg-gray-900 border border-gray-600 rounded-lg p-3 text-gray-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition duration-200"
                  value={addElement}
                  onChange={(e) => setAddElement(e.target.value)}
                  placeholder="e.g., 'a comet in the sky', 'a small oasis'"
                />
                <button
                  onClick={handleAddElementClick}
                  disabled={!addElement || isLoading}
                  className="flex items-center justify-center gap-x-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg shadow-lg transition-transform transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  Add to Scene
                </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};