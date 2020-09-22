import {useState} from "react";
import {initialState} from './variables'

// Services
import {addCustomer} from 'services/customer'

export default function useForm(history){
    const [state, setState] = useState(initialState)

    function onSubmit(values){
        const data = {
            first_name: values.firstName,
            last_name: values.lastName,
            phone: values.mobilePhone,
            gender_id: values.gender,
            email: values.email,
            description: values.description,
            is_whatsapp: values.isWhatsapp ? 1 : 0,
        }

        setState(state => ({...state, isLoading: true})) 

        addCustomer(data).then(res => {
            setState(state => ({...state, isLoading: false}))

            if(res && parseInt(res.status) === 1){
                history.push(
                    '/clients',
                    {message: res.msg}
                )
            }else{
                const newState = {...state};
                newState.snackbar = {
                    open : true,
                    message : res && parseInt(res.status) === 0 ? res.msg : "Opération échouée, veuillez ressayer !",
                    variant: 'error',
                };
    
                setState(newState)
            }
        })
    }

    function closeSnackbar(){
        const newState = {...state}
    
        newState.snackbar = {
          ...newState.snackbar,
          open : false,
        };
    
        setState(newState)
    }

    return {
        state,
        onSubmit,
        closeSnackbar,
    }
}