export default (data) => {
	if(!data.user){
		return {
		  status: 1,
		  token: `kjvhjcl35dcklnhlbfh`,
		  user: {
			email: "djeachristian@gmail.com",
			establishmentId: 1,
			filiereId: 1,
			firstName: "Christian",
			isWhatsapp: false,
			lastName: "Yao",
			nevelId: 2,
			tel: "07151781",
			type: "student",
		  },
		}
	}

	return {
	  status: 1,
	  token: `kjvhjcl35dcklnhlbfh`,
	  user: {
	  	...data, 
	  	type: data.user,
	  	password: '', 
	  	passwordConfirmation: ''
	  },
	}
}
