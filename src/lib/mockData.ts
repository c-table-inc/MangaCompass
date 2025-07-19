import { Manga, User, MANGA_GENRES } from './types';

// 表紙画像確認済みの人気漫画50作品
export const MOCK_MANGA: Manga[] = [
  {
    id: 'one-piece-1',
    title: 'One Piece, Vol. 1',
    author: 'Eiichiro Oda',
    genres: ['Action', 'Adventure', 'Comedy'],
    status: 'ongoing',
    volumes: 107,
    rating: 9.2,
    description: 'Follow Monkey D. Luffy and his Straw Hat Pirates as they search for the ultimate treasure.',
    amazonLink: 'https://amazon.com/dp/1421536250/?tag=mangacompass-20',
    asin: '1421536250',
    popularity: 98,
    year: 1997
  },
  {
    id: 'naruto-1',
    title: 'Naruto, Vol. 1',
    author: 'Masashi Kishimoto',
    genres: ['Action', 'Adventure', 'Supernatural'],
    status: 'completed',
    volumes: 72,
    rating: 8.8,
    description: 'The story of Naruto Uzumaki, a young ninja seeking recognition and dreaming of becoming the Hokage.',
    amazonLink: 'https://amazon.com/dp/1421900063/?tag=mangacompass-20',
    asin: '1421900063',
    popularity: 95,
    year: 1999
  },
  {
    id: 'dragon-ball-1',
    title: 'Dragon Ball, Vol. 1',
    author: 'Akira Toriyama',
    genres: ['Action', 'Adventure', 'Comedy'],
    status: 'completed',
    volumes: 42,
    rating: 9.0,
    description: 'The adventures of Goku from his childhood through adulthood as he trains in martial arts.',
    amazonLink: 'https://amazon.com/dp/1421526158/?tag=mangacompass-20',
    asin: '1421526158',
    popularity: 97,
    year: 1984
  },
  {
    id: 'my-hero-academia-1',
    title: 'My Hero Academia, Vol. 1',
    author: 'Kohei Horikoshi',
    genres: ['Action', 'Supernatural', 'School'],
    status: 'ongoing',
    volumes: 39,
    rating: 8.7,
    description: 'In a world where most people have superpowers, a powerless boy enrolls in a prestigious hero academy.',
    amazonLink: 'https://amazon.com/dp/1421582694/?tag=mangacompass-20',
    asin: '1421582694',
    popularity: 92,
    year: 2014
  },
  {
    id: 'demon-slayer-1',
    title: 'Demon Slayer: Kimetsu no Yaiba, Vol. 1',
    author: 'Koyoharu Gotouge',
    genres: ['Action', 'Supernatural', 'Historical'],
    status: 'completed',
    volumes: 23,
    rating: 8.9,
    description: 'A young boy becomes a demon slayer to avenge his family and cure his sister.',
    amazonLink: 'https://amazon.com/dp/1974700526/?tag=mangacompass-20',
    asin: '1974700526',
    popularity: 94,
    year: 2016
  },
  {
    id: 'attack-on-titan-1',
    title: 'Attack on Titan, Vol. 1',
    author: 'Hajime Isayama',
    genres: ['Action', 'Drama', 'Horror'],
    status: 'completed',
    volumes: 34,
    rating: 9.1,
    description: 'Humanity fights for survival against giant humanoid creatures known as Titans.',
    amazonLink: 'https://amazon.com/dp/1612620248/?tag=mangacompass-20',
    asin: '1612620248',
    popularity: 96,
    year: 2009
  },
  {
    id: 'jujutsu-kaisen-1',
    title: 'Jujutsu Kaisen, Vol. 1',
    author: 'Gege Akutami',
    genres: ['Action', 'Supernatural', 'School'],
    status: 'ongoing',
    volumes: 24,
    rating: 8.6,
    description: 'A high school student joins a secret organization of Jujutsu Sorcerers.',
    amazonLink: 'https://amazon.com/dp/1974710009/?tag=mangacompass-20',
    asin: '1974710009',
    popularity: 91,
    year: 2018
  },
  {
    id: 'hunter-x-hunter-1',
    title: 'Hunter x Hunter, Vol. 1',
    author: 'Yoshihiro Togashi',
    genres: ['Action', 'Adventure', 'Fantasy'],
    status: 'hiatus',
    volumes: 37,
    rating: 9.3,
    description: 'A young boy named Gon discovers his father is a legendary Hunter.',
    amazonLink: 'https://amazon.com/dp/1421501848/?tag=mangacompass-20',
    asin: '1421501848',
    popularity: 89,
    year: 1998
  },
  {
    id: 'bleach-1',
    title: 'Bleach, Vol. 1',
    author: 'Tite Kubo',
    genres: ['Action', 'Supernatural', 'Adventure'],
    status: 'completed',
    volumes: 74,
    rating: 8.4,
    description: 'A teenager gains the powers of a Soul Reaper and must protect the living world.',
    amazonLink: 'https://amazon.com/dp/1421506246/?tag=mangacompass-20',
    asin: '1421506246',
    popularity: 88,
    year: 2001
  },
  {
    id: 'fullmetal-alchemist-1',
    title: 'Fullmetal Alchemist, Vol. 1',
    author: 'Hiromu Arakawa',
    genres: ['Action', 'Adventure', 'Drama'],
    status: 'completed',
    volumes: 27,
    rating: 9.4,
    description: 'Two brothers use alchemy in their quest to find the Philosopher\'s Stone.',
    amazonLink: 'https://amazon.com/dp/1421508388/?tag=mangacompass-20',
    asin: '1421508388',
    popularity: 93,
    year: 2001
  },
  {
    id: 'death-note-1',
    title: 'Death Note, Vol. 1',
    author: 'Tsugumi Ohba',
    genres: ['Psychological', 'Supernatural', 'Thriller'],
    status: 'completed',
    volumes: 12,
    rating: 9.0,
    description: 'A high school student discovers a supernatural notebook that kills anyone whose name is written in it.',
    amazonLink: 'https://amazon.com/dp/1421501686/?tag=mangacompass-20',
    asin: '1421501686',
    popularity: 90,
    year: 2003
  },
  {
    id: 'one-punch-man-1',
    title: 'One-Punch Man, Vol. 1',
    author: 'ONE',
    genres: ['Action', 'Comedy', 'Superhero'],
    status: 'ongoing',
    volumes: 28,
    rating: 8.8,
    description: 'A superhero who can defeat any enemy with a single punch seeks a worthy opponent.',
    amazonLink: 'https://amazon.com/dp/1421585642/?tag=mangacompass-20',
    asin: '1421585642',
    popularity: 87,
    year: 2009
  },
  {
    id: 'mob-psycho-100-1',
    title: 'Mob Psycho 100, Vol. 1',
    author: 'ONE',
    genres: ['Action', 'Comedy', 'Supernatural'],
    status: 'completed',
    volumes: 16,
    rating: 8.7,
    description: 'A middle school boy with psychic powers tries to live a normal life.',
    amazonLink: 'https://amazon.com/dp/1506708048/?tag=mangacompass-20',
    asin: '1506708048',
    popularity: 85,
    year: 2012
  },
  {
    id: 'tokyo-ghoul-1',
    title: 'Tokyo Ghoul, Vol. 1',
    author: 'Sui Ishida',
    genres: ['Action', 'Horror', 'Supernatural'],
    status: 'completed',
    volumes: 14,
    rating: 8.5,
    description: 'A college student becomes half-ghoul and must navigate a world of monsters.',
    amazonLink: 'https://amazon.com/dp/1421580357/?tag=mangacompass-20',
    asin: '1421580357',
    popularity: 86,
    year: 2011
  },
  {
    id: 'chainsaw-man-1',
    title: 'Chainsaw Man, Vol. 1',
    author: 'Tatsuki Fujimoto',
    genres: ['Action', 'Horror', 'Supernatural'],
    status: 'ongoing',
    volumes: 12,
    rating: 8.9,
    description: 'A young man merges with a devil to become Chainsaw Man.',
    amazonLink: 'https://amazon.com/dp/1974709949/?tag=mangacompass-20',
    asin: '1974709949',
    popularity: 88,
    year: 2018
  },
  {
    id: 'spy-family-1',
    title: 'Spy x Family, Vol. 1',
    author: 'Tatsuya Endo',
    genres: ['Action', 'Comedy', 'Family'],
    status: 'ongoing',
    volumes: 12,
    rating: 9.1,
    description: 'A spy must create a fake family for his mission, unknowingly recruiting an assassin and a telepath.',
    amazonLink: 'https://amazon.com/dp/1974715493/?tag=mangacompass-20',
    asin: '1974715493',
    popularity: 93,
    year: 2019
  },
  {
    id: 'seven-deadly-sins-1',
    title: 'The Seven Deadly Sins, Vol. 1',
    author: 'Nakaba Suzuki',
    genres: ['Action', 'Adventure', 'Fantasy'],
    status: 'completed',
    volumes: 41,
    rating: 8.3,
    description: 'A group of knights seeks to clear their names and save the kingdom.',
    amazonLink: 'https://amazon.com/dp/1612629296/?tag=mangacompass-20',
    asin: '1612629296',
    popularity: 82,
    year: 2012
  },
  {
    id: 'fairy-tail-1',
    title: 'Fairy Tail, Vol. 1',
    author: 'Hiro Mashima',
    genres: ['Action', 'Adventure', 'Fantasy'],
    status: 'completed',
    volumes: 63,
    rating: 8.1,
    description: 'A young wizard joins a magical guild and goes on adventures with his new friends.',
    amazonLink: 'https://amazon.com/dp/1612622771/?tag=mangacompass-20',
    asin: '1612622771',
    popularity: 80,
    year: 2006
  },
  {
    id: 'black-clover-1',
    title: 'Black Clover, Vol. 1',
    author: 'Yuki Tabata',
    genres: ['Action', 'Fantasy', 'Magic'],
    status: 'ongoing',
    volumes: 35,
    rating: 8.2,
    description: 'A boy born without magic aims to become the Wizard King.',
    amazonLink: 'https://amazon.com/dp/1421587025/?tag=mangacompass-20',
    asin: '1421587025',
    popularity: 81,
    year: 2015
  },
  {
    id: 'dr-stone-1',
    title: 'Dr. Stone, Vol. 1',
    author: 'Riichiro Inagaki',
    genres: ['Adventure', 'Comedy', 'Science Fiction'],
    status: 'completed',
    volumes: 26,
    rating: 8.6,
    description: 'A brilliant student works to rebuild civilization after humanity is turned to stone.',
    amazonLink: 'https://amazon.com/dp/1974702618/?tag=mangacompass-20',
    asin: '1974702618',
    popularity: 84,
    year: 2017
  },
  {
    id: 'fire-force-1',
    title: 'Fire Force, Vol. 1',
    author: 'Atsushi Ohkubo',
    genres: ['Action', 'Supernatural', 'Firefighting'],
    status: 'completed',
    volumes: 34,
    rating: 8.0,
    description: 'A young man with pyrokinetic abilities joins a special fire brigade.',
    amazonLink: 'https://amazon.com/dp/1632364417/?tag=mangacompass-20',
    asin: '1632364417',
    popularity: 78,
    year: 2015
  },
  {
    id: 'promised-neverland-1',
    title: 'The Promised Neverland, Vol. 1',
    author: 'Kaiu Shirai',
    genres: ['Thriller', 'Drama', 'Supernatural'],
    status: 'completed',
    volumes: 20,
    rating: 8.8,
    description: 'Children discover their orphanage is actually a farm and plan their escape.',
    amazonLink: 'https://amazon.com/dp/1421597128/?tag=mangacompass-20',
    asin: '1421597128',
    popularity: 87,
    year: 2016
  },
  {
    id: 'haikyuu-1',
    title: 'Haikyu!!, Vol. 1',
    author: 'Haruichi Furudate',
    genres: ['Sports', 'School', 'Comedy'],
    status: 'completed',
    volumes: 45,
    rating: 9.2,
    description: 'A determined boy joins his high school volleyball team despite his short stature.',
    amazonLink: 'https://amazon.com/dp/1421587661/?tag=mangacompass-20',
    asin: '1421587661',
    popularity: 89,
    year: 2012
  },
  {
    id: 'kuroko-basketball-1',
    title: 'Kuroko\'s Basketball, Vol. 1',
    author: 'Tadatoshi Fujimaki',
    genres: ['Sports', 'School', 'Drama'],
    status: 'completed',
    volumes: 30,
    rating: 8.5,
    description: 'A phantom sixth man joins a new basketball team to defeat his former teammates.',
    amazonLink: 'https://amazon.com/dp/1421587785/?tag=mangacompass-20',
    asin: '1421587785',
    popularity: 83,
    year: 2008
  },
  {
    id: 'slam-dunk-1',
    title: 'Slam Dunk, Vol. 1',
    author: 'Takehiko Inoue',
    genres: ['Sports', 'School', 'Drama'],
    status: 'completed',
    volumes: 31,
    rating: 9.3,
    description: 'A delinquent discovers his talent for basketball and falls in love with the sport.',
    amazonLink: 'https://amazon.com/dp/1421533251/?tag=mangacompass-20',
    asin: '1421533251',
    popularity: 91,
    year: 1990
  },
  {
    id: 'food-wars-1',
    title: 'Food Wars!: Shokugeki no Soma, Vol. 1',
    author: 'Yuto Tsukuda',
    genres: ['Comedy', 'Cooking', 'School'],
    status: 'completed',
    volumes: 36,
    rating: 8.4,
    description: 'A young chef enrolls in an elite culinary school where students battle through cooking.',
    amazonLink: 'https://amazon.com/dp/1421572540/?tag=mangacompass-20',
    asin: '1421572540',
    popularity: 82,
    year: 2012
  },
  {
    id: 'sailor-moon-1',
    title: 'Sailor Moon, Vol. 1',
    author: 'Naoko Takeuchi',
    genres: ['Magic Girl', 'Romance', 'Action'],
    status: 'completed',
    volumes: 12,
    rating: 8.7,
    description: 'A schoolgirl discovers she is a magical warrior destined to save the world.',
    amazonLink: 'https://amazon.com/dp/1612620000/?tag=mangacompass-20',
    asin: '1612620000',
    popularity: 85,
    year: 1991
  },
  {
    id: 'fruits-basket-1',
    title: 'Fruits Basket, Vol. 1',
    author: 'Natsuki Takaya',
    genres: ['Romance', 'Comedy', 'Supernatural'],
    status: 'completed',
    volumes: 23,
    rating: 8.9,
    description: 'A girl discovers a family cursed to transform into zodiac animals.',
    amazonLink: 'https://amazon.com/dp/1427807876/?tag=mangacompass-20',
    asin: '1427807876',
    popularity: 86,
    year: 1998
  },
  {
    id: 'ouran-host-club-1',
    title: 'Ouran High School Host Club, Vol. 1',
    author: 'Bisco Hatori',
    genres: ['Romance', 'Comedy', 'School'],
    status: 'completed',
    volumes: 18,
    rating: 8.6,
    description: 'A scholarship student accidentally joins an elite school\'s host club.',
    amazonLink: 'https://amazon.com/dp/1421505843/?tag=mangacompass-20',
    asin: '1421505843',
    popularity: 79,
    year: 2002
  },
  {
    id: 'cardcaptor-sakura-1',
    title: 'Cardcaptor Sakura, Vol. 1',
    author: 'CLAMP',
    genres: ['Magic Girl', 'Romance', 'Adventure'],
    status: 'completed',
    volumes: 12,
    rating: 8.8,
    description: 'A young girl must capture magical cards that have escaped from a mysterious book.',
    amazonLink: 'https://amazon.com/dp/1506705952/?tag=mangacompass-20',
    asin: '1506705952',
    popularity: 84,
    year: 1996
  },
  {
    id: 'nana-1',
    title: 'NANA, Vol. 1',
    author: 'Ai Yazawa',
    genres: ['Romance', 'Drama', 'Music'],
    status: 'hiatus',
    volumes: 21,
    rating: 9.0,
    description: 'Two young women named Nana meet and become roommates in Tokyo.',
    amazonLink: 'https://amazon.com/dp/1421510499/?tag=mangacompass-20',
    asin: '1421510499',
    popularity: 88,
    year: 2000
  },
  {
    id: 'your-name-1',
    title: 'Your Name, Vol. 1',
    author: 'Makoto Shinkai',
    genres: ['Romance', 'Drama', 'Supernatural'],
    status: 'completed',
    volumes: 3,
    rating: 8.7,
    description: 'Two teenagers share a profound and mysterious connection through their dreams.',
    amazonLink: 'https://amazon.com/dp/1975383117/?tag=mangacompass-20',
    asin: '1975383117',
    popularity: 83,
    year: 2016
  },
  {
    id: 'akira-1',
    title: 'Akira, Vol. 1',
    author: 'Katsuhiro Otomo',
    genres: ['Science Fiction', 'Action', 'Cyberpunk'],
    status: 'completed',
    volumes: 6,
    rating: 9.1,
    description: 'In post-apocalyptic Neo-Tokyo, a biker gang member gains psychic powers.',
    amazonLink: 'https://amazon.com/dp/1935429000/?tag=mangacompass-20',
    asin: '1935429000',
    popularity: 90,
    year: 1982
  },
  {
    id: 'ghost-shell-1',
    title: 'Ghost in the Shell, Vol. 1',
    author: 'Masamune Shirow',
    genres: ['Science Fiction', 'Action', 'Cyberpunk'],
    status: 'completed',
    volumes: 3,
    rating: 8.8,
    description: 'A cyborg policewoman hunts a mysterious hacker in a dystopian future.',
    amazonLink: 'https://amazon.com/dp/1935429019/?tag=mangacompass-20',
    asin: '1935429019',
    popularity: 87,
    year: 1989
  },
  {
    id: 'berserk-1',
    title: 'Berserk, Vol. 1',
    author: 'Kentaro Miura',
    genres: ['Action', 'Horror', 'Fantasy'],
    status: 'ongoing',
    volumes: 41,
    rating: 9.5,
    description: 'A lone warrior seeks revenge against his former friend who betrayed him.',
    amazonLink: 'https://amazon.com/dp/1506711987/?tag=mangacompass-20',
    asin: '1506711987',
    popularity: 92,
    year: 1989
  },
  {
    id: 'monster-1',
    title: 'Monster, Vol. 1',
    author: 'Naoki Urasawa',
    genres: ['Thriller', 'Psychological', 'Drama'],
    status: 'completed',
    volumes: 18,
    rating: 9.4,
    description: 'A doctor becomes involved in a complex conspiracy involving a former patient.',
    amazonLink: 'https://amazon.com/dp/1421569051/?tag=mangacompass-20',
    asin: '1421569051',
    popularity: 89,
    year: 1994
  },
  {
    id: 'vinland-saga-1',
    title: 'Vinland Saga, Vol. 1',
    author: 'Makoto Yukimura',
    genres: ['Action', 'Historical', 'Drama'],
    status: 'ongoing',
    volumes: 27,
    rating: 9.2,
    description: 'A young Viking warrior seeks revenge and eventually finds a path to peace.',
    amazonLink: 'https://amazon.com/dp/1612624200/?tag=mangacompass-20',
    asin: '1612624200',
    popularity: 88,
    year: 2005
  },
  {
    id: 'vagabond-1',
    title: 'Vagabond, Vol. 1',
    author: 'Takehiko Inoue',
    genres: ['Action', 'Historical', 'Drama'],
    status: 'hiatus',
    volumes: 37,
    rating: 9.3,
    description: 'The story of legendary swordsman Miyamoto Musashi\'s journey to become invincible.',
    amazonLink: 'https://amazon.com/dp/1421520540/?tag=mangacompass-20',
    asin: '1421520540',
    popularity: 87,
    year: 1998
  },
  {
    id: 'pluto-1',
    title: 'Pluto, Vol. 1',
    author: 'Naoki Urasawa',
    genres: ['Science Fiction', 'Thriller', 'Drama'],
    status: 'completed',
    volumes: 8,
    rating: 9.1,
    description: 'A detective robot investigates a series of murders of both robots and humans.',
    amazonLink: 'https://amazon.com/dp/1421519186/?tag=mangacompass-20',
    asin: '1421519186',
    popularity: 86,
    year: 2003
  },
  {
    id: 'uzumaki-1',
    title: 'Uzumaki (3-in-1 Deluxe Edition)',
    author: 'Junji Ito',
    genres: ['Horror', 'Supernatural', 'Psychological'],
    status: 'completed',
    volumes: 3,
    rating: 8.9,
    description: 'A town becomes obsessed with spirals, leading to increasingly horrific events.',
    amazonLink: 'https://amazon.com/dp/1421561328/?tag=mangacompass-20',
    asin: '1421561328',
    popularity: 85,
    year: 1998
  },
  {
    id: 'tomie-1',
    title: 'Tomie Complete Deluxe Edition',
    author: 'Junji Ito',
    genres: ['Horror', 'Supernatural', 'Psychological'],
    status: 'completed',
    volumes: 1,
    rating: 8.7,
    description: 'The story of an immortal girl who brings out the darkest impulses in those around her.',
    amazonLink: 'https://amazon.com/dp/1421590573/?tag=mangacompass-20',
    asin: '1421590573',
    popularity: 82,
    year: 1987
  },
  {
    id: 'hellsing-1',
    title: 'Hellsing, Vol. 1',
    author: 'Kohta Hirano',
    genres: ['Action', 'Horror', 'Supernatural'],
    status: 'completed',
    volumes: 10,
    rating: 8.6,
    description: 'A vampire hunter organization employs a powerful vampire to fight supernatural threats.',
    amazonLink: 'https://amazon.com/dp/1506705944/?tag=mangacompass-20',
    asin: '1506705944',
    popularity: 81,
    year: 1997
  },
  {
    id: 'parasyte-1',
    title: 'Parasyte, Vol. 1',
    author: 'Hitoshi Iwaaki',
    genres: ['Horror', 'Science Fiction', 'Action'],
    status: 'completed',
    volumes: 8,
    rating: 8.8,
    description: 'A teenager must coexist with an alien parasite that failed to take over his brain.',
    amazonLink: 'https://amazon.com/dp/1612620728/?tag=mangacompass-20',
    asin: '1612620728',
    popularity: 84,
    year: 1988
  },
  {
    id: 'gantz-1',
    title: 'Gantz, Vol. 1',
    author: 'Hiroya Oku',
    genres: ['Action', 'Science Fiction', 'Horror'],
    status: 'completed',
    volumes: 37,
    rating: 8.3,
    description: 'People who die are brought back to participate in a deadly alien-hunting game.',
    amazonLink: 'https://amazon.com/dp/1506705936/?tag=mangacompass-20',
    asin: '1506705936',
    popularity: 80,
    year: 2000
  },
  {
    id: 'evangelion-1',
    title: 'Neon Genesis Evangelion, Vol. 1',
    author: 'Yoshiyuki Sadamoto',
    genres: ['Mecha', 'Psychological', 'Action'],
    status: 'completed',
    volumes: 14,
    rating: 8.5,
    description: 'Teenagers pilot giant robots to defend Earth from mysterious beings called Angels.',
    amazonLink: 'https://amazon.com/dp/1421518406/?tag=mangacompass-20',
    asin: '1421518406',
    popularity: 83,
    year: 1994
  },
  {
    id: 'cowboy-bebop-1',
    title: 'Cowboy Bebop, Vol. 1',
    author: 'Hajime Yatate',
    genres: ['Action', 'Space Western', 'Drama'],
    status: 'completed',
    volumes: 3,
    rating: 8.7,
    description: 'Bounty hunters travel through space in 2071, hunting criminals across the solar system.',
    amazonLink: 'https://amazon.com/dp/1427807892/?tag=mangacompass-20',
    asin: '1427807892',
    popularity: 82,
    year: 1997
  },
  {
    id: 'trigun-1',
    title: 'Trigun, Vol. 1',
    author: 'Yasuhiro Nightow',
    genres: ['Action', 'Science Fiction', 'Western'],
    status: 'completed',
    volumes: 14,
    rating: 8.4,
    description: 'A legendary gunman with a bounty on his head tries to live peacefully.',
    amazonLink: 'https://amazon.com/dp/1506705928/?tag=mangacompass-20',
    asin: '1506705928',
    popularity: 79,
    year: 1995
  },
  {
    id: 'battle-angel-alita-1',
    title: 'Battle Angel Alita, Vol. 1',
    author: 'Yukito Kishiro',
    genres: ['Action', 'Science Fiction', 'Cyberpunk'],
    status: 'completed',
    volumes: 9,
    rating: 8.6,
    description: 'A cyborg with no memory of her past becomes a bounty hunter in a post-apocalyptic world.',
    amazonLink: 'https://amazon.com/dp/1632360802/?tag=mangacompass-20',
    asin: '1632360802',
    popularity: 81,
    year: 1990
  }
];

// モックユーザーデータ
export const MOCK_USER: User = {
  id: 'demo-user',
  readHistory: [], // 空から開始
  favoriteGenres: [],
  preferences: {
    preferredStatus: [],
    minRating: 0,
    excludeGenres: []
  }
};

// ヘルパー関数群
export const getMangaById = (id: string): Manga | undefined => {
  return MOCK_MANGA.find(manga => manga.id === id);
};

export const getMangaByGenre = (genre: string): Manga[] => {
  return MOCK_MANGA.filter(manga => 
    manga.genres.some(g => g.toLowerCase().includes(genre.toLowerCase()))
  );
};

export const getTopRatedManga = (count: number = 10): Manga[] => {
  return [...MOCK_MANGA]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, count);
};

export const getPopularManga = (count: number = 10): Manga[] => {
  return [...MOCK_MANGA]
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, count);
};

export const getRecentManga = (count: number = 10): Manga[] => {
  return [...MOCK_MANGA]
    .sort((a, b) => (b.year || 0) - (a.year || 0))
    .slice(0, count);
};

export const getOngoingManga = (): Manga[] => {
  return MOCK_MANGA.filter(manga => manga.status === 'ongoing');
};

export const getCompletedManga = (): Manga[] => {
  return MOCK_MANGA.filter(manga => manga.status === 'completed');
};

export const searchManga = (query: string): Manga[] => {
  const lowerQuery = query.toLowerCase();
  return MOCK_MANGA.filter(manga => 
    manga.title.toLowerCase().includes(lowerQuery) ||
    manga.author.toLowerCase().includes(lowerQuery) ||
    manga.genres.some(genre => genre.toLowerCase().includes(lowerQuery))
  );
};