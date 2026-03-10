import type { Show, ShowDetail, CastMember, Episode } from '@/types/show'

export const sampleShow: Show = {
  id: 169,
  name: 'Breaking Bad',
  genres: ['Drama', 'Crime', 'Thriller'],
  rating: { average: 9.2 },
  image: {
    medium: 'https://static.tvmaze.com/uploads/images/medium_portrait/501/1253519.jpg',
    original: 'https://static.tvmaze.com/uploads/images/original_untouched/501/1253519.jpg',
  },
  summary: '<p>A high school chemistry teacher diagnosed with inoperable lung cancer turns to manufacturing and selling methamphetamine in order to secure his family\'s future.</p>',
  language: 'English',
  premiered: '2008-01-20',
  ended: '2013-09-29',
  status: 'Ended',
  officialSite: 'http://www.amc.com/shows/breaking-bad',
  network: { name: 'AMC' },
  runtime: 60,
}

export const sampleShowRunning: Show = {
  id: 82,
  name: 'Game of Thrones',
  genres: ['Drama', 'Adventure', 'Fantasy'],
  rating: { average: 8.9 },
  image: {
    medium: 'https://static.tvmaze.com/uploads/images/medium_portrait/498/1245274.jpg',
    original: 'https://static.tvmaze.com/uploads/images/original_untouched/498/1245274.jpg',
  },
  summary: '<p>Based on the bestselling book series by George R.R. Martin.</p>',
  language: 'English',
  premiered: '2011-04-17',
  ended: null,
  status: 'Running',
  officialSite: 'http://www.hbo.com/game-of-thrones',
  network: { name: 'HBO' },
  runtime: 60,
}

export const sampleShowNoImage: Show = {
  id: 999,
  name: 'Unknown Show',
  genres: [],
  rating: { average: null },
  image: null,
  summary: null,
  language: null,
  premiered: null,
  ended: null,
  status: null,
  officialSite: null,
  network: null,
  runtime: null,
}

export const sampleShowLowRating: Show = {
  id: 998,
  name: 'Low Rated Show',
  genres: ['Comedy'],
  rating: { average: 4.5 },
  image: null,
  summary: '<p>A show that did not do well.</p>',
  language: 'English',
  premiered: '2020-01-01',
  ended: null,
  status: 'Running',
  officialSite: null,
  network: { name: 'Netflix' },
  runtime: 30,
}

export const sampleCast: CastMember[] = [
  {
    person: { id: 1, name: 'Bryan Cranston', image: { medium: 'https://static.tvmaze.com/uploads/images/medium_portrait/195/488839.jpg', original: null } },
    character: { id: 1, name: 'Walter White' },
  },
  {
    person: { id: 2, name: 'Aaron Paul', image: { medium: 'https://static.tvmaze.com/uploads/images/medium_portrait/264/660079.jpg', original: null } },
    character: { id: 2, name: 'Jesse Pinkman' },
  },
  {
    person: { id: 3, name: 'Anna Gunn', image: { medium: 'https://static.tvmaze.com/uploads/images/medium_portrait/2/6596.jpg', original: null } },
    character: { id: 3, name: 'Skyler White' },
  },
  {
    person: { id: 4, name: 'RJ Mitte', image: { medium: 'https://static.tvmaze.com/uploads/images/medium_portrait/3/8601.jpg', original: null } },
    character: { id: 4, name: 'Walter White Jr.' },
  },
]

export const sampleEpisodes: Episode[] = [
  { id: 1, name: 'Pilot', season: 1, number: 1, airdate: '2008-01-20', runtime: 58, summary: '<p>Pilot episode.</p>', image: null },
  { id: 2, name: "Cat's in the Bag...", season: 1, number: 2, airdate: '2008-01-27', runtime: 48, summary: null, image: null },
  { id: 3, name: '...And the Bag\'s in the River', season: 1, number: 3, airdate: '2008-02-10', runtime: 48, summary: null, image: null },
  { id: 4, name: 'Seven Thirty-Seven', season: 2, number: 1, airdate: '2009-03-08', runtime: 47, summary: null, image: null },
  { id: 5, name: 'Grilled', season: 2, number: 2, airdate: '2009-03-15', runtime: 46, summary: null, image: null },
  { id: 6, name: 'No Mas', season: 3, number: 1, airdate: '2010-03-21', runtime: 47, summary: null, image: null },
]

export const sampleSeasonMap = new Map<number, Episode[]>([
  [1, sampleEpisodes.filter(e => e.season === 1)],
  [2, sampleEpisodes.filter(e => e.season === 2)],
  [3, sampleEpisodes.filter(e => e.season === 3)],
])

export const sampleShowDetail: ShowDetail = {
  ...sampleShow,
  _embedded: {
    cast: sampleCast,
    episodes: sampleEpisodes,
  },
}

export const sampleShows: Show[] = [
  sampleShow,
  sampleShowRunning,
  sampleShowLowRating,
  { ...sampleShow, id: 179, name: 'The Wire', genres: ['Drama', 'Crime'], rating: { average: 8.8 }, network: { name: 'HBO' }, image: { medium: 'https://static.tvmaze.com/uploads/images/medium_portrait/504/1260189.jpg', original: null } },
  { ...sampleShow, id: 527, name: 'The Sopranos', genres: ['Drama', 'Crime'], rating: { average: 8.6 }, network: { name: 'HBO' }, image: { medium: 'https://static.tvmaze.com/uploads/images/medium_portrait/4/11341.jpg', original: null } },
  { ...sampleShow, id: 618, name: 'Better Call Saul', genres: ['Drama', 'Crime'], rating: { average: 8.5 }, network: { name: 'AMC' }, image: { medium: 'https://static.tvmaze.com/uploads/images/medium_portrait/501/1253515.jpg', original: null } },
  { ...sampleShow, id: 13417, name: 'Ozark', genres: ['Drama', 'Crime', 'Thriller'], rating: { average: 8.1 }, network: { name: 'Netflix' }, image: { medium: 'https://static.tvmaze.com/uploads/images/medium_portrait/398/996611.jpg', original: null } },
  { ...sampleShow, id: 32, name: 'Fargo', genres: ['Drama', 'Crime'], rating: { average: 8.7 }, network: { name: 'FX' }, image: { medium: 'https://static.tvmaze.com/uploads/images/medium_portrait/487/1219631.jpg', original: null } },
]
