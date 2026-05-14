export const ROUTES = {
  home: '/',
  philosophy: '/philosophy',
  rehabilitation: '/rehabilitation',
  territory: '/territory',
  support: '/support',
  constructionDiary: '/construction-diary',
};

export const NAV_ITEMS = [
  { id: 'philosophy', path: ROUTES.philosophy, label: 'Философия' },
  { id: 'rehabilitation', path: ROUTES.rehabilitation, label: 'Реабилитация' },
  { id: 'territory', path: ROUTES.territory, label: 'Территория' },
  { id: 'diary', path: ROUTES.constructionDiary, label: 'Дневник' },
  { id: 'support', path: ROUTES.support, label: 'Инвесторам' },
];

export const MOBILE_NAV_ITEMS = [
  { id: 'home', path: ROUTES.home, label: 'Главная' },
  ...NAV_ITEMS,
];

export const FOOTER_NAV_LINKS = [
  { path: ROUTES.philosophy, label: 'Философия' },
  { path: ROUTES.rehabilitation, label: 'Реабилитация' },
  { path: ROUTES.territory, label: 'Территория' },
  { path: ROUTES.constructionDiary, label: 'Дневник стройки' },
  { path: ROUTES.support, label: 'Инвесторам' },
];
