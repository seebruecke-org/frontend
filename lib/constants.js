export const RETURN_CODES = {
  NOT_FOUND: 'not-found',
  REDIRECT: 'redirect',
};

export const MENU_LOCATIONS = {
  de: {
    header: 'MENU',
    headerSecondary: 'MENU_SECONDARY',
    footerTakePart: 'FOOTER_MENU_TAKE_PART',
    footerAbout: 'FOOTER_MENU_ABOUT',
    footerMeta: 'FOOTER_MENU_META'
  },

  en: {
    header: 'MENU___EN',
    headerSecondary: 'MENU_SECONDARY___EN',
    footerTakePart: 'FOOTER_MENU_TAKE_PART___EN',
    footerAbout: 'FOOTER_MENU_ABOUT___EN',
    footerMeta: 'FOOTER_MENU_META___EN'
  }
}

export const SLUG_REWRITES = {
  'take-part': {
    de: 'mach-mit'
  },

  '/en': {
    de: '/'
  }
}
