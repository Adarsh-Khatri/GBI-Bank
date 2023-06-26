import React, { Component } from 'react'

export default class OptionsCB extends Component {

    handleChange = ({ currentTarget: input }) => {
        let options = { ...this.props.options };
        options[input.name] = input.value;
        this.props.onOptionChange(options);
    }


    showRadios = (arr, label, name, selVal) => {
        return (
            <div className='form-group'>
                <label htmlFor="sections" className='form-label fw-bold text-center border rounded lead bg-light w-100 m-0' style={{ height: "50px", lineHeight: "50px" }}>{label}</label>
                {
                    arr.map((a1, index) =>
                        <div className='form-check border m-0 rounded' style={{ height: "50px", lineHeight: "50px" }} key={index}>
                            <input type="radio" id={`${name}${index}`} name={name} value={a1} checked={selVal === a1} onChange={this.handleChange} />
                            <label htmlFor={`${name}${index}`} className='form-check-label px-2'>{a1}</label>
                        </div>
                    )
                }
            </div>
        )
    }


    render() {
        let { bank = '', amount = '' } = this.props.options;
        let { banksArr, amountsArr } = this.props;
        return (
            <div className="container">
                <div className="row">
                    <div className="col-sm-12">
                        {this.showRadios(banksArr, 'Select Bank', 'bank', bank)}
                        <br />
                        {this.showRadios(amountsArr, 'Select Amount', 'amount', amount)}
                        <br />
                    </div>
                </div>
            </div>
        )
    }
}
