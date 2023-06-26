import React, { Component } from 'react';
import { post } from '../services/HttpService.jsx'

export default class AddEmployee extends Component {
    state = {
        form: { name: '', password: '', confirmPassword: '' },
        errors: {},
    };

    handleChange = ({ target }) => {
        const { name, value } = target;
        this.setState((prevState) => ({
            form: { ...prevState.form, [name]: value }
        }), this.isValid);
    };

    postData = async (url, obj) => {
        try {
            await post(url, obj);
            alert('Customer Added Successfully')
            this.props.history.push("/admin");
        } catch (error) {
            console.log('Error:', error);
        }
    }

    handleSubmit = (e) => {
        e.preventDefault();
        if (this.isValid()) {
            this.postData("/register", this.state.form);
        } else {
        }
    };

    validateForm = () => {
        const { name, password, confirmPassword } = this.state.form;
        const errors = {};
        if (name == '') {
            errors.name = 'Name is Required';
        }
        if (name && name.length < 5) {
            errors.name = 'Name should have a minimum of 5 characters';
        }
        if (password == '') {
            errors.password = 'Password is Required';
        }
        if (password && password.length < 7) {
            errors.password = 'Password cannot be blank. Minimum Length should be 7 characters';
        }

        if (password !== confirmPassword) {
            errors.confirmPassword = 'Passwords do not match';
        }
        return errors;
    };

    isValid = () => {
        const errors = this.validateForm();
        this.setState({ errors });
        return Object.keys(errors).length === 0;
    };

    render() {
        const { name, password, confirmPassword } = this.state.form;
        const { errors } = this.state;
        return (
            <div className="container my-3">
                <div className="row bg-light mt-5 py-5">
                    <h1 className="text-center">New Customer</h1>
                    <div className="col-sm-1"></div>
                    <div className="col-sm-10">
                        <div className="form-group row my-3">
                            <label htmlFor="name" className="form-label fw-bold">
                                Name:
                            </label>
                            <div className="">
                                <input
                                    type="text"
                                    className="form-control"
                                    id="name"
                                    name="name"
                                    placeholder="Enter the Customer Name"
                                    value={name}
                                    onChange={this.handleChange}
                                    required
                                />
                                {errors.name && (
                                    <div className="text-center text-danger fw-bold">{errors.name}</div>
                                )}
                            </div>
                        </div>
                        <div className="form-group row my-3">
                            <label htmlFor="password" className="form-label fw-bold">
                                Password:
                            </label>
                            <div className="">
                                <input
                                    type="password"
                                    className="form-control"
                                    id="password"
                                    name="password"
                                    placeholder="Enter The Password"
                                    value={password}
                                    onChange={this.handleChange}
                                    required
                                />
                                {errors.password && (
                                    <div className="text-center text-danger fw-bold">{errors.password}</div>
                                )}
                            </div>
                        </div>
                        <div className="form-group row my-3">
                            <label htmlFor="confirmPassword" className="form-label fw-bold">
                                Re-enter Password:
                            </label>
                            <div className="">
                                <input
                                    type="password"
                                    className="form-control"
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    placeholder="Re-enter The Password"
                                    value={confirmPassword}
                                    onChange={this.handleChange}
                                    required
                                />
                                {errors.confirmPassword && (
                                    <div className="text-center text-danger fw-bold">
                                        {errors.confirmPassword}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div>
                            <button type="button" className="btn btn-primary my-3" onClick={this.handleSubmit} >
                                Create
                            </button>
                        </div>
                    </div>
                    <div className="col-sm-1"></div>
                </div>
            </div>
        );
    }
}
