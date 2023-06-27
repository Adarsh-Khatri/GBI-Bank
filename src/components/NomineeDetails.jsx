import React, { Component } from 'react';
import { get, post } from '../services/HttpService.jsx'

export default class NomineeDetails extends Component {
    state = {
        form: { gender: '', dob: '', nomineeName: '', relationship: '', jointsignatory: false, year: '', month: '', day: '' },
        errors: {},
        detailsStatus: true
    };


    fetchData = async () => {
        let { user } = this.props;
        let customer = await get(`/getNominee/${user.name}`);
        console.log(customer.data);
        if (this.detailsOrNot(customer.data)) {
            this.setState({ detailsStatus: false })
        } else {
            this.setState({ detailsStatus: true })
        }
        this.setState({ form: customer.data })
    }

    componentDidMount() {
        this.fetchData()
    }

    handleChange = ({ target }) => {
        const { name, value, type, checked } = target;
        console.log(checked);
        this.handleValidate(target)
        this.setState((prevState) => ({
            form: { ...prevState.form, [name]: type === 'checkbox' ? checked : value }
        }));
        console.log(this.state.form);
    };

    postData = async (url, obj) => {
        let { user } = this.props;
        let { nomineeName } = this.state.form;
        try {
            await post(url, obj);
            alert(`${user.name} Your Nominee :: ${nomineeName}`)
            this.props.history.push("/customer");
        } catch (error) {
            console.log('Error:', error);
        }
    }

    formatDate = (day, month, year) => {
        return `${day}-${month}-${year}`
    }

    handleSubmit = (e) => {
        e.preventDefault();
        let { gender, nomineeName, relationship, jointsignatory, year, month, day } = this.state.form;
        let { user } = this.props;
        let errors = this.validateAll();
        if (this.isValid(errors)) {
            this.postData(`/nomineeDetails`, { name: user.name, nomineeName, jointsignatory, relationship, gender, dob: this.formatDate(day, month, year) })
        } else {
            let s1 = { ...this.state };
            s1.errors = errors;
            this.setState(s1);
        }
    };

    detailsOrNot = ({ gender, dob, nomineeName, relationship }) => (gender && dob && nomineeName && relationship)


    // -------------------------------------------------------------VALIDATING ERRORS


    handleValidate = ({ name, value }) => {
        let s1 = { ...this.state };
        switch (name) {
            case 'nomineeName':
                s1.errors.nomineeName = this.validateNomineeName(value);
                break;
            case 'gender':
                s1.errors.gender = this.validateGender(value);
                break;
            case 'year':
                s1.errors.year = this.validateYear(value);
                break;
            case 'month':
                s1.errors.month = this.validateMonth(value);
                break;
            case 'day':
                s1.errors.day = this.validateDay(value);
                break;
            case 'relationship':
                s1.errors.relationship = this.validateRelationship(value);
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
        const { gender, nomineeName, relationship, year, month, day } = this.state.form;
        const errors = {};
        errors.nomineeName = this.validateNomineeName(nomineeName);
        errors.gender = this.validateGender(gender);
        errors.year = this.validateYear(year);
        errors.month = this.validateMonth(month);
        errors.day = this.validateDay(day);
        errors.relationship = this.validateRelationship(relationship);
        return errors;
    }


    validateGender = (gender) => !gender ? 'Gender is Required' : '';

    validateNomineeName = (nomineeName) => !nomineeName ? 'Nominee Name is Required' : nomineeName.length < 4 ? 'Nominee Name should have atleast 4 characters' : '';

    validateYear = (year) => !year ? 'Year is Required' : '';

    validateMonth = (month) => !month ? 'Month is Required' : '';

    validateDay = (day) => !day ? 'Day is Required' : '';

    validateRelationship = (relationship) => !relationship ? 'Relationship is Required' : '';




    // ---------------------------------------------------------------------------------------------




    generateDays = (month, year) => {
        const dateObj = new Date(`${month} 1, ${year}`);
        const monthNumber = dateObj.getMonth() + 1;
        const daysInMonth = new Date(year, monthNumber, 0).getDate();
        const days = [];
        for (let day = 1; day <= daysInMonth; day++) {
            days.push(day);
        }
        return days;
    };

    generateYear = () => {
        let years = []
        for (let year = 1900; year <= 2050; year++) {
            years.push(year);
        }
        return years;
    }


    getDates = (date) => {
        if (date) {
            return [...date.split('-')]
        }
    }


    makeRadio = (gender, selVal) => {
        return (
            <>
                <div className="col-sm-3">
                    <label htmlFor="gender" className='fw-bold'>Gender<sup className='text-danger'>*</sup></label>
                </div>
                <div className="col-sm-3 form-check">
                    <input type="radio" id='male' className='form-check-input' name='gender' value="Male" checked={selVal == 'Male'} onChange={this.handleChange} />
                    <label htmlFor="male" className='form-check-label'>Male</label>
                </div >
                <div className="col-sm-3 form-check">
                    <input type="radio" id='female' className='form-check-input' name='gender' value="Female" checked={selVal == 'Female'} onChange={this.handleChange} />
                    <label htmlFor="female" className='form-check-label'>Female</label>
                </div>
                {this.state.errors.gender && (
                    <span className="text-center alert alert-danger alert-sm fs-6 fw-bold">{this.state.errors.gender}</span>
                )}
            </>
        )
    }

    makeDropDownYear = (value, startValue, arr, name) => (
        <>
            <select className='form-select' name={name} value={value} onChange={this.handleChange}>
                <option value="" disabled>{startValue}</option>
                {arr && arr.map((day) => (
                    <option key={day} value={day}>{day}</option>
                ))}
            </select>
            {this.state.errors[name] && (
                <div className="text-center alert alert-danger fw-bold">{this.state.errors[name]}</div>
            )}
        </>
    )

    makeDropDown = (label, name, value, arr, startValue, field = '') => {
        return (
            <>
                <label htmlFor={name} className='form-label fw-bold'>{label}<sup className='text-danger'>*</sup></label>
                <select className='form-select' name={name} value={value} id={name} onChange={this.handleChange}>
                    <option value="" disabled>{startValue}</option>
                    {
                        arr.map((opt, index) => <option key={index} value={field ? opt[field] : opt}>{field ? opt[field] : opt}</option>)
                    }
                </select>
                {this.state.errors[name] && (
                    <div className="text-center alert alert-danger fw-bold">{this.state.errors[name]}</div>
                )}
            </>
        )
    }

    render() {
        let { gender, dob, nomineeName, relationship, jointsignatory, day, month, year } = this.state.form;
        const { errors = null, detailsStatus } = this.state;

        if (dob && dob != '--') {
            [day, month, year] = this.getDates(dob);
        } else {
            day = day;
            month = month;
            year = year;
        }

        const yearOptions = this.generateYear();

        const monthOptions = [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December',
        ];

        return (
            <div className="container my-3">
                <div className="row bg-light mt-5 py-5">
                    <h1 className="text-center">Nominee Details</h1>
                    <div className="col-sm-1"></div>
                    <div className="col-sm-10">
                        <div className="form-group row my-3">
                            <label htmlFor="nomineeName" className="form-label fw-bold">
                                Name<sup className='text-danger'>*</sup>
                            </label>
                            <div className="">
                                <input
                                    type="text"
                                    className="form-control"
                                    id="nomineeName"
                                    name="nomineeName"
                                    placeholder="Enter the Nominee Name"
                                    value={nomineeName}
                                    onChange={this.handleChange}
                                    required
                                />
                                {errors.nomineeName && (
                                    <div className="text-center alert alert-danger fw-bold">{errors.nomineeName}</div>
                                )}
                            </div>
                        </div>
                        <div className="form-group row my-3">
                            {this.makeRadio(gender, gender)}
                        </div>
                        <div className='form-group row my-3'>
                            <label htmlFor='' className='label fw-bold'>Date Of Birth<sup className='text-danger'>*</sup></label>
                            <div className="col-sm-4">{this.makeDropDownYear(year, 'Select Year', yearOptions, "year")}</div>
                            <div className="col-sm-4">{this.makeDropDownYear(month, 'Select Month', monthOptions, "month")}</div>
                            <div className="col-sm-4">
                                {
                                    this.makeDropDownYear(day, 'Select Day', (month && year) ? this.generateDays(month, year) : '', 'day')
                                }
                            </div>
                        </div>
                        <div className="form-group row my-3">
                            <label htmlFor="relationship" className="form-label fw-bold">
                                Relationship<sup className='text-danger'>*</sup>
                            </label>
                            <div className="col-sm">
                                <div className="">
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="relationship"
                                        name="relationship"
                                        placeholder="Enter the Relationship"
                                        value={relationship}
                                        onChange={this.handleChange}
                                        required
                                    />
                                    {errors.relationship && (
                                        <div className="text-center alert alert-danger fw-bold">{errors.relationship}</div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="form-check row">
                            <div className="col-sm-2">
                                <input type="checkbox" className='form-check-input' id='jointsignatory' value={jointsignatory} name='jointsignatory' checked={jointsignatory} onChange={this.handleChange} />
                                <label htmlFor="jointsignatory" className='form-check-label'>Joint Signatory</label>
                            </div>
                        </div>
                        <div>
                            {
                                detailsStatus && (
                                    <button type="button" className="btn btn-primary my-3" onClick={this.handleSubmit} >
                                        Add Nominee
                                    </button>
                                )
                            }
                        </div>
                    </div>
                    <div className="col-sm-1"></div>
                </div>
            </div>
        );
    }
}
