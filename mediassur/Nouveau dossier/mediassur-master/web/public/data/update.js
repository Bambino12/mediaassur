export default (data) => {
	return {
	  status: 1,
	  user: {
	  	...data, 
	  	type: data.user,
	  	password: '', 
	  	passwordConfirmation: ''
	  },
	}
}
