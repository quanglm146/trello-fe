import React, { useState } from 'react';
import { registerApi } from '../Api/func/user';
import googleLogo from '../img/google-logo.png';
import '../../src/style.css'
import { Link, Redirect } from "react-router-dom";

const Register = () => {

    const [tfEmail, setEmail] = useState("");
    const [tfPassword, setPassword] = useState("");
    const [rePassword, setRePassword] = useState("");
    const [name, setName] = useState("");
    const [redirect, setRedirect] = useState(false);

    const onSubmit = async () => {
        const res = await registerApi({
            email: tfEmail,
            password: tfPassword,
            rePassword: rePassword,
            fullName: name
        });
        if (res.data != null) {
            console.log(res);
            setRedirect(true)
        }
        else {
            alert("Something wrong !")
        }
    }

    if (redirect) {
        return <Redirect to="/" />;
    }

    return (
        <div className="login-wrapper">
            <section className="ftco-section">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-md-6 col-lg-4">
                            <div className="social-login">
                                <a className="google" href='http://localhost:8080/oauth2/authorize/google?redirect_uri=http://localhost:3000/oauth2/redirect'>
                                    <img src={googleLogo} alt="Google" /> Sign with Google</a>
                            </div>
                            <div className="login-wrap py-5">
                                <div className="align-items-center justify-content-center" />
                                <p className="text-center">REGISTER</p>

                                <div className="form-group">
                                    <div className="icon d-flex align-items-center justify-content-center"><span className="fa fa-user" /></div>
                                    <input type="text" className="form-control" required placeholder="Name" onChange={e => setName(e.target.value)} />
                                </div>
                                <div className="form-group">
                                    <div className="icon d-flex align-items-center justify-content-center"><span className="fa fa-user" /></div>
                                    <input type="text" className="form-control" required placeholder="Username" onChange={e => setEmail(e.target.value)} />
                                </div>
                                <div className="form-group">
                                    <div className="icon d-flex align-items-center justify-content-center"><span className="fa fa-lock" /></div>
                                    <input type="password" className="form-control" required placeholder="Password" onChange={e => setPassword(e.target.value)} />
                                </div>
                                <div className="form-group">
                                    <div className="icon d-flex align-items-center justify-content-center"><span className="fa fa-lock" /></div>
                                    <input type="password" className="form-control" placeholder="RePassword" onChange={e => setRePassword(e.target.value)} />
                                </div>
                                <div className="form-group">
                                    <button onClick={onSubmit} className="btn form-control btn-primary rounded submit px-3">Register</button>
                                </div>
                                <div className="w-100 text-center mt-4 text">
                                    <p className="mb-0">Have an account?</p>
                                    <Link to="/">Login</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );

}

export default Register;