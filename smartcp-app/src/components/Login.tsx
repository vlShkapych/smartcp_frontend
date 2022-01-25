import React, { Component, } from 'react';
import { Button, Modal, Form,Row,Col, } from 'react-bootstrap';

import './Login.css'


class Login extends Component<{setToken:(userToken:string)=>void},{login:string,password:string}> {

    constructor(props:any){
        super(props);

        this.state = {
            login: "",
            password: ""
        }
      
    }


    submit(e:any){
        


        e.preventDefault();

        console.log("jsonObj.data.access_token")
        fetch('http://localhost:5000/token',{
                  method: 'POST',
                  mode: 'cors',
                  headers: {
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify({
                    login: this.state.login,
                    password: this.state.password,
                  })
        })
        .then(response => {
            return response.json();    
        })
        .then(json => {
            
            this.props.setToken(json.access_token);
        })
        .catch((error) => {
            if (error.response) {
                console.log(error.response)
                console.log(error.response.status)
                console.log(error.response.headers)
            }
        });

        //this.setState({login:"",password:""});
    
    }


    render() {
        return(
            <div className='signInCard'>
                 <div className="card-content">
                    <div className="card-title">
                        <h2 style={{"paddingBottom":13}}>LOGIN</h2>
                        <div className="underline-title"></div>
                    </div>
                    <form method="post" className="form">
                        <label htmlFor="user-email" style={{"paddingTop":13}}>&nbsp;Login</label>
                        <input id="user-email" 
                               className="form-content" 
                               type="email" 
                               name="login" 
                               autoComplete="on" 
                               required
                               onChange={(e:any) => this.setState({login:e.target.value})}
                               />
                        <div className="form-border"></div>
                        <label htmlFor="user-password" style={{"paddingTop":22}}>&nbsp;Password</label>
                        <input id="user-password" 
                               className="form-content" 
                                type="password" 
                                name="password" 
                                required
                                onChange={(e:any) => this.setState({password:e.target.value})} />
                        <div className="form-border"></div>
                        <a href="#">
                        <legend id="forgot-pass">Forgot password?</legend>
                        </a>
                        <input id="submit-btn" type="submit" name="submit" value="LOGIN" onClick={(e)=>this.submit(e)}/>
                        <a href="#" id="signup">Don't have account yet?</a>
                    </form>

                 </div>
                
            </div>
            
        )
  }
}

export default Login;