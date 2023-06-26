import React, { Component } from 'react';
import { post } from '../services/HttpService';
import { login } from '../services/AuthService.js';

export default class Login extends Component {

    state = {
        form: { name: '', password: '' }
    }

    handleChange = ({ currentTarget: input }) => {
        this.setState(
            (prevState) => ({ form: { ...prevState.form, [input.name]: input.value } }),
            this.checkingValidation
        );
    };


    async login(url, obj) {
        try {
            let { data } = await post(url, obj);
            login(data)
            if (data.role === 'manager') {
                this.props.history.push('/admin');
            } else {
                this.props.history.push('/customer');
            }
        } catch (err) {
            if (err.response && err.response.status === 401) {
                let errors = {};
                errors.status = err.response.data;
                this.setState({ errors });
            }
        }
    }

    handleSubmit = (e) => {
        e.preventDefault();
        let { form } = this.state;
        this.login("/login", form)
    }

    checkingValidation = () => {
        const { name, password } = this.state.form;
        let validation = {}
        if (name == '') {
            validation.name = 'Name is Required';
        }
        if (name && name.length < 5) {
            validation.name = 'Name must be of 5 characters';
        }
        if (password == '') {
            validation.password = 'Password is Required';
        }
        if (password && password.length < 7) {
            validation.password = 'Password must be of 7 characters'
        }
        this.setState({ validation })
    }

    isValid = () => {
        const { validation = null } = this.state;
        return !(validation && Object.keys(validation).length === 0);
    };

    render() {
        let { name, password } = this.state.form;
        let { errors = null, validation = null } = this.state;
        return (
            <div className="container my-5">
                <h1 className='fw-bold text-center my-5'>Welcome To GBI Bank</h1>
                <div className="row">
                    {errors && <div className='text-center text-danger fw-bold'>{errors.status}</div>}
                    <div className="col-sm-4"></div>
                    <div className='col-sm-4 bg-light rounded rounded-5 text-center p-5'>
                        <div className="form-group my-3">
                            <label htmlFor='name' className='form-label fw-bold'>User Name:</label>
                            <div>
                                <input type="text" className='form-control' id='name' name="name" placeholder='Enter Your User Name' value={name} required onChange={(e) => this.handleChange(e)} />
                                <div ><small>We'll never share your username with anyone else</small></div>
                                {validation && <div className='text-center text-danger fw-bold'>{validation.name}</div>}
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor='password' className='form-label fw-bold'>Password:</label>
                            <div>
                                <input type="text" className='form-control' id='password' name="password" placeholder='Enter Your Password' value={password} required onChange={(e) => this.handleChange(e)} />
                                {validation && <div className='text-center text-danger fw-bold'>{validation.password}</div>}
                            </div>
                        </div>
                        <div className='mt-3'>
                            <button type='button' className='btn btn-primary my-3' disabled={this.isValid()} onClick={(e) => this.handleSubmit(e)}>Login</button>
                        </div>
                    </div>
                    <div className="col-sm-4"></div>
                </div>
            </div>
        )
    }
}

