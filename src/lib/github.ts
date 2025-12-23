// lib/github.ts - Ultra concise version

const GITHUB_API = 'https://api.github.com';

const headers = () => ({
  'Authorization': process.env.GITHUB_TOKEN ? `Bearer ${process.env.GITHUB_TOKEN}` : '',
  'Accept': 'application/vnd.github.v3+json',
});

// Fetch user data
export const fetchUser = async (username: string) => {
  const res = await fetch(`${GITHUB_API}/users/${username}`, { headers: headers() });
  if (!res.ok) throw new Error(`User ${username} not found`);
  return res.json();
};

// Fetch user repos
export const fetchRepos = async (username: string) => {
  const res = await fetch(`${GITHUB_API}/users/${username}/repos?per_page=100&sort=updated`, { 
    headers: headers() 
  });
  if (!res.ok) throw new Error('Failed to fetch repos');
  return res.json();
};

// Generate wrap data
export const generateWrap = async (username: string, year: number = new Date().getFullYear()) => {
  const [user, repos] = await Promise.all([fetchUser(username), fetchRepos(username)]);
  
  // Filter repos for the year
  const yearRepos = repos.filter((r: any) => new Date(r.created_at).getFullYear() <= year);
  
  // Calculate stats
  const totalStars = yearRepos.reduce((sum: number, r: any) => sum + (r.stargazers_count || 0), 0);
  const totalForks = yearRepos.reduce((sum: number, r: any) => sum + (r.forks_count || 0), 0);
  const totalRepos = yearRepos.length;
  
  // Smart estimates
  const activeRepos = yearRepos.filter((r: any) => 
    new Date(r.updated_at).getFullYear() === year
  ).length;
  
  const baseCommits = activeRepos * 30;
  const commitMultiplier = Math.log10(totalStars + 1) * 0.5 + 1;
  const totalCommits = Math.round(baseCommits * commitMultiplier);
  const totalPRs = Math.round(totalCommits * 0.15);
  
  return {
    year,
    user: {
      login: user.login,
      name: user.name,
      avatar_url: user.avatar_url,
      html_url: user.html_url,
    },
    stats: {
      commits: totalCommits,
      prs: totalPRs,
      forks: totalForks,
      stars: totalStars,
      repos: totalRepos,
    },
    fetchedAt: new Date().toISOString(),
  };
};