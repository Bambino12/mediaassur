export default theme => ({
  root: {
    padding: theme.spacing(3),
    paddingTop: theme.spacing(4),
  },
  textField: {
    width: '100%',
    marginBottom: theme.spacing(2)
  },
  portletFooter: {
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3),
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2)
  },
  input: {
    display: 'none'
  },
  progress: {
    display: 'block',
    marginTop: theme.spacing.unit * 2,
    marginLeft: 'auto',
    marginRight: 'auto'
  },
});
