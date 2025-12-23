'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Github, 
  Star, 
  GitBranch, 
  GitCommit,
  GitPullRequest,
  Calendar,
  Trophy,
  Zap,
  TrendingUp,
  Download,
  Share2
} from 'lucide-react';

interface WrapStats {
  year: number;
  totalCommits: number;
  totalPRs: number;
  totalForks: number;
  totalStars: number;
  totalRepos: number;
  username: string;
  fetchedAt: string;
}

interface GitHubUser {
  login: string;
  name: string | null;
  avatar_url: string;
  html_url: string;
}

export default function WrapPage() {
  const params = useParams();
  const username = params.username as string;
  const currentYear = new Date().getFullYear();
  
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [stats, setStats] = useState<WrapStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchWrapData = async () => {
      try {
        setLoading(true);
        
        // Fetch user data
        const userResponse = await fetch(`/api/github/user?username=${username}`);
        if (!userResponse.ok) throw new Error('User not found');
        const userData = await userResponse.json();
        setUser(userData);
        
        // Fetch yearly stats
        const statsResponse = await fetch(`/api/github/stats/${username}?year=${currentYear}`);
        const statsData = await statsResponse.json();
        setStats(statsData);
        
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch wrap data');
      } finally {
        setLoading(false);
      }
    };

    fetchWrapData();
  }, [username, currentYear]);

  // Helper function to determine tier
  const getTier = (count: number) => {
    if (count < 50) return { name: 'Beginner', color: 'bg-blue-100 text-blue-800' };
    if (count < 100) return { name: 'Contributor', color: 'bg-green-100 text-green-800' };
    if (count < 250) return { name: 'Active', color: 'bg-yellow-100 text-yellow-800' };
    if (count < 500) return { name: 'Pro', color: 'bg-purple-100 text-purple-800' };
    if (count < 1000) return { name: 'Expert', color: 'bg-pink-100 text-pink-800' };
    if (count < 1500) return { name: 'Master', color: 'bg-red-100 text-red-800' };
    return { name: 'Legend', color: 'bg-linear-to-r from-yellow-100 to-red-100 text-gray-900' };
  };

  // Helper function to determine PR tier
  const getPRTier = (count: number) => {
    if (count < 10) return { name: 'Starter', color: 'bg-blue-100 text-blue-800' };
    if (count < 25) return { name: 'Contributor', color: 'bg-green-100 text-green-800' };
    if (count < 50) return { name: 'Reviewer', color: 'bg-yellow-100 text-yellow-800' };
    if (count < 100) return { name: 'Collaborator', color: 'bg-purple-100 text-purple-800' };
    if (count < 200) return { name: 'Maintainer', color: 'bg-pink-100 text-pink-800' };
    return { name: 'Architect', color: 'bg-linear-to-r from-purple-100 to-pink-100 text-gray-900' };
  };

  // Helper function to determine commit tier
  const getCommitTier = (count: number) => {
    if (count < 100) return { name: 'Coder', color: 'bg-blue-100 text-blue-800' };
    if (count < 500) return { name: 'Developer', color: 'bg-green-100 text-green-800' };
    if (count < 1000) return { name: 'Engineer', color: 'bg-yellow-100 text-yellow-800' };
    if (count < 2000) return { name: 'Senior', color: 'bg-purple-100 text-purple-800' };
    if (count < 5000) return { name: 'Lead', color: 'bg-pink-100 text-pink-800' };
    return { name: 'Principal', color: 'bg-linear-to-r from-yellow-100 to-orange-100 text-gray-900' };
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Creating your GitHub Wrap...</p>
        </div>
      </div>
    );
  }

  if (error || !user || !stats) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <div className="text-4xl mb-4">😕</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Unable to create wrap</h2>
          <p className="text-gray-600 mb-6">{error || 'Failed to load data'}</p>
          <Button onClick={() => window.history.back()}>Go Back</Button>
        </div>
      </div>
    );
  }

  const commitTier = getCommitTier(stats.totalCommits);
  const prTier = getPRTier(stats.totalPRs);
  const repoTier = getTier(stats.totalRepos);
  const forkTier = getTier(stats.totalForks);
  const starTier = getTier(stats.totalStars);

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-50 to-gray-100 p-4 font-two">
      {/* GitHub Wrap Card */}
      <div className="max-w-md w-full">
        {/* Card Container */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
          
          {/* Header - linear */}
          <div className="h-4 bg-linear-to-r from-blue-600 via-purple-600 to-pink-600" />
          
          {/* Card Content */}
          <div className="p-6">
            {/* Year Badge */}
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-linear-to-r from-blue-100 to-purple-100 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">{stats.year}</div>
                  <div className="text-sm text-gray-500">GitHub Wrap</div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" className="border-gray-300">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
                <Button size="sm" variant="outline" className="border-gray-300">
                  <Download className="w-4 h-4 mr-2" />
                  Save
                </Button>
              </div>
            </div>

            {/* Profile Section */}
            <div className="flex items-center gap-4 mb-8">
              <img
                src={user.avatar_url}
                alt={user.login}
                className="w-16 h-16 rounded-full border-4 border-white shadow-lg"
              />
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  {user.name || user.login}
                </h1>
                <a 
                  href={user.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-gray-600 hover:text-blue-600"
                >
                  <Github className="w-4 h-4" />
                  <span>@{user.login}</span>
                </a>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="space-y-4 mb-8">
              {/* Commits */}
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                    <GitCommit className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{stats.totalCommits}</div>
                    <div className="text-sm text-gray-500">Total Commits</div>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${commitTier.color}`}>
                  {commitTier.name}
                </span>
              </div>

              {/* Pull Requests */}
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
                    <GitPullRequest className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{stats.totalPRs}</div>
                    <div className="text-sm text-gray-500">Pull Requests</div>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${prTier.color}`}>
                  {prTier.name}
                </span>
              </div>

              {/* Repositories */}
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center">
                    <GitBranch className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{stats.totalRepos}</div>
                    <div className="text-sm text-gray-500">Repositories</div>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${repoTier.color}`}>
                  {repoTier.name}
                </span>
              </div>

              {/* Forks */}
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-pink-50 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-pink-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{stats.totalForks}</div>
                    <div className="text-sm text-gray-500">Total Forks</div>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${forkTier.color}`}>
                  {forkTier.name}
                </span>
              </div>

              {/* Stars */}
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-yellow-50 flex items-center justify-center">
                    <Star className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{stats.totalStars}</div>
                    <div className="text-sm text-gray-500">Stars Earned</div>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${starTier.color}`}>
                  {starTier.name}
                </span>
              </div>
            </div>

            {/* Footer */}
            <div className="pt-6 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm text-gray-600">Your {stats.year} GitHub Journey</span>
                </div>
                <Trophy className="w-5 h-5 text-yellow-500" />
              </div>
              
              <div className="mt-4 text-xs text-gray-500 text-center">
                Generated on {new Date(stats.fetchedAt).toLocaleDateString()} • GitWrap
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex gap-3">
          <Button className="flex-1 bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
            Download as Image
          </Button>
          <Button variant="outline" className="flex-1">
            Compare with {stats.year - 1}
          </Button>
        </div>
      </div>
    </div>
  );
}