'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import WrapCard from '@/components/WrapCard';

export default function ResultsPage() {
  const params = useParams();
  const router = useRouter();
  const username = params?.username as string;
  
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [debug, setDebug] = useState('');

  useEffect(() => {
    if (!username) {
      setError('No username provided');
      setLoading(false);
      return;
    }

    const fetchWrap = async () => {
      try {
        setLoading(true);
        setError('');
        setDebug(`Fetching wrap for: ${username}`);
        
        // API URL
        const apiUrl = `/api/github/wrap/${username}`;
        setDebug(`API URL: ${apiUrl}`);
        
        const res = await fetch(apiUrl);
        setDebug(`Status: ${res.status} ${res.statusText}`);
        
        if (!res.ok) {
          const errorText = await res.text();
          setDebug(`Error response: ${errorText}`);
          throw new Error(`API error: ${res.status}`);
        }
        
        const wrapData = await res.json();
        setDebug(`Success! Got data for ${wrapData.user?.login}`);
        setData(wrapData);
        
      } catch (err: any) {
        console.error('Fetch error:', err);
        setError(err.message || 'Failed to load wrap');
        
        const fallbackData = {
          year: new Date().getFullYear(),
          user: {
            login: username,
            name: username,
            avatar_url: `https://github.com/${username}.png`,
            html_url: `https://github.com/${username}`,
          },
          stats: {
            commits: 0,
            prs: 0,
            forks: 0,
            stars: 0,
            repos: 0,
          },
          fetchedAt: new Date().toISOString(),
        };
        
        setData(fallbackData);
        setDebug(`Using fallback data for ${username} (all stats = 0)`);
      } finally {
        setLoading(false);
      }
    };

    fetchWrap();
  }, [username]);

  if (loading) {
    return (
      <div className="min-h-3xl flex flex-col items-center justify-center px-4">
        <div className="text-center mb-8">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Creating wrap for @{username}...</p>
        </div>
        {debug && (
          <div className="mt-4 p-4 bg-gray-100 rounded max-w-md">
            <p className="text-sm text-gray-700">{debug}</p>
          </div>
        )}
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="text-4xl mb-4">😕</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600 mb-2">{error}</p>
          {debug && (
            <p className="text-sm text-gray-500 mb-4">{debug}</p>
          )}
          <button
            onClick={() => router.push('/')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">No data available</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center px-4 py-8">
      <WrapCard data={data} />
      {debug && (
        <div className="mt-6 p-4 bg-gray-100 rounded max-w-md">
          <p className="text-sm text-gray-700">{debug}</p>
        </div>
      )}
    </div>
  );
}
