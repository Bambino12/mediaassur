export default (theme)=> ({
  titleContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    [theme.breakpoints.only('xs')]: {
      flexDirection: 'column'
    },
  },
  title: {
    color: 'rgb(229, 26, 26)',
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
