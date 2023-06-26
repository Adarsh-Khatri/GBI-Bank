import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class Navbar extends Component {
    render() {
        let { user } = this.props;
        return (
            <div className="container-fluid">
                <nav className="navbar navbar-expand-lg navbar-warning bg-warning">
                    <div className="container-fluid px-5">
                        <Link className="navbar-brand fw-bold fs-3" to="/">Home</Link>
                        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"></span>
                        </button>
                        <div className="collapse navbar-collapse w-100 d-flex justify-content-between" id="navbarNavDropdown">
                            {
                                user && (
                                    <>
                                        <ul className="navbar-nav fs-5 ">
                                            {
                                                user.role === 'manager' ? (
                                                    <>
                                                        <li className="nav-item dropdown">
                                                            <Link className="nav-link dropdown-toggle" to="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                                                Customers
                                                            </Link>
                                                            <ul className="dropdown-menu bg-info">
                                                                <li>
                                                                    <Link className="dropdown-item fw-bold" to="/addCustomers">Add Customers</Link>
                                                                </li>
                                                                <li>
                                                                    <Link className="dropdown-item fw-bold" to="/allCustomers?page=1">View All Customers</Link>
                                                                </li>
                                                            </ul>
                                                        </li>
                                                        <li className="nav-item dropdown">
                                                            <Link className="nav-link dropdown-toggle" to="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                                                Transactions
                                                            </Link>
                                                            <ul className="dropdown-menu bg-info">
                                                                <li><Link className="dropdown-item fw-bold" to="/allCheque?page=1">Cheques</Link></li>
                                                                <li><Link className="dropdown-item fw-bold" to="/allNet?page=1">Net Banking</Link></li>
                                                            </ul>
                                                        </li>
                                                    </>
                                                ) : (<>
                                                    <li className="nav-item dropdown">
                                                        <Link className="nav-link dropdown-toggle" to="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                                            View
                                                        </Link>
                                                        <ul className="dropdown-menu bg-danger">
                                                            <li>
                                                                <Link className="dropdown-item fw-bold" to="/viewCheque?page=1">Cheque</Link>
                                                            </li>
                                                            <li>
                                                                <Link className="dropdown-item fw-bold" to="/viewNet?page=1">Net Banking</Link>
                                                            </li>
                                                        </ul>
                                                    </li>
                                                    <li className="nav-item dropdown">
                                                        <Link className="nav-link dropdown-toggle" to="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                                            Details
                                                        </Link>
                                                        <ul className="dropdown-menu bg-danger">
                                                            <li><Link className="dropdown-item fw-bold" to="/customerDetails">Customer</Link></li>
                                                            <li><Link className="dropdown-item fw-bold" to="/nomineeDetails">Nominee</Link></li>
                                                        </ul>
                                                    </li>
                                                    <li className="nav-item dropdown">
                                                        <Link className="nav-link dropdown-toggle" to="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                                            Transactions
                                                        </Link>
                                                        <ul className="dropdown-menu bg-danger">
                                                            <li><Link className="dropdown-item fw-bold" to="/addPayee">Add Payee</Link></li>
                                                            <li><Link className="dropdown-item fw-bold" to="/cheque">Cheques</Link></li>
                                                            <li><Link className="dropdown-item fw-bold" to="/netBanking">Net Banking</Link></li>
                                                        </ul>
                                                    </li>
                                                </>)
                                            }
                                        </ul>
                                    </>
                                )
                            }
                            <li className="nav-item d-flex">
                                {
                                    !user && (
                                        <div className='lead'>
                                            <Link className="nav-link fw-bold text-primary" to="/login">LOGIN</Link>
                                        </div>
                                    )
                                }
                                {
                                    user && (
                                        <div className='lead d-flex gap-4'>
                                            <div>Welcome {user.name}!</div>
                                            <Link className="nav-link fw-bold text-danger" to="/logout">LOGOUT</Link>
                                        </div>
                                    )
                                }

                            </li>
                        </div>
                    </div>
                </nav>
            </div>
        )
    }
}
