module.exports = {
  purge: ['./pages/**/*.js', './components/**/*.js'],
  darkMode: false,
  theme: {
    colors: {
      gray: {
        100: '#FAFAFA',
        200: '#E9E9E9',
        300: '#D7D7D7',
        400: '#ADADAD',
        500: '#828282',
        600: '#585858',
        700: '#3E3E3E',
        800: '#2D2D2D',
      },

      orange: {
        200: '#F5B511',
        800: '#F55511'
      },

      turquoise: {
        300: '#45EEBF'
      },

      white: '#FFFFFF',

      black: '#000000'
    },

    fontFamily: {
      brezel: ['Brezel'],
      rubik: ['Rubik']
    },

    fontSize: {
      'brezel-2xl': ['5.073rem', {
        letterSpacing: '0',
        lineHeight: '1.2'
      }],

      'brezel-xl': ['4.51rem', {
        letterSpacing: '0',
        lineHeight: '1.2'
      }],

      'brezel-l': ['3.167rem', {
        lineHeight: '1.18'
      }],

      'brezel-base': ['2.503rem', {
        letterSpacing: '0',
        lineHeight: '1.12'
      }],

      'brezel-s': ['1.234rem', {
        letterSpacing: '0.02rem',
        lineHeight: '1.32'
      }],

      'rubik-2xl': ['3.815rem', {
        letterSpacing: '0',
        lineHeight: '1.14'
      }],

      'rubik-xl': ['1.953rem', {
        letterSpacing: '0',
        lineHeight: '1,125'
      }],

      'rubik-l': ['1.5625rem', {
        letterSpacing: '0',
        lineHeight: '1.15'
      }],

      'rubik-base': ['1.25rem', {
        letterSpacing: '0',
        lineHeight: '1.5'
      }],

      'rubik-s': ['1.125rem', {
        letterSpacing: '0',
        lineHeight: '1.3'
      }],

      'rubik-xs': ['1rem', {
        letterSpacing: '0',
        lineHeight: '1'
      }],
      'rubik-2xs': '0.8rem',
      'rubik-3xs': '0.625rem'
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
