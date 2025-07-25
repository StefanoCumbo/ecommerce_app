
import { useState, SyntheticEvent, useContext } from "react";
import axios from "axios";
import {toast} from 'react-toastify'
import { UserErrors } from "../../models/errors";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { IShopContext, ShopContext } from "../../context/shop-context";
import { Link } from "react-router-dom";

import "./styles.css"

const apiURL = process.env.REACT_APP_API_URL


export const Login = () => {

    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [, setCookies] = useCookies(["access_token"])

    const navigate = useNavigate()

    const { setIsAuthenticated} = useContext<IShopContext>(ShopContext)

    const handleSubmit = async (e: SyntheticEvent)=>{
        e.preventDefault()
        try{
            const result = await axios.post(`${apiURL}/user/login`, {
                username,
                password,
            });
            setCookies("access_token", result?.data?.token);
            localStorage.setItem("userID", result?.data?.userID)
            setIsAuthenticated(true);
            navigate('/')

        } catch(err){

            let errorMessage: string = ""
            switch(err?.response?.data?.type){
                case UserErrors.NO_USER_FOUND:
                    errorMessage = "User doesnt exist"
                    break
                case UserErrors.WRONG_CREDENTIALS:
                        errorMessage = "Wrong username/password "
                        break
                default:
                    errorMessage = "Something went wrong"
            }

            toast.error("ERROR: " + errorMessage)
        }
     

    }



    return ( 
    <div className="auth">
        <div className="auth-container">
            <form onSubmit={handleSubmit}>
                <h2> Login</h2> 
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

                <button type="submit" className="addToCartBtn"> Login</button>
            </form>


            <Link className="login_link" to="/register">Register!</Link>
            
        </div>
    </div>
     );
}
