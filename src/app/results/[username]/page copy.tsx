'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Github, 
  Star, 
  GitBranch, 
  Users, 
  Calendar,
  Code,
  Globe,
  Building,
  MapPin,
  Twitter,
  ArrowLeft,
  Sparkles
} from 'lucide-react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';

interface GitHubUser {
  login: string;
  name: string | null;
  avatar_url: string;
  bio: string | null;
  public_repos: number;
  public_gists: number;
  followers: number;
  following: number;
  created_at: string;
  updated_at: string;
  location: string | null;
  blog: string | null;
  twitter_username: string | null;
  company: string | null;
  email: string | null;
  html_url: string;
}

interface GitHubRepo {
  name: string;
  html_url: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
}

export default function ResultsPage() {
  const params = useParams();
  const router = useRouter();
  const username = params.username as string;
  
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      if (!username) return;
      
      try {
        setLoading(true);
        
        // Fetch user data
        const userResponse = await fetch(`/api/github/user?username=${username}`);
        if (!userResponse.ok) {
          throw new Error('User not found');
        }
        const userData = await userResponse.json();
        setUser(userData);
        
        // Fetch repositories
        const reposResponse = await fetch(`/api/github/repos?username=${username}`);
        const reposData = await reposResponse.json();
        setRepos(reposData);
        
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [username]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="w-12 h-12 border-3 border-gray-300 border-t-blue-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading GitHub data...</p>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="text-5xl mb-4">😕</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">User not found</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            "{username}" doesn't exist on GitHub.
          </p>
          <Button onClick={() => router.push('/')} className="bg-gray-900 hover:bg-gray-800 dark:bg-gray-800 dark:hover:bg-gray-700">
            Try Another User
          </Button>
        </div>
      </div>
    );
  }

  // Calculate stats
  const totalStars = repos.reduce((sum, repo) => sum + repo.stargazers_count, 0);
  const totalForks = repos.reduce((sum, repo) => sum + repo.forks_count, 0);
  const accountAge = Math.floor(
    (new Date().getTime() - new Date(user.created_at).getTime()) / 
    (1000 * 60 * 60 * 24 * 365.25)
  );

  return (
    
    <div className="min-h-screen bg-white dark:bg-gray-900 py-12">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 mt-4 sm:px-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <Link 
              href="/" 
              className="flex items-center gap-2 text-blue-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Link>
            <Button 
              className="bg-gray-900 hover:bg-gray-800 dark:bg-gray-800 dark:hover:bg-gray-700"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Create Wrap
            </Button>
          </div>
          
          <div className="mt-6 text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              GitHub Stats for <span className="text-blue-600">@{user.login}</span>
            </h1>
          </div>
        </div>

        {/* Profile Section */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              <img
                src={user.avatar_url}
                alt={user.login}
                className="w-12 h-12 rounded-full border border-gray-200 dark:border-gray-700"
              />
              <div className="flex-1 text-center sm:text-left">
                <div className="mb-4">
                  <h2 className="text-xl font-bold">{user.name || user.login}</h2>
                  <p className="text-gray-600 dark:text-gray-400">@{user.login}</p>
                  {user.bio && (
                    <p className="mt-2 text-gray-700 dark:text-gray-300">{user.bio}</p>
                  )}
                </div>
                
                <div className="flex flex-wrap gap-4 text-sm">
                  {user.location && (
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <MapPin className="w-4 h-4" />
                      <span>{user.location}</span>
                    </div>
                  )}
                  
                  {user.company && (
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <Building className="w-4 h-4" />
                      <span>{user.company}</span>
                    </div>
                  )}
                  
                  <a 
                    href={user.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-blue-600 hover:underline"
                  >
                    <Github className="w-4 h-4" />
                    <span>GitHub</span>
                  </a>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Stats */}
        <div className="grid grid-cols-3 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 text-center">
              <GitBranch className="w-6 h-6 text-blue-600 mx-auto mb-2" />
              <div className="text-lg font-bold">{user.public_repos}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Repos</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-lg font-bold">{user.followers}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Followers</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <Users className="w-6 h-6  mx-auto mb-2" />
              <div className="text-lg font-bold">{user.following}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Following</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <Calendar className="w-6 h-6  mx-auto mb-2" />
              <div className="text-lg font-bold">{accountAge}y</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">On GitHub</div>
            </CardContent>
          </Card>
        </div>

        {/* Repository Stats */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <h3 className="font-bold mb-4">Repository Stats</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="text-2xl font-bold">{totalStars.toLocaleString()}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Total Stars</div>
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-bold">{totalForks.toLocaleString()}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Total Forks</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Repositories */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold">Recent Repositories</h3>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {repos.length} total
              </span>
            </div>
            
            <div className="space-y-3">
              {repos.slice(0, 3).map((repo) => (
                <a 
                  key={repo.name}
                  href={repo.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-gray-300 dark:hover:border-gray-600 transition"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold text-blue-600">{repo.name}</h4>
                      {repo.description && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                          {repo.description}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      {repo.language && (
                        <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded">
                          {repo.language}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3" />
                      <span>{repo.stargazers_count.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <GitBranch className="w-3 h-3" />
                      <span>{repo.forks_count.toLocaleString()}</span>
                    </div>
                  </div>
                </a>
              ))}
            </div>
            
            {repos.length > 3 && (
              <div className="mt-4 text-center">
                <Link 
                  href={`https://github.com/${user.login}?tab=repositories`}
                  target="_blank"
                  className="text-sm text-blue-600 hover:underline"
                >
                  View all repositories on GitHub →
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Additional Links */}
        <div className="flex flex-wrap gap-4 justify-center">
          {user.blog && (
            <a 
              href={user.blog}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition"
            >
              <Globe className="w-4 h-4" />
              <span className="text-sm">Website</span>
            </a>
          )}
          
          {user.twitter_username && (
            <a 
              href={`https://twitter.com/${user.twitter_username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition"
            >
              <Twitter className="w-4 h-4" />
              <span className="text-sm">Twitter</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}