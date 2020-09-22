export default (theme)=> ({
  titleContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    [theme.breakpoints.only('xs')]: {
      flexDirection: 'column'
    },
  },
  title: {
    color: '#0174DF',
    [theme.breakpoints.only('xs')]: {
      fontSize: 20
    },
  },
  button: {
    [theme.breakpoints.only('xs')]: {
      width: '100%'
    },
  },
});
