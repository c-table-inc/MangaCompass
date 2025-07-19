import { Manga, User, MANGA_GENRES } from './types';

// 50作品以上の人気漫画モックデータ
export const MOCK_MANGA: Manga[] = [
  // 少年漫画
  {
    id: 'one-piece',
    title: 'One Piece',
    author: 'Eiichiro Oda',
    genres: ['Action', 'Adventure', 'Comedy'],
    status: 'ongoing',
    volumes: 107,
    rating: 9.2,
    description: 'Follow Monkey D. Luffy and his Straw Hat Pirates as they search for the ultimate treasure.',
    amazonLink: 'https://amazon.com/dp/1421536250/?tag=mangacompass-20',
    popularity: 98,
    year: 1997
  },
  {
    id: 'naruto',
    title: 'Naruto',
    author: 'Masashi Kishimoto',
    genres: ['Action', 'Adventure', 'Supernatural'],
    status: 'completed',
    volumes: 72,
    rating: 8.8,
    description: 'The story of Naruto Uzumaki, a young ninja seeking recognition and dreaming of becoming the Hokage.',
    amazonLink: 'https://amazon.com/dp/1421900063/?tag=mangacompass-20',
    popularity: 95,
    year: 1999
  },
  {
    id: 'dragon-ball',
    title: 'Dragon Ball',
    author: 'Akira Toriyama',
    genres: ['Action', 'Adventure', 'Comedy'],
    status: 'completed',
    volumes: 42,
    rating: 9.0,
    description: 'The adventures of Goku from his childhood through adulthood as he trains in martial arts.',
    amazonLink: 'https://amazon.com/dp/1421526158/?tag=mangacompass-20',
    popularity: 97,
    year: 1984
  },
  {
    id: 'my-hero-academia',
    title: 'My Hero Academia',
    author: 'Kohei Horikoshi',
    genres: ['Action', 'Supernatural', 'School'],
    status: 'ongoing',
    volumes: 39,
    rating: 8.7,
    description: 'In a world where most people have superpowers, a powerless boy enrolls in a prestigious hero academy.',
    amazonLink: 'https://amazon.com/dp/1421582694/?tag=mangacompass-20',
    popularity: 92,
    year: 2014
  },
  {
    id: 'demon-slayer',
    title: 'Demon Slayer: Kimetsu no Yaiba',
    author: 'Koyoharu Gotouge',
    genres: ['Action', 'Supernatural', 'Historical'],
    status: 'completed',
    volumes: 23,
    rating: 8.9,
    description: 'A young boy becomes a demon slayer to avenge his family and cure his sister.',
    amazonLink: 'https://amazon.com/dp/1974700526/?tag=mangacompass-20',
    popularity: 94,
    year: 2016
  },
  {
    id: 'attack-on-titan',
    title: 'Attack on Titan',
    author: 'Hajime Isayama',
    genres: ['Action', 'Drama', 'Horror'],
    status: 'completed',
    volumes: 34,
    rating: 9.1,
    description: 'Humanity fights for survival against giant humanoid creatures known as Titans.',
    amazonLink: 'https://amazon.com/dp/1612620248/?tag=mangacompass-20',
    popularity: 96,
    year: 2009
  },
  {
    id: 'jujutsu-kaisen',
    title: 'Jujutsu Kaisen',
    author: 'Gege Akutami',
    genres: ['Action', 'Supernatural', 'School'],
    status: 'ongoing',
    volumes: 24,
    rating: 8.6,
    description: 'A high school student joins a secret organization of Jujutsu Sorcerers to kill cursed creatures.',
    amazonLink: 'https://amazon.com/dp/1974710009/?tag=mangacompass-20',
    popularity: 91,
    year: 2018
  },
  {
    id: 'hunter-x-hunter',
    title: 'Hunter x Hunter',
    author: 'Yoshihiro Togashi',
    genres: ['Action', 'Adventure', 'Fantasy'],
    status: 'hiatus',
    volumes: 37,
    rating: 9.3,
    description: 'A young boy searches for his father, a legendary Hunter.',
    amazonLink: 'https://amazon.com/dp/1421501546/?tag=mangacompass-20',
    popularity: 93,
    year: 1998
  },
  {
    id: 'one-punch-man',
    title: 'One-Punch Man',
    author: 'ONE, Yusuke Murata',
    genres: ['Action', 'Comedy', 'Supernatural'],
    status: 'ongoing',
    volumes: 29,
    rating: 8.5,
    description: 'A superhero who can defeat any enemy with a single punch seeks a worthy opponent.',
    amazonLink: 'https://amazon.com/dp/1421585642/?tag=mangacompass-20',
    popularity: 89,
    year: 2012
  },
  {
    id: 'bleach',
    title: 'Bleach',
    author: 'Tite Kubo',
    genres: ['Action', 'Supernatural', 'Adventure'],
    status: 'completed',
    volumes: 74,
    rating: 8.4,
    description: 'A teenager becomes a Soul Reaper to protect the living world from evil spirits.',
    amazonLink: 'https://amazon.com/dp/1421506246/?tag=mangacompass-20',
    popularity: 88,
    year: 2001
  },

  // 少女・女性向け漫画
  {
    id: 'sailor-moon',
    title: 'Sailor Moon',
    author: 'Naoko Takeuchi',
    genres: ['Romance', 'Fantasy', 'Action'],
    status: 'completed',
    volumes: 12,
    rating: 8.3,
    description: 'A teenage girl discovers she is a magical guardian who must protect Earth.',
    amazonLink: 'https://amazon.com/dp/1612620000/?tag=mangacompass-20',
    popularity: 85,
    year: 1991
  },
  {
    id: 'fruits-basket',
    title: 'Fruits Basket',
    author: 'Natsuki Takaya',
    genres: ['Romance', 'Drama', 'Supernatural'],
    status: 'completed',
    volumes: 23,
    rating: 8.7,
    description: 'A girl living with a family cursed to turn into zodiac animals.',
    amazonLink: 'https://amazon.com/dp/159816003X/?tag=mangacompass-20',
    popularity: 82,
    year: 1998
  },
  {
    id: 'ouran-high-school',
    title: 'Ouran High School Host Club',
    author: 'Bisco Hatori',
    genres: ['Romance', 'Comedy', 'School'],
    status: 'completed',
    volumes: 18,
    rating: 8.2,
    description: 'A scholarship student gets involved with the elite Host Club at her prestigious school.',
    amazonLink: 'https://amazon.com/dp/1421505851/?tag=mangacompass-20',
    popularity: 78,
    year: 2002
  },
  {
    id: 'nana',
    title: 'NANA',
    author: 'Ai Yazawa',
    genres: ['Romance', 'Drama', 'Music'],
    status: 'hiatus',
    volumes: 21,
    rating: 8.9,
    description: 'Two young women named Nana with different dreams move to Tokyo.',
    amazonLink: 'https://amazon.com/dp/1421518783/?tag=mangacompass-20',
    popularity: 84,
    year: 2000
  },
  {
    id: 'cardcaptor-sakura',
    title: 'Cardcaptor Sakura',
    author: 'CLAMP',
    genres: ['Fantasy', 'Romance', 'Adventure'],
    status: 'completed',
    volumes: 12,
    rating: 8.5,
    description: 'A young girl must collect magical cards to prevent catastrophe.',
    amazonLink: 'https://amazon.com/dp/1595328637/?tag=mangacompass-20',
    popularity: 83,
    year: 1996
  },

  // 青年漫画
  {
    id: 'berserk',
    title: 'Berserk',
    author: 'Kentaro Miura',
    genres: ['Action', 'Horror', 'Fantasy'],
    status: 'ongoing',
    volumes: 42,
    rating: 9.4,
    description: 'A dark fantasy following the mercenary Guts in a medieval-inspired world.',
    amazonLink: 'https://amazon.com/dp/1593070209/?tag=mangacompass-20',
    popularity: 90,
    year: 1989
  },
  {
    id: 'monster',
    title: 'Monster',
    author: 'Naoki Urasawa',
    genres: ['Thriller', 'Psychological', 'Drama'],
    status: 'completed',
    volumes: 18,
    rating: 9.2,
    description: 'A doctor pursues a former patient who has become a serial killer.',
    amazonLink: 'https://amazon.com/dp/1421569058/?tag=mangacompass-20',
    popularity: 87,
    year: 1994
  },
  {
    id: 'death-note',
    title: 'Death Note',
    author: 'Tsugumi Ohba, Takeshi Obata',
    genres: ['Thriller', 'Supernatural', 'Psychological'],
    status: 'completed',
    volumes: 12,
    rating: 8.8,
    description: 'A high school student finds a notebook that can kill anyone whose name is written in it.',
    amazonLink: 'https://amazon.com/dp/1421501686/?tag=mangacompass-20',
    popularity: 93,
    year: 2003
  },
  {
    id: 'akira',
    title: 'Akira',
    author: 'Katsuhiro Otomo',
    genres: ['Sci-Fi', 'Action', 'Thriller'],
    status: 'completed',
    volumes: 6,
    rating: 8.9,
    description: 'In post-apocalyptic Neo-Tokyo, a biker gang member gains psychic powers.',
    amazonLink: 'https://amazon.com/dp/1935429000/?tag=mangacompass-20',
    popularity: 86,
    year: 1982
  },
  {
    id: 'vinland-saga',
    title: 'Vinland Saga',
    author: 'Makoto Yukimura',
    genres: ['Historical', 'Action', 'Drama'],
    status: 'ongoing',
    volumes: 27,
    rating: 9.0,
    description: 'A young Viking seeks revenge in medieval Europe.',
    amazonLink: 'https://amazon.com/dp/1612624200/?tag=mangacompass-20',
    popularity: 88,
    year: 2005
  },

  // 日常系・コメディ
  {
    id: 'azumanga-daioh',
    title: 'Azumanga Daioh',
    author: 'Kiyohiko Azuma',
    genres: ['Comedy', 'Slice of Life', 'School'],
    status: 'completed',
    volumes: 4,
    rating: 8.1,
    description: 'The daily lives of high school girls and their eccentric teacher.',
    amazonLink: 'https://amazon.com/dp/0316077445/?tag=mangacompass-20',
    popularity: 75,
    year: 1999
  },
  {
    id: 'k-on',
    title: 'K-On!',
    author: 'Kakifly',
    genres: ['Comedy', 'Music', 'Slice of Life'],
    status: 'completed',
    volumes: 4,
    rating: 7.9,
    description: 'High school girls form a light music club.',
    amazonLink: 'https://amazon.com/dp/0316119350/?tag=mangacompass-20',
    popularity: 73,
    year: 2007
  },
  {
    id: 'lucky-star',
    title: 'Lucky Star',
    author: 'Kagami Yoshimizu',
    genres: ['Comedy', 'Slice of Life', 'School'],
    status: 'completed',
    volumes: 10,
    rating: 7.8,
    description: 'The mundane daily lives of four high school girls.',
    amazonLink: 'https://amazon.com/dp/0316119571/?tag=mangacompass-20',
    popularity: 71,
    year: 2004
  },

  // スポーツ漫画
  {
    id: 'slam-dunk',
    title: 'Slam Dunk',
    author: 'Takehiko Inoue',
    genres: ['Sports', 'Drama', 'School'],
    status: 'completed',
    volumes: 31,
    rating: 9.1,
    description: 'A delinquent joins the basketball team to impress a girl.',
    amazonLink: 'https://amazon.com/dp/1421533271/?tag=mangacompass-20',
    popularity: 91,
    year: 1990
  },
  {
    id: 'haikyuu',
    title: 'Haikyuu!!',
    author: 'Haruichi Furudate',
    genres: ['Sports', 'Drama', 'School'],
    status: 'completed',
    volumes: 45,
    rating: 8.8,
    description: 'A short boy dreams of playing volleyball at the highest level.',
    amazonLink: 'https://amazon.com/dp/1421587661/?tag=mangacompass-20',
    popularity: 89,
    year: 2012
  },
  {
    id: 'kuroko-basketball',
    title: "Kuroko's Basketball",
    author: 'Tadatoshi Fujimaki',
    genres: ['Sports', 'School', 'Supernatural'],
    status: 'completed',
    volumes: 30,
    rating: 8.3,
    description: 'A phantom sixth man helps his team reach the top of high school basketball.',
    amazonLink: 'https://amazon.com/dp/1421587629/?tag=mangacompass-20',
    popularity: 85,
    year: 2008
  },

  // ホラー・ミステリー
  {
    id: 'uzumaki',
    title: 'Uzumaki',
    author: 'Junji Ito',
    genres: ['Horror', 'Mystery', 'Supernatural'],
    status: 'completed',
    volumes: 3,
    rating: 8.6,
    description: 'A town becomes obsessed with spirals in this cosmic horror masterpiece.',
    amazonLink: 'https://amazon.com/dp/1421561328/?tag=mangacompass-20',
    popularity: 82,
    year: 1998
  },
  {
    id: 'another',
    title: 'Another',
    author: 'Yukito Ayatsuji, Hiro Kiyohara',
    genres: ['Horror', 'Mystery', 'Supernatural'],
    status: 'completed',
    volumes: 4,
    rating: 8.0,
    description: 'A transfer student uncovers a deadly curse affecting his class.',
    amazonLink: 'https://amazon.com/dp/0316402362/?tag=mangacompass-20',
    popularity: 76,
    year: 2010
  },

  // 料理漫画
  {
    id: 'food-wars',
    title: 'Food Wars!: Shokugeki no Soma',
    author: 'Yuto Tsukuda, Shun Saeki',
    genres: ['Cooking', 'School', 'Comedy'],
    status: 'completed',
    volumes: 36,
    rating: 8.2,
    description: 'A young chef attends an elite culinary school.',
    amazonLink: 'https://amazon.com/dp/1421572540/?tag=mangacompass-20',
    popularity: 83,
    year: 2012
  },

  // メカ・SF
  {
    id: 'ghost-in-shell',
    title: 'Ghost in the Shell',
    author: 'Masamune Shirow',
    genres: ['Sci-Fi', 'Action', 'Thriller'],
    status: 'completed',
    volumes: 3,
    rating: 8.5,
    description: 'A cyborg policewoman hunts hackers in a cyberpunk future.',
    amazonLink: 'https://amazon.com/dp/1935429019/?tag=mangacompass-20',
    popularity: 81,
    year: 1989
  },
  {
    id: 'evangelion',
    title: 'Neon Genesis Evangelion',
    author: 'Yoshiyuki Sadamoto',
    genres: ['Mecha', 'Sci-Fi', 'Psychological'],
    status: 'completed',
    volumes: 14,
    rating: 8.4,
    description: 'Teenagers pilot giant robots to fight mysterious beings called Angels.',
    amazonLink: 'https://amazon.com/dp/1421518805/?tag=mangacompass-20',
    popularity: 87,
    year: 1994
  },

  // 追加の人気作品
  {
    id: 'fullmetal-alchemist',
    title: 'Fullmetal Alchemist',
    author: 'Hiromu Arakawa',
    genres: ['Action', 'Adventure', 'Fantasy'],
    status: 'completed',
    volumes: 27,
    rating: 9.3,
    description: 'Two brothers use alchemy to search for the Philosophers Stone.',
    amazonLink: 'https://amazon.com/dp/1421508388/?tag=mangacompass-20',
    popularity: 94,
    year: 2001
  },
  {
    id: 'tokyo-ghoul',
    title: 'Tokyo Ghoul',
    author: 'Sui Ishida',
    genres: ['Horror', 'Action', 'Supernatural'],
    status: 'completed',
    volumes: 14,
    rating: 8.1,
    description: 'A student becomes half-ghoul and struggles to retain his humanity.',
    amazonLink: 'https://amazon.com/dp/1421580365/?tag=mangacompass-20',
    popularity: 88,
    year: 2011
  },
  {
    id: 'mob-psycho-100',
    title: 'Mob Psycho 100',
    author: 'ONE',
    genres: ['Supernatural', 'Comedy', 'Action'],
    status: 'completed',
    volumes: 16,
    rating: 8.6,
    description: 'A psychic middle schooler tries to live a normal life.',
    amazonLink: 'https://amazon.com/dp/1506706054/?tag=mangacompass-20',
    popularity: 84,
    year: 2012
  },
  {
    id: 'promised-neverland',
    title: 'The Promised Neverland',
    author: 'Kaiu Shirai, Posuka Demizu',
    genres: ['Thriller', 'Drama', 'Mystery'],
    status: 'completed',
    volumes: 20,
    rating: 8.5,
    description: 'Children discover their orphanage is actually a farm.',
    amazonLink: 'https://amazon.com/dp/1421597128/?tag=mangacompass-20',
    popularity: 86,
    year: 2016
  },
  {
    id: 'spirited-away',
    title: 'Spirited Away',
    author: 'Hayao Miyazaki',
    genres: ['Fantasy', 'Adventure', 'Supernatural'],
    status: 'completed',
    volumes: 5,
    rating: 8.8,
    description: 'A girl enters a magical world to save her parents.',
    amazonLink: 'https://amazon.com/dp/1421505975/?tag=mangacompass-20',
    popularity: 90,
    year: 2001
  },
  {
    id: 'cowboy-bebop',
    title: 'Cowboy Bebop',
    author: 'Hajime Yatate, Yutaka Nanten',
    genres: ['Sci-Fi', 'Action', 'Adventure'],
    status: 'completed',
    volumes: 3,
    rating: 8.3,
    description: 'Bounty hunters travel through space in 2071.',
    amazonLink: 'https://amazon.com/dp/1591823676/?tag=mangacompass-20',
    popularity: 79,
    year: 1997
  },
  {
    id: 'princess-mononoke',
    title: 'Princess Mononoke',
    author: 'Hayao Miyazaki',
    genres: ['Fantasy', 'Adventure', 'Historical'],
    status: 'completed',
    volumes: 4,
    rating: 8.7,
    description: 'A prince becomes involved in a war between forest spirits and humans.',
    amazonLink: 'https://amazon.com/dp/1421505932/?tag=mangacompass-20',
    popularity: 85,
    year: 1995
  },
  {
    id: 'chainsaw-man',
    title: 'Chainsaw Man',
    author: 'Tatsuki Fujimoto',
    genres: ['Action', 'Horror', 'Supernatural'],
    status: 'ongoing',
    volumes: 13,
    rating: 8.4,
    description: 'A young man merges with his pet devil to become Chainsaw Man.',
    amazonLink: 'https://amazon.com/dp/1974709930/?tag=mangacompass-20',
    popularity: 89,
    year: 2018
  },
  {
    id: 'spy-family',
    title: 'SPY x FAMILY',
    author: 'Tatsuya Endo',
    genres: ['Comedy', 'Action', 'Family'],
    status: 'ongoing',
    volumes: 11,
    rating: 8.3,
    description: 'A spy creates a fake family for a mission, unknowingly recruiting an assassin wife and telepathic daughter.',
    amazonLink: 'https://amazon.com/dp/1974717410/?tag=mangacompass-20',
    popularity: 92,
    year: 2019
  },
  {
    id: 'your-name',
    title: 'Your Name',
    author: 'Makoto Shinkai, Ranmaru Kotone',
    genres: ['Romance', 'Drama', 'Supernatural'],
    status: 'completed',
    volumes: 3,
    rating: 8.5,
    description: 'Two teenagers share a mysterious connection through their dreams.',
    amazonLink: 'https://amazon.com/dp/1975383664/?tag=mangacompass-20',
    popularity: 87,
    year: 2016
  }
];

// デモ用ユーザーデータ
export const MOCK_USER: User = {
  id: 'demo-user',
  readHistory: ['one-piece', 'naruto', 'attack-on-titan', 'death-note'],
  favoriteGenres: ['Action', 'Adventure', 'Supernatural'],
  preferences: {
    preferredStatus: ['ongoing', 'completed'],
    minRating: 7.0,
    maxVolumes: 50,
    excludeGenres: ['Horror']
  }
};

// ジャンル別人気作品を取得する関数
export function getMangaByGenre(genre: string, limit = 10): Manga[] {
  return MOCK_MANGA
    .filter(manga => manga.genres.includes(genre))
    .sort((a, b) => b.rating - a.rating)
    .slice(0, limit);
}

// 評価順で漫画を取得する関数
export function getTopRatedManga(limit = 10): Manga[] {
  return MOCK_MANGA
    .sort((a, b) => b.rating - a.rating)
    .slice(0, limit);
}

// 人気順で漫画を取得する関数
export function getPopularManga(limit = 10): Manga[] {
  return MOCK_MANGA
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, limit);
}

// 最新作品を取得する関数
export function getRecentManga(limit = 10): Manga[] {
  return MOCK_MANGA
    .filter(manga => manga.year && manga.year >= 2015)
    .sort((a, b) => (b.year || 0) - (a.year || 0))
    .slice(0, limit);
}

// IDで漫画を検索する関数
export function getMangaById(id: string): Manga | undefined {
  return MOCK_MANGA.find(manga => manga.id === id);
}

// タイトルで漫画を検索する関数
export function searchMangaByTitle(query: string): Manga[] {
  const lowercaseQuery = query.toLowerCase();
  return MOCK_MANGA.filter(manga => 
    manga.title.toLowerCase().includes(lowercaseQuery) ||
    manga.author.toLowerCase().includes(lowercaseQuery)
  );
}