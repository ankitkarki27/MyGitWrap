'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles, Search, TrendingUp } from 'lucide-react';

export default function HeroSection() {
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;
    
    setIsLoading(true);
    // Here you'll fetch GitHub data
    console.log('Searching for:', username);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      // Navigate to results page or show results
      // router.push(`/wrap/${username}`);
    }, 1000);
  };

  return (
    <section className="relative overflow-hidden pt-16 pb-24 font-two">
      {/* Background linear */}
      {/* <div className="absolute inset-0 bg-linear-to-br from-blue-500/5 via-transparent to-green-500/5" /> */}
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center">
          {/* Heading */}
          <div className="animate-fade-in">
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">
              <span className="block text-gray-900 dark:text-white">Your GitHub Year</span>
              <span className="block">
                <span className="text-blue-600 dark:text-blue-500">Wrapped</span>
                <span className="text-gray-900 dark:text-white"> in Style</span>
              </span>
            </h1>
            
            <p className="flex-wrap text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
              Discover your coding journey with beautiful GitHub statistics.
              Simply enter a username to generate a personalized wrap.
            </p>

            {/* Search Form */}
            <form onSubmit={handleSearch} className="max-w-md mx-auto mb-10">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter GitHub username"
                  className="block w-full pl-10 pr-32 py-3 text-base border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={isLoading}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-1">
                  <Button
                    type="submit"
                    disabled={isLoading || !username.trim()}
                    className="mr-1 bg-gray-900 hover:bg-gray-800 dark:bg-gray-800 dark:hover:bg-gray-700"
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Searching...</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4" />
                        <span>Create Your GitWrap</span>
                      </div>
                    )}
                  </Button>
                </div>
              </div>
            </form>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
              <div className="text-center">
                <div className="text-xl font-bold text-gray-900 dark:text-white">100%</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Free</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-gray-900 dark:text-white">Instant</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Results</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-gray-900 dark:text-white">No Signup</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Required</div>
              </div>
            </div>
          </div>


        </div>
      </div>
    </section>
  );
}