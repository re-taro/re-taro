// deno-fmt-ignore-file
export default {
  endpoints: {
    githubRepos: 'https://api.github.com/users/re-taro/repos',
    githubEvents: 'https://api.github.com/users/re-taro/events',
    wakatime: 'https://wakatime.com/api/v1/users/re_taro/stats',
    music:
      'https://toru.kio.dev/api/v1/re-taro?blur&border_width=0&border_radius=26',
  },
  limits: {
    topRepos: 6,
    recentRepos: 6,
    blogPosts: 4,
    recentRepoDays: 30,
    languagesGraph: 12,
    userActivityMaxEventsPerDay: 4,
    userActivityMaxDays: 3,
    wakatimeTimeframe: 'all_time',
  },
  content: {
    title: `Hi there`,
    description: `だれかやなにかを愛する事が、きっと世界を動かすクレイジーな原動力. 「Crazy for You」
`
  },
  languagesIgnore: [
    'json',
    'yaml',
    'markdown',
    'shell',
    'batchfile',
    'other',
  ],
};
