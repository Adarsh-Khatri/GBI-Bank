import React, { Component } from 'react';
import { get, post } from '../services/HttpService.jsx'

export default class NomineeDetails extends Component {
    state = {
        form: { payeeName: '', accNumber: '', bankName: '', IFSC: '' },
        chooseBank: '',
        banksArr: [],
        errors: {},
    };

    fetchData = async () => {
        let { user } = this.props;
        let { data } = await get(`/getBanks`);
        // removing the last GBI Bank
        data.pop();
        this.setState({ banksArr: data })
    }

    componentDidMount() {
        this.fetchData()
    }

    handleChange = ({ target }) => {
        const { name, value, type } = target;
        this.handleValidate(target)
        if (type === 'radio') {
            this.setState({ [name]: value })
        } else {
            this.setState((prevState) => ({
                form: { ...prevState.form, [name]: value }
            }));
        }
    };

    postData = async (url, obj) => {
        try {
            await post(url, obj);
            alert(`Payee Added To Your List :: ${this.state.form.payeeName}`)
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
            this.postData("/addPayee", { name: user.name, ...this.state.form, bankName: this.state.chooseBank === 'sameBank' ? 'GBI' : this.state.form.bankName });
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
            case 'accNumber':
                s1.errors.accNumber = this.validateAccNumber(value);
                break;
            case 'bankName':
                s1.errors.bankName = this.validateBankName(value);
                break;
            case 'IFSC':
                s1.errors.IFSC = this.validateIFSC(value);
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
        const { payeeName, accNumber, bankName, IFSC } = this.state.form;
        const errors = {};
        errors.payeeName = this.validatePayeeName(payeeName);
        errors.accNumber = this.validateAccNumber(accNumber);
        if (this.state.chooseBank === "otherBank") {
            errors.bankName = this.validateBankName(bankName);
            errors.IFSC = this.validateIFSC(IFSC);
        }
        return errors;
    }


    validatePayeeName = (payeeName) => !payeeName ? 'Payee Name is Required' : payeeName.length < 5 ? 'Payee Name must have 5 Characters' : '';

    validateAccNumber = (accNumber) => !(accNumber) ? 'Account Number is Required' : isNaN(accNumber) ? 'Please enter a valid accNumber' : accNumber < 0 ? 'Account Number can not be negative' : '';

    validateBankName = (bankName) => !bankName ? 'Bank Name is Required' : '';

    validateIFSC = (IFSC) => !IFSC ? 'IFSC is Required' : IFSC.length < 4 ? 'IFSC must have 4 characters' : '';


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

    makeDropDown = (label, name, value, arr, startValue, errors) => {
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
                    {errors[name] && (
                        <div className="text-center alert alert-danger fw-bold" role='alert'>{errors[name]}</div>
                    )}
                </div>
            </>
        )
    }


    makeRadio = () => {
        return (
            <>
                <div className="form-check">
                    <input type="radio" className='form-check-input' name='chooseBank' id='sameBank' value='sameBank' onChange={this.handleChange} />
                    <label htmlFor="sameBank" className='form-check-label'>Same Bank</label>
                </div>
                <div className="form-check">
                    <input type="radio" className='form-check-input' name='chooseBank' id='otherBank' value='otherBank' onChange={this.handleChange} />
                    <label htmlFor="otherBank" className='form-check-label'>Other Bank</label>
                </div>
            </>
        )
    }

    render() {
        const { payeeName, accNumber, bankName, IFSC } = this.state.form;
        const { errors = null, banksArr = [], chooseBank } = this.state;

        return (
            <div className="container my-3">
                <div className="row bg-light mt-5 py-5">
                    <h1 className="text-center">ADD PAYEE</h1>
                    <div className="col-sm-1"></div>
                    <div className="col-sm-10">
                        <div className="form-group row my-3">
                            {this.makeInputField('payeeName', 'Payee Name', payeeName, 'Payee Name', errors)}
                        </div>
                        <div className="form-group row my-3">
                            {this.makeInputField('accNumber', 'Account Number', accNumber, 'Account Number', errors)}
                        </div>
                        <div className="form-group">
                            {this.makeRadio()}
                        </div>
                        {
                            chooseBank === 'otherBank' && (
                                <>
                                    <div className="form-group row my-3">
                                        {this.makeDropDown('Bank Name', "bankName", bankName, banksArr, 'Select Bank', errors)}
                                    </div>
                                    <div className="form-group row my-3">
                                        {this.makeInputField('IFSC', 'IFSC Number', IFSC, 'IFSC Number', errors)}
                                    </div>
                                </>
                            )
                        }
                        <div className="row">
                            <div>
                                <button type="button" className="btn btn-primary my-3" disabled={!this.isFormValid()} onClick={this.handleSubmit} >
                                    Add Payee
                                </button>
                            </div>
                        </div>
                    </div>
                    <div>
                    </div>
                </div>
                <div className="col-sm-1"></div>
            </div>
        );
    }
}
