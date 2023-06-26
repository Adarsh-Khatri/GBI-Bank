import React, { Component } from 'react';
import { get, post } from '../services/HttpService.jsx'

// let obj = {
//     name: "Apoorv",
//     chequeNumber: 34564786536,
//     bankName: "HDFC",
//     branch: "JJ56",
//     amount: 7000
// }

export default class NomineeDetails extends Component {
    state = {
        form: { chequeNumber: '', bankName: "", branch: "", amount: '' },
        banksArr: [],
        errors: {},
    };

    fetchData = async () => {
        let { data } = await get('/getBanks');
        this.setState({ banksArr: data })
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
    handleSubmit = (e) => {
        e.preventDefault();
        let { user } = this.props;
        let errors = this.validateAll();
        if (this.isValid(errors)) {
            this.postData(`/postCheque`, { "name": user.name, ...this.state.form })
        } else {
            let s1 = { ...this.state };
            s1.errors = errors;
            this.setState(s1);
        }
    }
    
    // -------------------------------------------------------------VALIDATING ERRORS

    handleValidate = ({ name, value }) => {
        let s1 = { ...this.state };
        switch (name) {
            case 'chequeNumber':
                s1.errors.chequeNumber = this.validateChequeNumber(value);
                break;
            case 'bankName':
                s1.errors.bankName = this.validateBankName(value);
                break;
            case 'branch':
                s1.errors.branch = this.validateBranch(value);
                break;
            case 'amount':
                s1.errors.amount = this.validateAmount(value);
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
        const { chequeNumber, bankName, branch, amount } = this.state.form;
        const errors = {};
        errors.chequeNumber = this.validateChequeNumber(chequeNumber);
        errors.bankName = this.validateBankName(bankName);
        errors.branch = this.validateBranch(branch);
        errors.amount = this.validateAmount(amount);
        return errors;
    }


    validateChequeNumber = (chequeNumber) => !chequeNumber ? 'Cheque Number must be entered.' : chequeNumber.length < 11 ? 'Cheque Number should have minimum 11 characters' : /^[0-9]+$/.test(chequeNumber) ? '' : 'Name should have only Digits (0-9)';

    validateBankName = (bankName) => !bankName ? 'Bank Name must be entered.' : '';

    validateBranch = (branch) => !branch ? 'Branch must be entered' : branch.length < 4 ? 'Branch should be atleast 4 characters long' : !(/^[A-Z]{2}[\d]{2,4}$/.test(branch)) ? 'First 2 characters should be uppercase alphabets and last 4 characters should be digits' : '';

    validateAmount = (amount) => !(amount) ? 'Amount must be entered' : isNaN(amount) ? 'Please enter a valid Amount' : amount < 0 ? 'Amount Should Be Greater Than 0' : '';


    // ---------------------------------------------------------------------------------------------

    makeInputField = (name, label, value, placeH, errors) => {
        return (
            <>
                <label htmlFor={name} className="form-label fw-bold">
                    {label}<sup className='text-danger'>*</sup>
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
                        <div className="text-center alert alert-danger alert-sm fs-6 fw-bold" role="alert">{errors[name]}</div>
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
                            arr.map((opt, index) => <option key={index} value={opt}>{opt}</option>)
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
        const { chequeNumber, bankName, branch, amount } = this.state.form;
        const { errors = {}, banksArr = [] } = this.state;

        return (
            <div className="container my-3">
                <div className="row bg-light mt-5 py-5">
                    <h1 className="text-center">Deposit Cheque</h1>
                    <div className="col-sm-1"></div>
                    <div className="col-sm-10">
                        <div className="form-group row my-3">
                            {this.makeInputField('chequeNumber', 'Cheque Number', chequeNumber, 'Cheque Number', errors)}
                        </div>
                        <div className="form-group row my-3">
                            {this.makeDropDown('Bank Name', "bankName", bankName, banksArr, 'Select Bank')}
                        </div>
                        <div className="form-group row my-3">
                            {this.makeInputField('branch', 'Branch', branch, 'Branch Code', errors)}
                        </div>
                        <div className="form-group row my-3">
                            {this.makeInputField('amount', 'Amount', amount, 'Amount', errors)}
                        </div>
                        <div>
                            <button type="button" className="btn btn-primary my-3" disabled={!this.isFormValid()} onClick={this.handleSubmit} >
                                Add Cheque
                            </button>
                        </div>
                    </div>
                    <div className="col-sm-1"></div>
                </div>
            </div >
        );
    }
}
