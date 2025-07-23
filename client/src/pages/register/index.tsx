import { useState, SyntheticEvent, useContext } from "react";
import axios from "axios";
import {toast} from 'react-toastify'
import { UserErrors } from "../../models/errors";


import "./styles.css"
import { Link } from "react-router-dom";

const apiURL = process.env.REACT_APP_API_URL



export const Register = () => {

    const [username, setUsername] = useState<string>('')
    const [password, setPassword] = useState<string>('')

    


    const handleSubmit = async (e: SyntheticEvent)=>{
        e.preventDefault()
        try{
            await axios.post(`${apiURL}/user/register`, {
                username,
                password,
            });
            toast.success("User Registered, Please log in :) ")
            setUsername("")
            setPassword("")

        } catch(err){
            if(err?.response?.data?.type === UserErrors.USERNAME_ALREADY_EXISTS){
                toast.error("ERROR: Username already in use")
            } else{
                toast.error("ERROR: Something went wrong")
            }
        }
     

    }



    return ( 
    <div className="auth">
        <div className="auth-container">
            <form onSubmit={handleSubmit}>
                <h2> Register</h2> 
                <div className="form-group">
                    <label htmlFor="username"> Username: </label>
                    <input type="text"
                     id="username"
                     value={username}
                     onChange={(e)=> setUsername(e.target.value)}
                     />

                </div>

                <div className="form-group">
                    <label htmlFor="password"> Password: </label>
                    <input type="password"
                     id="password"
                     value={password}
                     onChange={(e)=> setPassword(e.target.value)}
                     />

                </div>

                <button type="submit" className="addToCartBtn"> Register</button>
            </form>

            <Link className="login_link" to="/login">log in here!</Link>




        </div>

    </div>
     );
}
 
