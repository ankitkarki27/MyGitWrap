'use client';

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
  Share2,
  Code,
  Users,
  Award,
  BarChart3
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface WrapCardProps {
  data: {
    year: number;
    totalCommits: number;
    totalPRs: number;
    totalForks: number;
    totalStars: number;
    totalRepos: number;
    username: string;
    user: {
      login: string;
      name: string | null;
      avatar_url: string;
      html_url: string;
    };
    fetchedAt: string;
    estimated?: boolean;
    sampledRepos?: number;
    totalReposCount?: number;
  };
}

export default function WrapCard({ data }: WrapCardProps) {
  // Helper function to determine tier
  const getTier = (count: number, type: 'commits' | 'prs' | 'repos' | 'forks' | 'stars') => {
    switch (type) {
      case 'commits':
        if (count < 100) return { name: 'Coder', color: 'bg-blue-100 text-blue-800', emoji: '👶' };
        if (count < 500) return { name: 'Developer', color: 'bg-green-100 text-green-800', emoji: '💻' };
        if (count < 1000) return { name: 'Engineer', color: 'bg-yellow-100 text-yellow-800', emoji: '⚡' };
        if (count < 2000) return { name: 'Senior', color: 'bg-purple-100 text-purple-800', emoji: '🚀' };
        if (count < 5000) return { name: 'Lead', color: 'bg-pink-100 text-pink-800', emoji: '👑' };
        return { name: 'Principal', color: 'bg-gradient-to-r from-yellow-100 to-orange-100 text-gray-900', emoji: '🏆' };
      
      case 'prs':
        if (count < 10) return { name: 'Starter', color: 'bg-blue-100 text-blue-800', emoji: '🌱' };
        if (count < 25) return { name: 'Contributor', color: 'bg-green-100 text-green-800', emoji: '🤝' };
        if (count < 50) return { name: 'Reviewer', color: 'bg-yellow-100 text-yellow-800', emoji: '🔍' };
        if (count < 100) return { name: 'Collaborator', color: 'bg-purple-100 text-purple-800', emoji: '👥' };
        if (count < 200) return { name: 'Maintainer', color: 'bg-pink-100 text-pink-800', emoji: '🛠️' };
        return { name: 'Architect', color: 'bg-gradient-to-r from-purple-100 to-pink-100 text-gray-900', emoji: '🏗️' };
      
      case 'repos':
        if (count < 10) return { name: 'Beginner', color: 'bg-blue-100 text-blue-800', emoji: '📁' };
        if (count < 25) return { name: 'Contributor', color: 'bg-green-100 text-green-800', emoji: '📚' };
        if (count < 50) return { name: 'Active', color: 'bg-yellow-100 text-yellow-800', emoji: '🔥' };
        if (count < 100) return { name: 'Pro', color: 'bg-purple-100 text-purple-800', emoji: '💪' };
        if (count < 200) return { name: 'Expert', color: 'bg-pink-100 text-pink-800', emoji: '🎯' };
        if (count < 500) return { name: 'Master', color: 'bg-red-100 text-red-800', emoji: '👑' };
        return { name: 'Legend', color: 'bg-gradient-to-r from-yellow-100 to-red-100 text-gray-900', emoji: '🌟' };
      
      case 'forks':
        if (count < 10) return { name: 'New', color: 'bg-blue-100 text-blue-800', emoji: '🍴' };
        if (count < 50) return { name: 'Popular', color: 'bg-green-100 text-green-800', emoji: '📈' };
        if (count < 100) return { name: 'Viral', color: 'bg-yellow-100 text-yellow-800', emoji: '🚀' };
        if (count < 500) return { name: 'Trending', color: 'bg-purple-100 text-purple-800', emoji: '🔥' };
        return { name: 'Iconic', color: 'bg-gradient-to-r from-pink-100 to-red-100 text-gray-900', emoji: '⭐' };
      
      case 'stars':
        if (count < 100) return { name: 'Rising', color: 'bg-blue-100 text-blue-800', emoji: '🌠' };
        if (count < 500) return { name: 'Shining', color: 'bg-green-100 text-green-800', emoji: '✨' };
        if (count < 1000) return { name: 'Blazing', color: 'bg-yellow-100 text-yellow-800', emoji: '☀️' };
        if (count < 5000) return { name: 'Stellar', color: 'bg-purple-100 text-purple-800', emoji: '🌌' };
        return { name: 'Supernova', color: 'bg-gradient-to-r from-yellow-100 to-orange-100 text-gray-900', emoji: '💫' };
      
      default:
        return { name: 'Beginner', color: 'bg-gray-100 text-gray-800', emoji: '🎯' };
    }
  };

  // Calculate tiers
  const commitTier = getTier(data.totalCommits, 'commits');
  const prTier = getTier(data.totalPRs, 'prs');
  const repoTier = getTier(data.totalRepos, 'repos');
  const forkTier = getTier(data.totalForks, 'forks');
  const starTier = getTier(data.totalStars, 'stars');

  // Calculate overall rank based on all metrics
  const calculateOverallRank = () => {
    const scores = [
      data.totalCommits / 100,
      data.totalPRs / 10,
      data.totalRepos / 10,
      data.totalForks / 10,
      data.totalStars / 100
    ];
    const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
    
    if (avgScore < 1) return { name: 'Newcomer', color: 'bg-gray-100 text-gray-800', emoji: '👋' };
    if (avgScore < 3) return { name: 'Contributor', color: 'bg-blue-100 text-blue-800', emoji: '💪' };
    if (avgScore < 7) return { name: 'Builder', color: 'bg-green-100 text-green-800', emoji: '🚀' };
    if (avgScore < 15) return { name: 'Expert', color: 'bg-yellow-100 text-yellow-800', emoji: '🏆' };
    if (avgScore < 30) return { name: 'Master', color: 'bg-purple-100 text-purple-800', emoji: '👑' };
    return { name: 'Legend', color: 'bg-gradient-to-r from-yellow-100 to-red-100 text-gray-900', emoji: '🌟' };
  };

  const overallRank = calculateOverallRank();

  const handleDownload = () => {
    // Implement download as image functionality
    console.log('Download wrap');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `My ${data.year} GitHub Wrap`,
        text: `Check out my ${data.year} GitHub stats! ${data.totalCommits} commits, ${data.totalPRs} PRs, ${data.totalStars} stars, and more!`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      {/* Main Wrap Card */}
      <div className="max-w-md w-full">
        {/* Card Container */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
          
          {/* Top Gradient Bar */}
          <div className="h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
          
          {/* Card Content */}
          <div className="p-6">
            {/* Header with Year and Actions */}
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">{data.year}</div>
                  <div className="text-sm text-gray-500">GitHub Wrap</div>
                  {data.estimated && (
                    <div className="text-xs text-yellow-600 mt-1">*Based on estimates</div>
                  )}
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="border-gray-300"
                  onClick={handleShare}
                >
                  <Share2 className="w-4 h-4" />
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="border-gray-300"
                  onClick={handleDownload}
                >
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Profile Section */}
            <div className="flex items-center gap-4 mb-8 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
              <img
                src={data.user.avatar_url}
                alt={data.user.login}
                className="w-16 h-16 rounded-full border-4 border-white shadow"
              />
              <div className="flex-1">
                <h1 className="text-xl font-bold text-gray-900">
                  {data.user.name || data.user.login}
                </h1>
                <a 
                  href={data.user.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-gray-600 hover:text-blue-600 transition"
                >
                  <Github className="w-4 h-4" />
                  <span>@{data.user.login}</span>
                </a>
              </div>
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${overallRank.color}`}>
                {overallRank.emoji} {overallRank.name}
              </div>
            </div>

            {/* Stats Grid */}
            <div className="space-y-4 mb-8">
              {/* Commits */}
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:border-blue-300 transition">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center">
                    <GitCommit className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">{data.totalCommits.toLocaleString()}</div>
                    <div className="text-sm text-gray-500">Commits</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${commitTier.color} mb-1`}>
                    {commitTier.emoji} {commitTier.name}
                  </div>
                  <div className="text-xs text-gray-500">
                    {data.totalCommits < 500 ? 'Keep pushing!' : 
                     data.totalCommits < 1000 ? 'Great pace!' : 
                     data.totalCommits < 2000 ? 'Incredible!' : 'Legendary!'}
                  </div>
                </div>
              </div>

              {/* Pull Requests */}
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:border-green-300 transition">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-green-50 flex items-center justify-center">
                    <GitPullRequest className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">{data.totalPRs.toLocaleString()}</div>
                    <div className="text-sm text-gray-500">Pull Requests</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${prTier.color} mb-1`}>
                    {prTier.emoji} {prTier.name}
                  </div>
                  <div className="text-xs text-gray-500">
                    {data.totalPRs < 25 ? 'Getting started!' : 
                     data.totalPRs < 50 ? 'Great contributions!' : 
                     data.totalPRs < 100 ? 'Team player!' : 'Open source hero!'}
                  </div>
                </div>
              </div>

              {/* Repositories */}
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:border-purple-300 transition">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-purple-50 flex items-center justify-center">
                    <Code className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">{data.totalRepos.toLocaleString()}</div>
                    <div className="text-sm text-gray-500">Repositories</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${repoTier.color} mb-1`}>
                    {repoTier.emoji} {repoTier.name}
                  </div>
                  <div className="text-xs text-gray-500">
                    {data.sampledRepos && `Top ${data.sampledRepos} of ${data.totalReposCount || data.totalRepos}`}
                  </div>
                </div>
              </div>

              {/* Forks */}
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:border-pink-300 transition">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-pink-50 flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-pink-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">{data.totalForks.toLocaleString()}</div>
                    <div className="text-sm text-gray-500">Forks Created</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${forkTier.color} mb-1`}>
                    {forkTier.emoji} {forkTier.name}
                  </div>
                  <div className="text-xs text-gray-500">
                    {data.totalForks < 50 ? 'Building audience!' : 
                     data.totalForks < 100 ? 'Growing impact!' : 'Community leader!'}
                  </div>
                </div>
              </div>

              {/* Stars */}
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:border-yellow-300 transition">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-yellow-50 flex items-center justify-center">
                    <Star className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">{data.totalStars.toLocaleString()}</div>
                    <div className="text-sm text-gray-500">Stars Earned</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${starTier.color} mb-1`}>
                    {starTier.emoji} {starTier.name}
                  </div>
                  <div className="text-xs text-gray-500">
                    {data.totalStars < 500 ? 'Getting noticed!' : 
                     data.totalStars < 1000 ? 'Shining bright!' : 'GitHub star!'}
                  </div>
                </div>
              </div>
            </div>

            {/* Activity Summary */}
            <div className="p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl mb-6">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-blue-600" />
                  <span className="font-semibold text-gray-900">Year in Review</span>
                </div>
                <Zap className="w-5 h-5 text-yellow-500" />
              </div>
              <div className="text-sm text-gray-600">
                {data.totalCommits} commits • {data.totalPRs} PRs • {data.totalRepos} repos • {data.totalForks} forks • {data.totalStars} stars
              </div>
              <div className="flex items-center gap-2 mt-3">
                <div className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded">
                  Daily: {Math.round(data.totalCommits / 365)} commits
                </div>
                <div className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded">
                  Weekly: {Math.round(data.totalPRs / 52)} PRs
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-yellow-500" />
                  <span className="text-sm font-medium text-gray-900">Overall Rank</span>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${overallRank.color}`}>
                  {overallRank.emoji} {overallRank.name}
                </div>
              </div>
              
              <div className="text-xs text-gray-500 text-center">
                Generated on {new Date(data.fetchedAt).toLocaleDateString()} • GitWrap
              </div>
              
              {data.estimated && (
                <div className="text-xs text-gray-400 text-center mt-2">
                  *Some stats are estimated based on repository patterns
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex gap-3">
          <Button 
            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            onClick={handleDownload}
          >
            <Download className="w-4 h-4 mr-2" />
            Download Image
          </Button>
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={() => window.history.back()}
          >
            Create Another
          </Button>
        </div>

        {/* Share Note */}
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Share your wrap with #GitHubWrap
          </p>
        </div>
      </div>
    </div>
  );
}