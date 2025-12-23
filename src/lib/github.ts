// lib/github.ts

// Base GitHub API configuration
const GITHUB_API_URL = 'https://api.github.com';

// Helper function to create headers
function createHeaders() {
  const token = process.env.GITHUB_TOKEN;
  return {
    'Authorization': token ? `Bearer ${token}` : '',
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'GitWrap-App',
  };
}

// Fetch GitHub user
export async function fetchGitHubUser(username: string) {
  const response = await fetch(`${GITHUB_API_URL}/users/${username}`, {
    headers: createHeaders(),
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`GitHub API error (${response.status}): ${errorText}`);
  }

  return response.json();
}

// Fetch GitHub repositories
export async function fetchGitHubRepos(username: string) {
  const response = await fetch(
    `${GITHUB_API_URL}/users/${username}/repos?per_page=100&sort=updated`,
    {
      headers: createHeaders(),
      next: { revalidate: 1800 },
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`GitHub API error (${response.status}): ${errorText}`);
  }

  return response.json();
}

// Fetch commits for a specific repo and year
export async function fetchCommitsForRepo(username: string, repoName: string, year: number) {
  const startDate = `${year}-01-01T00:00:00Z`;
  const endDate = `${year}-12-31T23:59:59Z`;
  let allCommits = [];
  let page = 1;
  
  try {
    while (true) {
      const response = await fetch(
        `${GITHUB_API_URL}/repos/${username}/${repoName}/commits?` +
        `since=${startDate}&until=${endDate}&per_page=100&page=${page}`,
        {
          headers: createHeaders(),
          // Don't cache commits - they change frequently
          cache: 'no-store',
        }
      );

      // If repo is empty or not accessible, return 0
      if (response.status === 409 || response.status === 404) {
        return 0;
      }

      if (!response.ok) {
        // For rate limiting or other errors, return 0
        if (response.status === 403 || response.status === 429) {
          console.warn(`Rate limited or forbidden for ${username}/${repoName}`);
          return 0;
        }
        throw new Error(`Failed to fetch commits: ${response.status}`);
      }

      const commits = await response.json();
      
      // GitHub returns empty array for no commits
      if (!commits || commits.length === 0) break;
      
      allCommits = [...allCommits, ...commits];
      
      // Check for pagination
      const linkHeader = response.headers.get('Link');
      if (!linkHeader || !linkHeader.includes('rel="next"')) {
        break;
      }
      
      page++;
      
      // Safety limit: don't fetch more than 10 pages (1000 commits per year per repo)
      if (page > 10) break;
    }
    
    return allCommits.length;
  } catch (error) {
    console.error(`Error fetching commits for ${username}/${repoName}:`, error);
    return 0;
  }
}

// Fetch pull requests for a repo (simplified - counts PRs from commit messages)
export async function fetchPRsForRepo(username: string, repoName: string, year: number) {
  try {
    const response = await fetch(
      `${GITHUB_API_URL}/repos/${username}/${repoName}/pulls?` +
      `state=all&per_page=100&sort=updated`,
      {
        headers: createHeaders(),
        cache: 'no-store',
      }
    );

    if (!response.ok) {
      if (response.status === 403 || response.status === 429 || response.status === 404) {
        return 0;
      }
      throw new Error(`Failed to fetch PRs: ${response.status}`);
    }

    const prs = await response.json();
    
    // Filter PRs created in the target year
    const prsThisYear = prs.filter((pr: any) => {
      const prYear = new Date(pr.created_at).getFullYear();
      return prYear === year;
    });
    
    return prsThisYear.length;
  } catch (error) {
    console.error(`Error fetching PRs for ${username}/${repoName}:`, error);
    return 0;
  }
}

// Get yearly statistics
export async function fetchYearlyStats(username: string, year: number = new Date().getFullYear()) {
  try {
    console.log(`Fetching yearly stats for ${username}, year ${year}`);
    
    // Get user and repos first
    const [user, repos] = await Promise.all([
      fetchGitHubUser(username).catch(() => null),
      fetchGitHubRepos(username).catch(() => []),
    ]);

    if (!user) {
      throw new Error('User not found');
    }

    // Filter repos that existed during the target year
    const relevantRepos = repos.filter((repo: any) => {
      const repoYear = new Date(repo.created_at).getFullYear();
      return repoYear <= year;
    });

    console.log(`Found ${relevantRepos.length} relevant repos for year ${year}`);

    // For better performance, limit to top 20 repos by stars
    const topRepos = [...relevantRepos]
      .sort((a: any, b: any) => b.stargazers_count - a.stargazers_count)
      .slice(0, 20);

    // Calculate basic stats
    let totalCommits = 0;
    let totalPRs = 0;
    let totalForks = 0;
    let totalStars = 0;
    
    // Only count forks and stars from repos that existed during the year
    relevantRepos.forEach((repo: any) => {
      totalForks += repo.forks_count || 0;
      totalStars += repo.stargazers_count || 0;
    });

    // Fetch detailed stats for top repos only (for performance)
    console.log(`Fetching commit/PR data for ${topRepos.length} top repos...`);
    
    const repoStatsPromises = topRepos.map(async (repo: any) => {
      try {
        const [commits, prs] = await Promise.all([
          fetchCommitsForRepo(username, repo.name, year),
          fetchPRsForRepo(username, repo.name, year),
        ]);
        
        return { commits, prs };
      } catch (error) {
        console.error(`Error fetching stats for ${repo.name}:`, error);
        return { commits: 0, prs: 0 };
      }
    });

    const repoStats = await Promise.all(repoStatsPromises);
    
    // Sum up the stats
    repoStats.forEach(({ commits, prs }) => {
      totalCommits += commits;
      totalPRs += prs;
    });

    // Estimate additional commits/PRs based on repo count
    // If we only sampled top repos, estimate for the rest
    if (relevantRepos.length > topRepos.length) {
      const sampledRatio = topRepos.length / relevantRepos.length;
      const estimatedCommits = Math.round(totalCommits / sampledRatio);
      const estimatedPRs = Math.round(totalPRs / sampledRatio);
      
      totalCommits = estimatedCommits;
      totalPRs = estimatedPRs;
    }

    return {
      year,
      totalCommits,
      totalPRs,
      totalForks,
      totalStars,
      totalRepos: relevantRepos.length,
      username,
      user: {
        login: user.login,
        name: user.name,
        avatar_url: user.avatar_url,
        html_url: user.html_url,
      },
      fetchedAt: new Date().toISOString(),
      sampledRepos: topRepos.length,
      totalReposCount: relevantRepos.length,
    };
  } catch (error) {
    console.error('Error fetching yearly stats:', error);
    throw error;
  }
}

// Quick stats (lightweight version)
export async function fetchQuickYearlyStats(username: string, year: number = new Date().getFullYear()) {
  try {
    const [user, repos] = await Promise.all([
      fetchGitHubUser(username),
      fetchGitHubRepos(username),
    ]);

    const relevantRepos = repos.filter((repo: any) => {
      const repoYear = new Date(repo.created_at).getFullYear();
      return repoYear <= year;
    });

    // Calculate estimated stats (faster but less accurate)
    const totalForks = relevantRepos.reduce((sum: number, repo: any) => sum + (repo.forks_count || 0), 0);
    const totalStars = relevantRepos.reduce((sum: number, repo: any) => sum + (repo.stargazers_count || 0), 0);
    
    // Estimate commits and PRs based on repository count and activity
    const estimatedCommits = Math.round(relevantRepos.length * 50); // ~50 commits per repo per year
    const estimatedPRs = Math.round(relevantRepos.length * 5); // ~5 PRs per repo per year

    return {
      year,
      totalCommits: estimatedCommits,
      totalPRs: estimatedPRs,
      totalForks,
      totalStars,
      totalRepos: relevantRepos.length,
      username,
      user: {
        login: user.login,
        name: user.name,
        avatar_url: user.avatar_url,
        html_url: user.html_url,
      },
      fetchedAt: new Date().toISOString(),
      estimated: true, // Flag to indicate these are estimates
    };
  } catch (error) {
    console.error('Error fetching quick yearly stats:', error);
    throw error;
  }
}

// Check rate limit
export async function checkRateLimit() {
  const response = await fetch(`${GITHUB_API_URL}/rate_limit`, {
    headers: createHeaders(),
  });

  if (!response.ok) {
    throw new Error(`Failed to check rate limit: ${response.status}`);
  }

  const data = await response.json();
  
  return {
    core: data.resources?.core || {},
    search: data.resources?.search || {},
    graphql: data.resources?.graphql || {},
    remaining: data.resources?.core?.remaining || 0,
    limit: data.resources?.core?.limit || 0,
    resetAt: data.resources?.core?.reset ? new Date(data.resources.core.reset * 1000) : null,
  };
}

// Fetch contributions from GitHub's contribution graph (requires scraping)
export async function fetchContributions(username: string, year: number) {
  try {
    // This would require scraping the GitHub contributions page
    // For now, we'll estimate based on commits
    const stats = await fetchQuickYearlyStats(username, year);
    return {
      year,
      totalContributions: stats.totalCommits + stats.totalPRs,
      dailyAverage: Math.round((stats.totalCommits + stats.totalPRs) / 365),
      breakdown: {
        commits: stats.totalCommits,
        prs: stats.totalPRs,
        issues: Math.round(stats.totalPRs * 0.3), // Estimate issues
        reviews: Math.round(stats.totalPRs * 0.5), // Estimate code reviews
      }
    };
  } catch (error) {
    console.error('Error fetching contributions:', error);
    throw error;
  }
}