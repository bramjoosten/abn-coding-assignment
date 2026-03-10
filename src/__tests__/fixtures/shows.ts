import type { Show, ShowDetail, SearchResult, CastMember, Episode } from '@/types/show'

export const mockShow: Show = {
  id: 1,
  name: 'Breaking Bad',
  genres: ['Drama', 'Crime'],
  rating: { average: 9.2 },
  image: { medium: 'https://example.com/bb-medium.jpg', original: 'https://example.com/bb-original.jpg' },
  summary: '<p>A chemistry teacher turned meth cook.</p>',
  language: 'English',
  premiered: '2008-01-20',
  ended: '2013-09-29',
  status: 'Ended',
  officialSite: 'https://www.amc.com/breakingbad',
  network: { name: 'AMC' },
  runtime: 60,
}

export const mockShowNoImage: Show = {
  id: 2,
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

export const mockShowLowRating: Show = {
  id: 3,
  name: 'Low Rated Show',
  genres: ['Comedy'],
  rating: { average: 4.5 },
  image: { medium: 'https://example.com/lr.jpg', original: null },
  summary: '<p>Not great.</p>',
  language: 'English',
  premiered: '2020-01-01',
  ended: null,
  status: 'Running',
  officialSite: null,
  network: { name: 'Netflix' },
  runtime: 30,
}

export const mockShowMidRating: Show = {
  id: 4,
  name: 'Mid Rated Show',
  genres: ['Drama'],
  rating: { average: 7.0 },
  image: { medium: 'https://example.com/mr.jpg', original: null },
  summary: '<p>Decent.</p>',
  language: 'English',
  premiered: '2019-05-15',
  ended: null,
  status: 'Running',
  officialSite: null,
  network: { name: 'HBO' },
  runtime: 45,
}

export const mockCast: CastMember[] = [
  {
    person: { id: 1, name: 'Bryan Cranston', image: { medium: 'https://example.com/bc.jpg', original: null } },
    character: { id: 1, name: 'Walter White' },
  },
  {
    person: { id: 2, name: 'Aaron Paul', image: null },
    character: { id: 2, name: 'Jesse Pinkman' },
  },
]

export const mockEpisodes: Episode[] = [
  { id: 1, name: 'Pilot', season: 1, number: 1, airdate: '2008-01-20', runtime: 58, summary: '<p>Pilot episode.</p>', image: null },
  { id: 2, name: 'Cat\'s in the Bag...', season: 1, number: 2, airdate: '2008-01-27', runtime: 48, summary: null, image: null },
  { id: 3, name: 'Seven Thirty-Seven', season: 2, number: 1, airdate: '2009-03-08', runtime: 47, summary: null, image: null },
]

export const mockShowDetail: ShowDetail = {
  ...mockShow,
  _embedded: {
    cast: mockCast,
    episodes: mockEpisodes,
  },
}

export const mockSearchResults: SearchResult[] = [
  { score: 0.95, show: mockShow },
  { score: 0.7, show: mockShowLowRating },
]
