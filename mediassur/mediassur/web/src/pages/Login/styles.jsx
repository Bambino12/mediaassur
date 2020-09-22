import { bg_Mediassur } from 'assets/img/public'

export default (theme)=> ({
  root: {
    fontFamily: "Montserrat-Regular",
    // backgroundImage:`url(${bg_Mediassur})`,
    backgroundColor: '#0174DF',
    backgroundPosition: 'center center',
    backgroundRepeat: 'no-repeat',
    backgroundAttachment: 'fixed',
    backgroundSize: 'cover',
    width: '100%',
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  formCard: {
    width: 400,
    [theme.breakpoints.only('xs')]: {
      width: 300
    },
    borderRadius: 5
  },
  title: {
    fontSize: 28,
    [theme.breakpoints.only('xs')]: {
      fontSize: 20,
    },
    fontWeight: 700,
    color: '#0174DF',
    textAlign: "center",
    marginBottom: 20,
    '& i': {
      color: 'rgb(245, 165, 0)',
      fontSize: 37,
      [theme.breakpoints.only('xs')]: {
        fontSize: 30,
      },
    }
  },
  logoContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 20,
    marginBottom: 20,
    borderBottom: '1px solid gray'
  },
  logo: {
    width: 300,
    height: 200,
    [theme.breakpoints.only('xs')]: {
      width: 200,
      height: 100,
    },
  },
  loginBtn: {
    textAlign: 'center',
  }
});
