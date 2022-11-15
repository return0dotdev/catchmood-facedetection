import React, { Component } from 'react';
import swal from 'sweetalert2';
import { Button, Col, Input } from 'reactstrap';
import { Link } from 'react-router-dom';
import AdminModel from '../../models/AdminModel';

const admin_model = new AdminModel();

class Register extends Component {
    constructor(props) {
        super(props)
        this.state = {
            reg_firstname: '',
            reg_lastname: '',
            reg_insittution: '',
            reg_major: '',
            reg_username: '',
            reg_password: ''
        }
    }

    async _handleSubmit() {
        if (this._checkSubmit()) {
            const admin = await admin_model.insertAdmin({
                firstname: this.state.reg_firstname,
                lastname: this.state.reg_lastname,
                insittution: this.state.reg_insittution,
                major: this.state.reg_major,
                username: this.state.reg_username,
                password: this.state.reg_password,
            })

            if (admin === "Success") {
                swal.fire({
                    title: "Register Success",
                    icon: "success",
                }).then((res) => {
                    this.props.history.push('/');
                })
            } else {
                swal.fire({
                    title: "Register error!",
                    icon: "error",
                });
            }
        }
    }


    _checkSubmit() {
        if (this.state.reg_firstname === '') {
            swal.fire({
                title: "Warning!",
                text: "Please Check Your First name ",
                icon: "warning"
            });
            return false
        } else if (this.state.reg_lastname === '') {
            swal.fire({
                title: "Warning!",
                text: "Please Check Your Last name ",
                icon: "warning"
            });
            return false
        } else if (this.state.reg_insittution === '') {
            swal.fire({
                title: "Warning!",
                text: "Please Check Your Institution ",
                icon: "warning"
            });
            return false
        } else if (this.state.reg_major === '') {
            swal.fire({
                title: "Warning!",
                text: "Please Check Your Major ",
                icon: "warning"
            });
            return false

        } else if (this.state.reg_username === '') {
            swal.fire({
                title: "Warning!",
                text: "Please Check Your Username ",
                icon: "warning"
            });
            return false
        } else if (this.state.reg_password === '') {
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
                <div className={"menu-toggle "}>
                    <Link exact to={`/`} style={{ width: '100%', color: 'gray' }}>
                        <i className="fas fa-arrow-left"></i>
                    </Link>
                </div>
                <div style={{marginTop: '40px'}}>
                    <table border="0" align="center">
                        <tr>
                            <td>
                                <h1 align="center" style={{ color: '#707070' }}>Register</h1>
                                <br></br><br></br>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <table border="0" align="center">
                                    <tr>
                                        <td width="80" align="right">
                                            <p style={{ marginRight: '10px' }}> Surname:  </p>
                                        </td>
                                        <td width="250">
                                            <Input type="text" id="reg_firstname" name="reg_firstname" style={{ borderRadius: '20px' }} aria-describedby="inputGroupPrepend21" value={this.state.reg_firstname} onChange={(e) => this.setState({ reg_firstname: e.target.value })} />
                                            <br></br>
                                        </td>
                                    </tr>

                                    <tr>
                                        <td width="85" align="right">
                                            <p style={{ marginRight: '10px' }}>Last Name:  </p>
                                        </td>
                                        <td>
                                            <Input type="text" id="reg_lastname" name="reg_lastname" style={{ borderRadius: '20px' }} value={this.state.reg_lastname} onChange={(e) => this.setState({ reg_lastname: e.target.value })} />
                                            <br></br>
                                        </td>
                                    </tr>

                                    <tr>
                                        <td width="80" align="right">
                                            <p style={{ marginRight: '10px' }}> Institution:  </p>
                                        </td>
                                        <td>
                                            <Input type="text" id="reg_insittution" name="reg_insittution" style={{ borderRadius: '20px' }} value={this.state.reg_insittution} onChange={(e) => this.setState({ reg_insittution: e.target.value })} />
                                            <br></br>
                                        </td>
                                    </tr>

                                    <tr>
                                        <td width="80" align="right">
                                            <p style={{ marginRight: '10px' }}> Major: </p>
                                        </td>
                                        <td>
                                            <Input type="text" id="reg_major" name="reg_major" style={{ borderRadius: '20px' }} value={this.state.reg_major} onChange={(e) => this.setState({ reg_major: e.target.value })} />
                                            <br></br>
                                        </td>
                                    </tr>

                                    <tr>
                                        <td width="80" align="right">
                                            <p style={{ marginRight: '10px' }}> Username:</p>
                                        </td>
                                        <td>
                                            <Input type="text" id="reg_username" name="reg_username" style={{ borderRadius: '20px' }} aria-describedby="inputGroupPrepend21" value={this.state.reg_username} onChange={(e) => this.setState({ reg_username: e.target.value })} />
                                            <br></br>
                                        </td>
                                    </tr>

                                    <tr>
                                        <td width="80" align="right">
                                            <p style={{ marginRight: '10px' }}>Password: </p>
                                        </td>
                                        <td>
                                            <Input type="password" id="reg_password" name="reg_password" style={{ borderRadius: '20px' }} value={this.state.reg_password} onChange={(e) => this.setState({ reg_password: e.target.value })} />
                                            <br></br>
                                        </td>
                                    </tr>

                                </table>
                            </td>
                        </tr>

                        <tr>
                            <td align="center">
                                <Col xs="6">
                                    <Button background-color="#D6B9A8" id="Reg_btn" name="Reg_btn" style={{ width: '100px', backgroundColor: '#D6B9A8', border: '0', borderRadius: '20px' }} onClick={() => this._handleSubmit()} >Confirm</Button>
                                </Col>
                            </td>
                        </tr>

                    </table>

                </div>

                <div className="footer-tag">
                </div>
            </div>
        )
    }
}

export default Register;