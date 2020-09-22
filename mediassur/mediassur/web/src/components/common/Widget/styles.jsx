export default theme => ({
  root: {
    padding: theme.spacing(2)
  },
  content: {
    alignItems: 'center',
    display: 'flex'
  },
  title: {
    color: theme.palette.text.secondary,
    fontWeight: 700
  },
  value: {
    marginTop: theme.spacing.unit
  },
  iconWrapper: {
    alignItems: 'center',
    backgroundColor: "#0174DF",
    borderRadius: '50%',
    display: 'inline-flex',
    height: '4rem',
    justifyContent: 'center',
    marginLeft: 'auto',
    width: '4rem'
  },
  footer: {
    marginTop: theme.spacing(2),
    display: 'flex',
    alignItems: 'center'
  },
  caption: {
    marginLeft: theme.spacing.unit,
    cursor: 'pointer',
    color: '#0174DF',
    fontWeight: 700
  }
});
