import React, { Component } from 'react';
import { get, post } from '../services/HttpService.jsx'

// let obj = {"name": "Apoorv","payeeName": "PayeeTest12","comment": "Car EMI","amount": "45000","bankName": "GBI"}

export default class NomineeDetails extends Component {
    state = {
        form: { payeeName: '', amount: '', comment: '' },
        payeesArr: [],
        errors: {},
    };

    fetchData = async () => {
        let { user } = this.props;
        let { data } = await get(`/getPayees/${user.name}`);
        this.setState({ payeesArr: data })
    }

    componentDidMount() {
        this.fetchData()
    }

    handleChange = ({ target }) => {
        const { name, value } = target;
        this.handleValidate(target);
        this.setState((prevState) => ({
            form: { ...prevState.form, [name]: value }
        }));
    };

    postData = async (url, obj) => {
        try {
            await post(url, obj);
            alert('Details Added Successfully')
            this.props.history.push("/customer");
        } catch (error) {
            console.log('Error:', error);
        }
    }

    getBankByPayee = () => {
        let { payeesArr } = this.state;
        let { payeeName } = this.state.form;
        return payeeName ? payeesArr.find(p => p.payeeName === payeeName).bankName : ''
    }

    handleSubmit = (e) => {
        e.preventDefault();
        let { user } = this.props;
        let errors = this.validateAll();
        let bank = this.getBankByPayee();
        if (this.isValid(errors)) {
            this.postData("/postNet", { name: user.name, ...this.state.form, bankName: bank });
        } else {
            let s1 = { ...this.state };
            s1.errors = errors;
            this.setState(s1);
        }
    };


    // -------------------------------------------------------------VALIDATING ERRORS

    handleValidate = ({ name, value }) => {
        let s1 = { ...this.state };
        switch (name) {
            case 'payeeName':
                s1.errors.payeeName = this.validatePayeeName(value);
                break;
            case 'amount':
                s1.errors.amount = this.validateAmount(value);
                break;
            case 'comment':
                s1.errors.comment = this.validateComment(value);
                break;
            default:
                break;
        }
        this.setState(s1);
    }


    isValid = (errors) => {
        let keys = Object.keys(errors)
        let count = keys.reduce((acc, cur) => errors[cur] ? acc + 1 : acc, 0)
        return count === 0;
    }


    isFormValid = () => {
        let errors = this.validateAll();
        return this.isValid(errors)
    }


    validateAll = () => {
        const { payeeName, amount, comment } = this.state.form;
        const errors = {};
        errors.payeeName = this.validatePayeeName(payeeName);
        errors.amount = this.validateAmount(amount);
        errors.comment = this.validateComment(comment);
        return errors;
    }


    validatePayeeName = (payeeName) => !payeeName ? 'Payee Name is Required' : '';

    validateAmount = (amount) => !(amount) ? 'Amount is Required' : isNaN(amount) ? 'Please enter a valid Amount' : amount < 0 ? 'Amount Should Be Greater Than 0' : '';

    validateComment = (comment) => !comment ? 'Comment is Required' : ''


    // -------------------------------------------------------------------------------


    makeInputField = (name, label, value, placeH, errors) => {
        return (
            <>
                <label htmlFor={name} className="form-label fw-bold">
                    {label}{name != 'comment' && <sup className='text-danger'>*</sup>}
                </label>
                <div className="">
                    <input
                        type="text"
                        className="form-control"
                        id={name}
                        name={name}
                        placeholder={`Enter the ${placeH}`}
                        value={value}
                        onChange={this.handleChange}
                        required
                    />
                    {errors[name] && (
                        <div className="text-center alert alert-danger fw-bold" role='alert'>{errors[name]}</div>
                    )}
                </div>
            </>
        )
    }

    makeDropDown = (label, name, value, arr, startValue) => {
        return (
            <>
                <div className="form-group">
                    <label htmlFor={name} className='form-label fw-bold'>{label}<sup className='text-danger'>*</sup></label>
                    <select className='form-select' name={name} value={value} id={name} onChange={this.handleChange}>
                        <option value="" disabled>{startValue}</option>
                        {
                            arr.map((opt, index) => <option key={index} value={opt.payeeName}>{opt.payeeName}</option>)
                        }
                    </select>
                    {this.state.errors.name && (
                        <div className="text-center alert alert-danger fw-bold">{this.state.errors.name}</div>
                    )}
                </div>
            </>
        )
    }

    render() {
        const { payeeName, amount, comment } = this.state.form;
        const { errors = null, payeesArr = [] } = this.state;

        return (
            <div className="container my-3">
                <div className="row bg-light mt-5 py-5">
                    <h1 className="text-center">NET BANKING DETAILS</h1>
                    <div className="col-sm-1"></div>
                    <div className="col-sm-10">
                        <div className="form-group row my-3">
                            {this.makeDropDown('Payee Name', "payeeName", payeeName, payeesArr, 'Select Payee')}
                        </div>
                        <div className="form-group row my-3">
                            {this.makeInputField('amount', 'Amount', amount, 'Amount', errors)}
                        </div>
                        <div className="form-group row my-3">
                            {this.makeInputField('comment', 'Comment', comment, 'Comment', errors)}
                        </div>
                        <div>
                            <button type="button" className="btn btn-primary my-3" disabled={!this.isFormValid()} onClick={this.handleSubmit} >
                                Add Transaction
                            </button>
                        </div>
                    </div>
                    <div className="col-sm-1"></div>
                </div>
            </div >
        );
    }
}
