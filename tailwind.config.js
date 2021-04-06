module.exports = {
  mode: 'jit',
  purge: ['./components/**/*.{js,ts,jsx,tsx}', './pages/**/*.{js,ts,jsx,tsx}'],
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
        800: '#2D2D2D'
      },

      orange: {
        200: '#F5B511',
        800: '#F55511',
        900: '#D90202'
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
      '5xl': '8.1rem', // 81
      '4xl': '7.2rem', // 72
      '3xl': '6.1rem', // 61
      '2xl': '5rem', // 50
      xl: '4rem', // 40
      large: '3.2rem', // 32
      medium: '2.5rem', // 25
      base: '2rem', // 20
      small: '1.8rem', // 18
      xs: '1.6rem', // 16
      '2xs': '1.3rem', // 13
      '3xs': '1rem', // 10
      none: '0'
    },

    maxWidth: {
      0: '0rem',
      none: 'none',
      xs: '20rem',
      sm: '24rem',
      md: '28rem',
      lg: '32rem',
      xl: '36rem',
      '2xl': '42rem',
      '3xl': '48rem',
      '4xl': '56rem',
      '5xl': '64rem',
      '6xl': '72rem',
      '7xl': '80rem',
      full: '100%',

      wide: '120rem',
      regular: '85rem'
    }
  },
  variants: {
    extend: {}
  },
  plugins: []
};
