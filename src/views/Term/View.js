import React, { Component } from 'react'
import swal from 'sweetalert2';
import { Row, Col, Container } from 'react-bootstrap'
import { NavLink } from 'react-router-dom';
import { Table } from '../../containers/revel-strap'
import Loading from '../../containers/loading/loading'
import { app } from '../../containers/base'

import CourseModel from '../../models/CourseModel';
import TermModel from '../../models/TermModel';
import TeachingModel from '../../models/TeachingModel';

const course_model = new CourseModel();
const term_model = new TermModel();
const teaching_model = new TeachingModel();

export default class View extends Component {
    constructor(props) {
        super(props)
        this.state = {
            login: JSON.parse(localStorage.getItem('login')),
            course_name: '',
            course_id: '',
            course_key: '',
            term_semester: '',
            term_trimester: '',
            term_key: '',
            teaching_list: [],
            showloading: false,
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
            const term_key = this.props.match.params.term_key;
            const course = await course_model.getCourse({
                uid: this.state.login.uid,
                courseKey: course_key
            })
            const term = await term_model.getTerm({
                uid: this.state.login.uid,
                courseKey: course_key,
                termKey: term_key
            })
            const teaching = await teaching_model.allTeaching({
                uid: this.state.login.uid,
                courseKey: course_key,
                termKey: term_key
            })
            let course_data = JSON.parse(course)
            let term_data = JSON.parse(term)
            let teaching_list = JSON.parse(teaching)
            this.setState({
                course_name: course_data.courseName,
                course_id: course_data.courseId,
                course_key: course_key,
                term_semester: term_data.semester,
                term_trimester: term_data.trimester,
                term_key: term_key,
                teaching_list: teaching_list,
                showloading: false
            })
        })
    }

    _onDeleteTerm(row) {
        swal.fire({
            title: 'Are you sure?',
            text: "Are you sure you want to delete Subject " + row.subject + "?",
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
                    if (row.link_video !== '') {
                        if (row.status === 'video') {
                            const storageRef = app.storage().ref()
                            const desertRef = storageRef.child('Video-' + row.teachKey);
                            desertRef.delete()
                        }else if(row.status === 'live'){
                            teaching_model.deleteVideo({
                                filename: row.teachKey
                            })
                        }

                    }
                    teaching_model.deleteTeaching({
                        uid: this.state.login.uid,
                        courseKey: this.state.course_key,
                        termKey: this.state.term_key,
                        teachKey: row.teachKey,
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
        let date = new Date();
        let day = ("0" + date.getDate()).slice(-2); var month = ("0" + (date.getMonth() + 1)).slice(-2);
        let today = date.getFullYear() + "-" + (month) + "-" + (day);
        const { value: formValues } = await swal.fire({
            title: 'Add Teaching',
            html:
                '<div class="row">' +
                '<div class="col-3 text-input-box">Subject </div>' +
                '<div class="col-9 row-padding"><input id="swal-input1" class="swal2-input input-box" ></div>' +
                '</div>' +
                '<div class="row">' +
                '<div class="col-3 text-input-box">Date </div>' +
                '<div class="col-9 row-padding"><input type="date" id="swal-input2" class="swal2-input input-box" value="' + today + '" ></div>' +
                '</div>' +
                '<div class="row">' +
                '<div class="col-3 text-input-box">Type Teaching </div>' +
                '<div class="col-9 row-padding">' +
                '<select class="swal2-input input-box" id="swal-input4">' +
                '<option value="live" selected>Live</option>' +
                '<option value="video">Video</option>' +
                '</select>' +
                '</div>' +
                '</div>' +
                '<div class="row">' +
                '<div class="col-3 text-input-box">Description </div>' +
                '<div class="col-9 row-padding">' +
                '<textarea id="swal-input3" class="swal2-input input-box-textarea" rows="4">' +
                '</textarea>' +
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
                    document.getElementById('swal-input3').value,
                    document.getElementById('swal-input4').value
                ]
            }
        })

        if (formValues) {
            if (formValues[0] === "" || formValues[1] === "") {
                swal.fire({
                    icon: 'warning',
                    title: 'Please Input Subject, Trimester and Date.',
                })
            } else {
                this.setState({
                    showloading: true,
                }, async () => {
                    const teaching = await teaching_model.createTeaching({
                        uid: this.state.login.uid,
                        courseKey: this.state.course_key,
                        termKey: this.state.term_key,
                        subject: formValues[0],
                        date: formValues[1],
                        description: formValues[2],
                        status: formValues[3],
                    })

                    if (teaching === "Success") {
                        swal.fire({
                            icon: 'success',
                            title: 'Create Teaching Success',
                        })
                    } else {
                        swal.fire({
                            icon: 'error',
                            title: 'Create Teaching Error',
                        })
                    }
                    this._fetchData()
                })
            }
        }
    }

    async _onEditTerm(row) {
        const { value: formValues } = await swal.fire({
            title: 'Edit Teaching',
            html:
                '<div class="row">' +
                '<div class="col-3 text-input-box">Subject </div>' +
                '<div class="col-9 row-padding"><input id="swal-input1" class="swal2-input input-box" value="' + row.subject + '" ></div>' +
                '</div>' +
                '<div class="row">' +
                '<div class="col-3 text-input-box">Date </div>' +
                '<div class="col-9 row-padding"><input type="date" id="swal-input2" class="swal2-input input-box" value="' + row.date + '" ></div>' +
                '</div>' +
                '<div class="row">' +
                '<div class="col-3 text-input-box">Description </div>' +
                '<div class="col-9 row-padding">' +
                '<textarea id="swal-input3" class="swal2-input input-box-textarea" rows="4">' +
                row.description +
                '</textarea>' +
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
                    title: 'Please Input Subject, Trimester and Date.',
                })
            } else {
                this.setState({
                    showloading: true,
                }, async () => {
                    const teaching = await teaching_model.editTeaching({
                        uid: this.state.login.uid,
                        courseKey: this.state.course_key,
                        termKey: this.state.term_key,
                        teachKey: row.teachKey,
                        subject: formValues[0],
                        date: formValues[1],
                        description: formValues[2],
                        link_video: row.link_video,
                    })

                    if (teaching === "Success") {
                        swal.fire({
                            icon: 'success',
                            title: 'Edit Teaching Success',
                        })
                    } else {
                        swal.fire({
                            icon: 'error',
                            title: 'Edit Teaching Error',
                        })
                    }
                    this._fetchData()
                })
            }
        }
    }

    async _goTeaching(row) {
        if (row.status === 'live') {
            const { value: formValues } = await swal.fire({
                title: 'Add URL Camera',
                html:
                    '<div class="row">' +
                    '<div class="col-3 text-input-box">URL Camera </div>' +
                    '<div class="col-9 row-padding"><input id="swal-input1" class="swal2-input input-box" placeholder="http://192.168.43.187:5800"></div>' +
                    '<div class="col-3 text-input-box">Record Video </div>' +
                    '<div class="col-2"><input type="checkbox" id="swal-input2" class="swal2-input"></div>' +
                    '</div>',
                customClass: 'swal-wide',
                focusConfirm: false,
                showCancelButton: true,
                confirmButtonText: 'OK',
                confirmButtonColor: '#667BAD',
                preConfirm: () => {
                    return [
                        document.getElementById('swal-input1').value,
                        document.getElementById('swal-input2').checked,
                    ]
                }
            })

            if (formValues) {
                if (formValues[0] === "") {
                    swal.fire({
                        icon: 'warning',
                        title: 'Please Input URL Camera',
                    })
                } else {
                    sessionStorage.setItem('Camera', formValues[0])
                    if (formValues[1]) {
                        sessionStorage.setItem('Record_Video', "Yes")
                    }else{
                        sessionStorage.setItem('Record_Video', "No")
                    }
                    this.props.history.push(`/course/term/teaching/${this.state.course_key}/${this.state.term_key}/${row.teachKey}`);
                }
            }
        } else {
            const { value: file } = await swal.fire({
                title: 'Select Video',
                input: 'file',
                inputAttributes: {
                    'accept': 'video/mp4,video/x-m4v,video/*',
                    'aria-label': 'Upload your Video'
                }
            })

            if (file) {
                const storageRef = app.storage().ref()
                const fileRef = storageRef.child("Video-" + row.teachKey)
                this.setState({
                    showloading: true,
                }, () => {
                    fileRef.put(file).then(() => {
                        fileRef.getDownloadURL().then(async (url) => {
                            await teaching_model.editTeaching({
                                uid: this.state.login.uid,
                                courseKey: this.state.course_key,
                                termKey: this.state.term_key,
                                teachKey: row.teachKey,
                                subject: row.subject,
                                date: row.date,
                                description: row.description,
                                link_video: url
                            })
                            sessionStorage.setItem('Video', url)
                            this.props.history.push(`/course/term/teaching-video/${this.state.course_key}/${this.state.term_key}/${row.teachKey}`);
                        })
                    })
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
                        Manage Teaching Schedule
                        <button
                            className="btn"
                            onClick={() => this._showForm()}
                            style={{ backgroundColor: '#D6B9A8', color: '#fff', float: 'right', borderRadius: '13px' }}
                        >
                            Create Teaching
                        </button>
                    </h2>
                </div>
                <div className="card-topic-main">
                    <Container fluid>
                        <Row style={{ fontSize: '1.2rem' }}>
                            <Col lg={'auto'}><label>Course ID:</label></Col>
                            <Col lg={'auto'}>
                                <label>{this.state.course_id}</label>
                            </Col>
                            <Col lg={'auto'}><label>Course Name:</label></Col>
                            <Col lg={'auto'}>
                                <label>{this.state.course_name}</label>
                            </Col>
                            <Col lg={'auto'}><label>Trimester:</label></Col>
                            <Col lg={'auto'}>
                                <label>{this.state.term_semester}/{this.state.term_trimester}</label>
                            </Col>
                        </Row>
                    </Container>
                </div>
                <div className="card-detail">
                    <Table
                        showRowNo={true}
                        dataSource={this.state.teaching_list}
                        pageSize={10}
                        rowKey='teachKey'
                        columns={[
                            {
                                title: 'Subject',
                                dataIndex: 'subject',
                                align: 'center',
                                filterAble: true,
                            },
                            {
                                title: 'Date',
                                dataIndex: 'date',
                                align: 'center',
                                filterAble: true,
                            },
                            {
                                title: 'Description',
                                dataIndex: 'description',
                                align: 'center',
                                filterAble: true,
                            },
                            {
                                title: 'Type',
                                dataIndex: 'status',
                                align: 'center',
                                filterAble: true,
                            },
                            {
                                title: 'Action',
                                dataIndex: '',
                                align: 'center',
                                render: (row) => {
                                    let teach = false
                                    if (row.emotion_anger.length === 0 && row.emotion_anxiety.length === 0 && row.emotion_disgust.length === 0 && row.emotion_joy.length === 0 && row.emotion_natural.length === 0 && row.emotion_surprise.length === 0) {
                                        teach = true
                                    }
                                    return (
                                        <div>
                                            {teach ?
                                                <button
                                                    className="btn btn-sm"
                                                    style={{ backgroundColor: '#D6B9A8', color: '#fff', borderRadius: '13px', marginRight: '20px' }}
                                                    onClick={() => this._goTeaching(row)}
                                                >
                                                    Start Teaching
                                                </button>
                                                :
                                                <button
                                                    disabled
                                                    className="btn btn-sm"
                                                    style={{ backgroundColor: '#AAAAAA', color: '#fff', borderRadius: '13px', marginRight: '15px' }}
                                                >
                                                    Finish Teaching
                                                </button>
                                            }
                                            {teach ?
                                                <i
                                                    className="fa fa-bar-chart"
                                                    style={{ color: '#AAAAAA', fontSize: '1.3rem', marginRight: '15px' }}
                                                >
                                                </i>
                                                :
                                                <NavLink exact to={`/course/term/dashboard/${this.state.course_key}/${this.state.term_key}/${row.teachKey}`} style={{ width: '100%' }}>
                                                    <i
                                                        className="fa fa-bar-chart"
                                                        style={{ color: '#000', fontSize: '1.3rem', marginRight: '15px' }}
                                                    >
                                                    </i>
                                                </NavLink>
                                            }

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
