const GITHUB_API = 'https://api.github.com';

function createHeaders() {
  const token = process.env.GITHUB_TOKEN || '';
  return {
    'Authorization': token ? `Bearer ${token}` : '',
    'Accept': 'application/vnd.github.v3+json',
  };
}

async function fetchAllRepos(username: string) {
  let allRepos: any[] = [];
  let page = 1;

  while (true) {
    const res = await fetch(`${GITHUB_API}/users/${username}/repos?per_page=100&page=${page}`, {
      headers: createHeaders(),
    });
    const repos = await res.json();
    if (!Array.isArray(repos) || repos.length === 0) break;
    allRepos = allRepos.concat(repos);
    page++;
  }

  return allRepos;
}

async function fetchCommitsForRepo(owner: string, repo: string) {
  try {
    const res = await fetch(`${GITHUB_API}/repos/${owner}/${repo}/stats/contributors`, {
      headers: createHeaders(),
    });
    const data = await res.json();
    if (!Array.isArray(data)) return 0;

    return data.reduce((sum: number, contributor: any) => sum + (contributor.total || 0), 0);
  } catch {
    return 0;
  }
}


async function fetchTotalPRs(username: string) {
  try {
    let totalPRs = 0;
    let page = 1;

    while (true) {
      const res = await fetch(`${GITHUB_API}/search/issues?q=type:pr+author:${username}&per_page=100&page=${page}`, {
        headers: createHeaders(),
      });
      const data = await res.json();
      if (!data.items || data.items.length === 0) break;
      totalPRs += data.items.length;

      if (page * 100 >= Math.min(data.total_count, 1000)) break;
      page++;
    }

    return totalPRs;
  } catch {
    return 0;
  }
}


export async function generateWrap(username: string) {
  try {

    const userRes = await fetch(`${GITHUB_API}/users/${username}`, { headers: createHeaders() });
    if (!userRes.ok) throw new Error(`User ${username} not found`);
    const user = await userRes.json();

    const repos = await fetchAllRepos(username);

    let totalCommits = 0;
    for (const repo of repos) {
      totalCommits += await fetchCommitsForRepo(username, repo.name);
    }

    const totalPRs = await fetchTotalPRs(username);

    return {
      user: {
        login: user.login,
        name: user.name || user.login,
        avatar_url: user.avatar_url,
        html_url: user.html_url,
        created_at: user.created_at,
      },
      stats: {
        repos: user.public_repos,
        commits: totalCommits,
        prs: totalPRs,
      },
      fetchedAt: new Date().toISOString(),
    };
  } catch (error: any) {
    console.error('Error in generateWrap:', error);
    throw error;
  }
}
