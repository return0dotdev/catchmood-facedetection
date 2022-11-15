import React, { Component } from 'react';
import swal from 'sweetalert2';
import { Link } from 'react-router-dom';
import AdminModel from '../../models/AdminModel';
import '../../assets/css/login.css'
import { Button, Input, InputGroup, InputGroupAddon, InputGroupText, Row } from 'reactstrap';

const admin_model = new AdminModel();

class Login extends Component {
    constructor(props) {
        super(props)
        this.state = {
            login_username: '',
            login_password: ''
        }
    }

    async _handleSubmit() {
        if (this._checkSubmit()) {
            const login = await admin_model.checkLogin({
                username: this.state.login_username,
                password: this.state.login_password
            })
            localStorage.setItem('login', login);
            window.location.reload()
        }else{
            swal.fire({
                title: "Warning!",
                text: "Please Check Your Password ",
                icon: "warning"
            });
        }
    }

    _checkSubmit() {
        if (this.state.login_username === '') {
            swal.fire({
                title: "Warning!",
                text: "Please Check Your Username ",
                icon: "warning"
            });
            return false
        } else if (this.state.login_password === '') {
            swal.fire({
                title: "Warning!",
                text: "Please Check Your Password ",
                icon: "warning"
            });
            return false
        } else {
            return true
        }
    }

    render() {
        return (
            <div>
                <div className="card-topic center-login" align="center">
                    <table border="0" align="center">
                        <tr>
                            <td>
                                <h1 align="center" style={{ color: '#707070' }}>Login</h1>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <InputGroup className="mb-3">
                                    <InputGroupAddon addonType="prepend">
                                        <InputGroupText>
                                            <i className="fa fa-user-o"></i>
                                        </InputGroupText>
                                    </InputGroupAddon>
                                    <Input type="text" id="login_username" name="login_username" placeholder="Username" aria-describedby="inputGroupPrepend21" value={this.state.login_username} onChange={(e) => this.setState({ login_username: e.target.value })} />
                                </InputGroup>
                            </td>
                        </tr>
                        <tr>
                            <InputGroup className="mb-4">
                                <InputGroupAddon addonType="prepend">
                                    <InputGroupText>
                                        <i className="fa fa-lock" ></i>
                                    </InputGroupText>
                                </InputGroupAddon>
                                <Input type="password" id="login_password" name="login_password" placeholder="Password" value={this.state.login_password} onChange={(e) => this.setState({ login_password: e.target.value })} />
                            </InputGroup>
                        </tr>
                        <tr>
                            <td align="center">
                                <Button color='light' id="login_btn" name="login_btn" style={{ width: '100px', borderRadius: '20px' }} onClick={() => this._handleSubmit()}>Login</Button>
                                    &nbsp;
                                <Link to={`/register`} style={{ width: '100%' }}>
                                    <Button id="Register_btn" name="Register_btn" style={{ width: '100px', borderRadius: '20px' }} >Register</Button>
                                </Link>
                            </td>
                        </tr>
                    </table>
                </div>

                <div className="footer-tag"> </div>
            </div>
        )
    }
}

export default Login;