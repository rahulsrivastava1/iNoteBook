import React,{useState} from 'react';
import { useHistory } from 'react-router-dom';
const host = "http://localhost:5000";

const Login = (props) => {
    const [credentials, setCredentials] = useState({email:"",password:""})
    let history=useHistory();
    const handleSubmit = async (e)=>{
        e.preventDefault();
        const response = await fetch(`${host}/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({email:credentials.email,password:credentials.password})
        });
        const json=await response.json();
        console.log(json);
        if(json.success){
            localStorage.setItem('token',json.authToken);
            props.showAlert("Login successfull!","success");
            history.push("/");
            
        }else{
            props.showAlert("Wrong Credentials!","danger");
        }
    }
    const onChange=(e)=>{
        setCredentials({...credentials,[e.target.name]:e.target.value});
    }
    return (
        <div className="container my-3">
            <h2>Login Here!</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3 my-3">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input type="email" className="form-control" id="email" name="email" value={credentials.email} onChange={onChange} aria-describedby="emailHelp"/>
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input type="password" className="form-control" id="password" name="password" value={credentials.password} onChange={onChange} />
                </div>
                <button type="submit" className="btn btn-primary" >Login</button>
            </form>
        </div>
    )
}

export default Login
