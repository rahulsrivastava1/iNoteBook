import React,{useState} from 'react';
import { useHistory } from 'react-router-dom';
const host = "http://localhost:5000";

const Signup = (props) => {
    const [credentials, setCredentials] = useState({name:"",email:"",password:""})
    let history=useHistory();
    const handleSubmit = async (e)=>{
        e.preventDefault();
        const {name,email,password}=credentials;
        const response = await fetch(`${host}/api/auth/createuser`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({name,email,password})
        });
        const json=await response.json();
        console.log(json);
        if(json.success){
            localStorage.setItem('token',json.authtoken);
            history.push("/");
            props.showAlert("Account created successfully!","success");
        }else{
            props.showAlert("Email exists!","danger");
        }
    }
    const onChange=(e)=>{
        setCredentials({...credentials,[e.target.name]:e.target.value});
    }
    return (
        <div className="container my-3">
            <h2>Signup Here!</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3 my-3">
                    <label htmlFor="name" className="form-label">Name</label>
                    <input type="text" className="form-control" id="name" name="name" onChange={onChange} minLength={5} required/>
                </div>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input type="email" className="form-control" id="email" name="email" aria-describedby="emailHelp" onChange={onChange} minLength={5} required />
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input type="password" className="form-control" id="password" name="password" onChange={onChange} minLength={5} required />
                </div>
                <button type="submit" className="btn btn-primary">Signup</button>
            </form>
        </div>
    )
}

export default Signup