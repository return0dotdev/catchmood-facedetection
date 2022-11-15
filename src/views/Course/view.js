import React, { Component } from 'react'
import swal from 'sweetalert2';
import { Row, Col, Container } from 'react-bootstrap'
import { NavLink } from 'react-router-dom';
import { Table } from '../../containers/revel-strap'
import Loading from '../../containers/loading/loading'
import { Link } from 'react-router-dom';
import CourseModel from '../../models/CourseModel';
import TermModel from '../../models/TermModel';

const course_model = new CourseModel();
const term_model = new TermModel();

export default class View extends Component {
    constructor(props) {
        super(props)
        this.state = {
            login: JSON.parse(localStorage.getItem('login')),
            course_name: '',
            course_id: '',
            course_key: '',
            term_list: [],
            showloading: false,
        }
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.location.pathname !== nextProps.location.pathname) {
            window.location.reload(false);
        }
    }

    componentDidMount() {
        this._fetchData()
    }

    async _fetchData() {
        this.setState({
            showloading: true,
        }, async () => {
            const course_key = this.props.match.params.course_key;
            const course = await course_model.getCourse({
                uid: this.state.login.uid,
                courseKey: course_key
            })
            const term = await term_model.allTerm({
                uid: this.state.login.uid,
                courseKey: course_key
            })
            let course_data = JSON.parse(course)
            let term_list = JSON.parse(term)

            this.setState({
                course_name: course_data.courseName,
                course_id: course_data.courseId,
                course_key: course_key,
                term_list: term_list,
                showloading: false
            })
        })
    }

    async _handleSubmit() {
        this.setState({
            showloading: true,
        }, async () => {
            let text_course_name = document.getElementsByClassName('text-course-name')
            let text_course_id = document.getElementsByClassName('text-course-id')

            let input_course_name = document.getElementsByClassName('input-course-name')
            let input_course_id = document.getElementsByClassName('input-course-id')
            let save_icon = document.getElementsByClassName('save-icon')

            text_course_name[0].style.display = 'inline-block';
            text_course_id[0].style.display = 'inline-block';

            input_course_name[0].style.display = 'none';
            input_course_id[0].style.display = 'none';
            save_icon[0].style.display = 'none';

            const course = await course_model.editCourse({
                uid: this.state.login.uid,
                courseKey: this.state.course_key,
                courseId: this.state.course_id,
                courseName: this.state.course_name
            })

            if (course === "Success") {
                swal.fire({
                    icon: 'success',
                    title: 'Edit Course Success',
                })
            } else {
                swal.fire({
                    icon: 'error',
                    title: 'Edit Course Error',
                })
            }
            this.setState({
                showloading: false
            })
        })
    }

    _onClickUpdateCourse() {
        let text_course_name = document.getElementsByClassName('text-course-name')
        let text_course_id = document.getElementsByClassName('text-course-id')

        let input_course_name = document.getElementsByClassName('input-course-name')
        let input_course_id = document.getElementsByClassName('input-course-id')
        let save_icon = document.getElementsByClassName('save-icon')

        text_course_name[0].style.display = 'none';
        text_course_id[0].style.display = 'none';

        input_course_name[0].style.display = 'block';
        input_course_id[0].style.display = 'block';
        save_icon[0].style.display = 'inline-block';
    }

    _onDeleteCourse() {
        swal.fire({
            title: 'Are you sure?',
            text: "Are you sure you want to delete Course " + this.state.course_name + "?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.value) {
                course_model.deleteCourse({
                    uid: this.state.login.uid,
                    courseKey: this.state.course_key,
                })
                    .then((res) => {
                        if (res === "Success") {
                            swal.fire({
                                title: "Delete Success",
                                icon: "success",
                                confirmButtonText: 'OK'
                            }).then((result) => {
                                if (result.isConfirmed) {
                                    this.props.history.push('/');
                                    window.location.reload(false);
                                } else {
                                    this.props.history.push('/');
                                    window.location.reload(false);
                                }
                            })
                        } else {
                            swal.fire({
                                title: "Delete Error",
                                icon: "error",
                                confirmButtonText: 'OK'
                            }).then((result) => {
                                if (result.isConfirmed) {
                                    this.props.history.push('/');
                                    window.location.reload(false);
                                } else {
                                    this.props.history.push('/');
                                    window.location.reload(false);
                                }
                            })
                        }
                    })
            }
        })
    }
    _onDeleteTerm(row) {
        swal.fire({
            title: 'Are you sure?',
            text: "Are you sure you want to delete Semester " + row.semester + " Trimester " + row.trimester + "?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.value) {
                this.setState({
                    showloading: true,
                }, async () => {
                    term_model.deleteTerm({
                        uid: this.state.login.uid,
                        courseKey: this.state.course_key,
                        termKey: row.termKey
                    })
                        .then((res) => {
                            if (res === "Success") {
                                swal.fire({
                                    title: "Delete Success",
                                    icon: "success",
                                    confirmButtonText: 'OK'
                                })
                            } else {
                                swal.fire({
                                    title: "Delete Error",
                                    icon: "error",
                                    confirmButtonText: 'OK'
                                })
                            }
                            this._fetchData()
                        })
                })
            }
        })
    }

    async _showForm() {
        const { value: formValues } = await swal.fire({
            title: 'Add a Term',
            html:
                '<div class="row">' +
                '<div class="col-3 text-input-box">Semester </div>' +
                '<div class="col-9 row-padding"><input id="swal-input1" class="swal2-input input-box" ></div>' +
                '</div>' +
                '<div class="row">' +
                '<div class="col-3 text-input-box">Trimester </div>' +
                '<div class="col-9 row-padding"><input id="swal-input2" class="swal2-input input-box"></div>' +
                '</div>' +
                '<div class="row">' +
                '<div class="col-3 text-input-box">Status </div>' +
                '<div class="col-9 row-padding">' +
                '<select id="swal-input3" class="swal2-input input-box">' +
                '<option value="Incoming">Incoming</option>' +
                '<option value="Teaching">Teaching</option>' +
                '<option value="Closed">Closed</option>' +
                '</select>' +
                '</div>' +
                '</div>',
            customClass: 'swal-wide',
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonText: 'OK',
            confirmButtonColor: '#667BAD',
            preConfirm: () => {
                return [
                    document.getElementById('swal-input1').value,
                    document.getElementById('swal-input2').value,
                    document.getElementById('swal-input3').value
                ]
            }
        })

        if (formValues) {
            if (formValues[0] === "" || formValues[1] === "") {
                swal.fire({
                    icon: 'warning',
                    title: 'Please Input Semester, Trimester and Status.',
                })
            } else {
                this.setState({
                    showloading: true,
                }, async () => {
                    const course = await term_model.createTerm({
                        uid: this.state.login.uid,
                        courseKey: this.state.course_key,
                        semester: formValues[0],
                        trimester: formValues[1],
                        status: formValues[2],
                    })

                    if (course === "Success") {
                        swal.fire({
                            icon: 'success',
                            title: 'Create Term Success',
                        })

                    } else {
                        swal.fire({
                            icon: 'error',
                            title: 'Create Term Error',
                        })
                    }
                    this._fetchData()
                })
            }
        }
    }

    async _onEditTerm(row) {
        const { value: formValues } = await swal.fire({
            title: 'Edit a Term',
            html:
                '<div class="row">' +
                '<div class="col-3 text-input-box">Semester </div>' +
                '<div class="col-9 row-padding"><input id="swal-input1" class="swal2-input input-box" value="' + row.semester + '" ></div>' +
                '</div>' +
                '<div class="row">' +
                '<div class="col-3 text-input-box">Trimester </div>' +
                '<div class="col-9 row-padding"><input id="swal-input2" class="swal2-input input-box" value="' + row.trimester + '" ></div>' +
                '</div>' +
                '<div class="row">' +
                '<div class="col-3 text-input-box">Status </div>' +
                '<div class="col-9 row-padding">' +
                '<select id="swal-input3" class="swal2-input input-box">' +
                '<option value="Incoming" ' + (row.status === "Incoming" ? 'selected' : "") + ' >Incoming</option>' +
                '<option value="Teaching" ' + (row.status === "Teaching" ? 'selected' : "") + ' >Teaching</option>' +
                '<option value="Closed" ' + (row.status === "Closed" ? 'selected' : "") + ' >Closed</option>' +
                '</select>' +
                '</div>' +
                '</div>',
            customClass: 'swal-wide',
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonText: 'OK',
            confirmButtonColor: '#667BAD',
            preConfirm: () => {
                return [
                    document.getElementById('swal-input1').value,
                    document.getElementById('swal-input2').value,
                    document.getElementById('swal-input3').value
                ]
            }
        })

        if (formValues) {
            if (formValues[0] === "" || formValues[1] === "") {
                swal.fire({
                    icon: 'warning',
                    title: 'Please Input Semester, Trimester and Status.',
                })
            } else {
                this.setState({
                    showloading: true,
                }, async () => {
                    const course = await term_model.editTerm({
                        uid: this.state.login.uid,
                        courseKey: this.state.course_key,
                        termKey: row.termKey,
                        semester: formValues[0],
                        trimester: formValues[1],
                        status: formValues[2],
                    })

                    if (course === "Success") {
                        swal.fire({
                            icon: 'success',
                            title: 'Edit Term Success',
                        })
                    } else {
                        swal.fire({
                            icon: 'error',
                            title: 'Edit Term Error',
                        })
                    }
                    this._fetchData()
                })
            }
        }
    }
    render() {
        return (
            <div className="first-view">
                <Loading showloading={this.state.showloading} />
                <div className="div-topic">
                    <h2 className="color-topic">
                        Manage Course
                        <i
                            className="fa fa-trash"
                            aria-hidden="true"
                            style={{ marginLeft: '10px', color: '#C36984', cursor: 'pointer' }}
                            onClick={() => this._onDeleteCourse()}
                        ></i>

                        

                        <button
                            className="btn"
                            onClick={() => this._showForm()}
                            style={{ backgroundColor: '#D6B9A8', color: '#fff', float: 'right', borderRadius: '13px' }}
                        >
                            <i className="fa fa-plus"></i> Add a Term
                        </button>
                   
                        <NavLink exact to= {`/Dashboard-C/${this.state.course_key}`}>
                        <button
                            className="btn"
                            style={{ backgroundColor: '#D6B9A8', color: '#fff', float: 'right', borderRadius: '13px', marginRight: '10px' }}
                        >
                             Reports
                        </button>
                        </NavLink>

                    </h2>

                </div>
                <div className="card-topic-main">
                    <Container fluid>
                        <Row style={{ fontSize: '1.2rem' }}>
                            <Col lg={'auto'}><label>Course ID:</label></Col>
                            <Col lg={'auto'}>
                                <label className="text-course-id" onClick={() => this._onClickUpdateCourse()}>{this.state.course_id}</label>
                                <input
                                    type="text"
                                    className="form-control input-course-id"
                                    style={{ display: 'none' }}
                                    value={this.state.course_id}
                                    onChange={(e) => this.setState({ course_id: e.target.value })}
                                />
                            </Col>
                            <Col lg={'auto'}><label>Course Name:</label></Col>
                            <Col lg={'auto'}>
                                <label className="text-course-name" onClick={() => this._onClickUpdateCourse()}>{this.state.course_name}</label>
                                <input
                                    type="text"
                                    className="form-control input-course-name"
                                    style={{ display: 'none' }}
                                    value={this.state.course_name}
                                    onChange={(e) => this.setState({ course_name: e.target.value })}
                                />
                            </Col>
                            <Col lg={'auto'}>
                                <i
                                    className="fas fa-save save-icon"
                                    aria-hidden="true"
                                    style={{ marginLeft: '10px', fontSize: '1.5rem', cursor: 'pointer', display: 'none', marginTop: '5px' }}
                                    onClick={() => this._handleSubmit()}
                                ></i>
                            </Col>
                        </Row>
                    </Container>
                </div>
                <div className="card-detail">
                    <Table
                        showRowNo={true}
                        dataSource={this.state.term_list}
                        pageSize={10}
                        rowKey='termKey'
                        columns={[
                            {
                                title: 'Semester',
                                dataIndex: 'semester',
                                align: 'center',
                                filterAble: true,
                            },
                            {
                                title: 'Trimester',
                                dataIndex: 'trimester',
                                align: 'center',
                                filterAble: true,
                            },
                            {
                                title: 'Status',
                                dataIndex: '',
                                align: 'center',
                                dataIndex: 'status',
                                filterAble: true,
                                render: (column) => {
                                    let color
                                    if (column === "Incoming") {
                                        color = "#E4E41D"
                                    } else if (column === "Teaching") {
                                        color = "#00B45A"
                                    } else {
                                        color = "#E41D1D"
                                    }
                                    return (
                                        <div><i className="fas fa-circle" style={{ color: color, fontSize: '0.5rem', marginRight: '5px' }}></i>{column}</div>
                                    )
                                }
                            },
                            {
                                title: 'Action',
                                dataIndex: '',
                                align: 'center',
                                render: (row) => {
                                    return (
                                        <div>
                                            <NavLink exact to={`/course/term/${this.state.course_key}/${row.termKey}`} style={{ width: '100%' }}>
                                                <img src={require('../../assets/img/view-details.png')} width="18px" style={{ width: '18px', marginRight: '15px', marginBottom: '5px' }} />
                                            </NavLink>
                                            <a>
                                                <i
                                                    className="fa fa-pencil-square-o"
                                                    style={{ color: '#667BAD', fontSize: '1.2rem', marginRight: '15px' }}
                                                    onClick={this._onEditTerm.bind(this, row)}
                                                >
                                                </i>
                                            </a>
                                            <a>
                                                <i
                                                    className="fas fa-trash"
                                                    style={{ color: '#C36984', fontSize: '1.1rem' }}
                                                    onClick={this._onDeleteTerm.bind(this, row)}
                                                >
                                                </i>
                                            </a>
                                        </div>
                                    )
                                },
                            },
                        ]}
                    />
                </div>
            </div>
        )
    }
}
