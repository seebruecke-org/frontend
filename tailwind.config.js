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
      '5xl': '5.0625rem',
      '4xl': '4.5rem',
      '3xl': '3.8125rem',
      '2xl': '3.125rem',
      'xl': '2.5rem',
      'large': '2rem',
      'medium': '1.5625rem',
      'base': '1.25rem',
      'small': '1.125rem',
      'xs': '1rem',
      '2xs': '0.8125rem',
      '3xs': '0.625rem'
    },

    maxWidth: {
      'wide': '120rem',
      'regular': '85rem',
    }

  },
  variants: {
    extend: {},
  },
  plugins: [],
}
