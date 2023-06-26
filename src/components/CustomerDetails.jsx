import React, { Component } from 'react';
import { get, post } from '../services/HttpService.jsx'

export default class AddEmployee extends Component {
    state = {
        form: { gender: '', dob: '', PAN: '', addressLine1: '', addressLine2: '', state: '', city: '', year: '', month: '', day: '' },
        statecity: [],
        errors: {},
        detailsStatus: true
    };


    fetchData = async () => {
        let { user } = this.props;
        let customer = await get(`/getCustomer/${user.name}`);
        if (this.detailsOrNot(customer.data)) {
            this.setState({ detailsStatus: false })
        } else {
            this.setState({ detailsStatus: true })
        }
        let { data } = await get('/statecity');
        this.setState({ form: customer.data, statecity: data })
    }

    componentDidMount() {
        this.fetchData()
    }

    handleChange = ({ target }) => {
        const { name, value } = target;
        console.log('name: ', name);
        this.handleValidate(target);
        this.setState((prevState) => ({
            form: { ...prevState.form, [name]: value }
        }));
    };

    postData = async (url, obj) => {
        try {
            await post(url, obj);
            this.props.history.push("/admin");
        } catch (error) {
            console.log('Error:', error);
        }
    }

    formatDate = (day, month, year) => {
        return `${day}-${month}-${year}`
    }

    handleSubmit = (e) => {
        e.preventDefault();
        let { gender, PAN, addressLine1, addressLine2, state, city, day, month, year } = this.state.form;
        let { user } = this.props;
        let errors = this.validateAll();
        if (this.isValid(errors)) {
            this.postData(`/customerDetails`, { "name": user.name, gender, addressLine1, city, state, PAN, dob: this.formatDate(day, month, year) })
        } else {
            console.log('posting error');
            let s1 = { ...this.state };
            s1.errors = errors;
            this.setState(s1);
        }
    };


    detailsOrNot = ({ gender, dob, PAN, addressLine1, state, city }) => (gender && dob && PAN && addressLine1 && state && city)

    
        // -------------------------------------------------------------VALIDATING ERRORS
    
    
        handleValidate = ({ name, value }) => {
            let s1 = { ...this.state };
            switch (name) {
                case 'gender':
                    s1.errors.gender = this.validateGender(value);
                    break;
                case 'PAN':
                    s1.errors.PAN = this.validatePAN(value);
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
            case 'state':
                s1.errors.state = this.validateState(value);
                break;
            case 'city':
                s1.errors.city = this.validateCity(value);
                break;
            default:
                break;
        }
        console.log(s1.errors);
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
        const { gender, PAN, addressLine1, addressLine2, state, city, year, month, day } = this.state.form;
        const errors = {};
        errors.gender = this.validateGender(gender);
        errors.PAN = this.validatePAN(PAN);
        errors.year = this.validateYear(year);
        errors.month = this.validateMonth(month);
        errors.day = this.validateDay(day);
        errors.state = this.validateState(state);
        errors.city = this.validateCity(city);
        return errors;
    }


    validateGender = (gender) => !gender ? 'Gender is Required' : '';

    validatePAN = (PAN) => !PAN ? 'PAN is Required' : PAN.length < 4 ? 'PAN should have atleast 4 characters' : '';

    validateYear = (year) => !year ? 'Year is Required' : '';

    validateMonth = (month) => !month ? 'Month is Required' : '';

    validateDay = (day) => !day ? 'Day is Required' : '';

    validateState = (state) => !state ? 'State is Required' : '';

    validateCity = (city) => !city ? 'City is Required' : '';



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
                    <input type="radio" id='male' className='form-check-input' name='gender' value='Male' checked={selVal == 'Male'} onChange={this.handleChange} />
                    <label htmlFor="male" className='form-check-label'>Male</label>
                </div >
                <div className="col-sm-3 form-check">
                    <input type="radio" id='female' className='form-check-input' name='gender' value='Female' checked={selVal == 'Female'} onChange={this.handleChange} />
                    <label htmlFor="female" className='form-check-label'>Female</label>
                </div>
                {this.state.errors.gender && (
                    <span className="text-center alert alert-danger alert-sm fs-6 fw-bold">{this.state.errors.gender}</span>
                )}
            </>
        )
    }

    makeDropDownYear = (value, startValue, arr, name, errors) => (
        <>
            <select className='form-select' name={name} value={value} onChange={this.handleChange}>
                <option value="" disabled>{startValue}</option>
                {arr && arr.map((day) => (
                    <option key={day} value={day}>{day}</option>
                ))}
            </select>
            {errors[name] && (
                <div className="text-center alert alert-danger fw-bold">{errors[name]}</div>
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

    render() {
        let { gender, dob, PAN, addressLine1, addressLine2, state, city, year, month, day } = this.state.form;
        const { errors = null, statecity, detailsStatus } = this.state;

        let cityByState = state ? statecity.find(s => s.stateName === state).cityArr : [];

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
                    <h1 className="text-center">Customer Details</h1>
                    <div className="col-sm-1"></div>
                    <div className="col-sm-10">
                        <div className="form-group row my-3">
                            {this.makeRadio(gender, gender)}
                        </div>
                        <div className='form-group row my-3'>
                            <label htmlFor='' className='label fw-bold'>Date Of Birth<sup className='text-danger'>*</sup></label>
                            <div className="col-sm-4">{this.makeDropDownYear(year, 'Select Year', yearOptions, "year", errors)}</div>
                            <div className="col-sm-4">{this.makeDropDownYear(month, 'Select Month', monthOptions, "month", errors)}</div>
                            <div className="col-sm-4">
                                {
                                    this.makeDropDownYear(day, 'Select Day', (month && year) ? this.generateDays(month, year) : '', 'day', errors)
                                }
                            </div>
                        </div>
                        <div className="form-group row my-3">
                            {this.makeInputField('PAN', 'PAN', PAN, 'PAN', errors)}
                        </div>
                        <div className="form-group row my-3">
                            <label htmlFor="addressLine1" className="form-label fw-bold">
                                Address
                            </label>
                            <div className="col-sm-6">
                                <div className="">
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="addressLine1"
                                        name="addressLine1"
                                        placeholder="Enter the Address Line 1"
                                        value={addressLine1}
                                        onChange={this.handleChange}
                                        required
                                    />
                                    {errors.addressLine1 && (
                                        <div className="text-center text-danger fw-bold">{errors.addressLine1}</div>
                                    )}
                                </div>
                            </div>
                            <div className="col-sm-6">
                                <div className="">
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="addressLine2"
                                        name="addressLine2"
                                        placeholder="Enter the Address Line 2"
                                        value={addressLine2}
                                        onChange={this.handleChange}
                                        required
                                    />
                                    {errors.addressLine2 && (
                                        <div className="text-center text-danger fw-bold">{errors.addressLine2}</div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="form-group row my-3">
                            <div className="col-sm-6">
                                {this.makeDropDown('State', "state", state, statecity, 'Select State', 'stateName')}
                            </div>
                            <div className="col-sm-6">
                                {this.makeDropDown('City', "city", city, cityByState, 'Select City')}
                            </div>
                        </div>
                        <div>
                            {
                                detailsStatus && (<button type="button" className="btn btn-primary my-3" onClick={this.handleSubmit} >
                                    Add Details
                                </button>)
                            }

                        </div>
                    </div>
                    <div className="col-sm-1"></div>
                </div>
            </div>
        );
    }
}
