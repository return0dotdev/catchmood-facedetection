import React, { Component } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import '../../assets/css/teaching.css';
import Loading from '../../containers/loading/loading'
import swal from 'sweetalert2';
import TeachingModel from '../../models/TeachingModel';

const teaching_model = new TeachingModel();
var count_time = 0
var count_anger = 0
var count_anxiety = 0
var count_joy = 0
var count_disgust = 0
var count_surprise = 0
var count_natural = 0
var time = new Date(0)
time.setHours(0)
export default class Dashboard extends Component {

    constructor(props) {
        super(props)
        this.state = {
            login: JSON.parse(localStorage.getItem('login')),
            teaching: [],
            showloading: false,
            anger: [],
            anxiety: [],
            joy: [],
            disgust: [],
            surprise: [],
            natural: [],
            time_label: [],
            emotion: {
                anger: 0,
                anxiety: 0,
                joy: 0,
                disgust: 0,
                surprise: 0,
                natural: 0,
            },
            key_id: {
                course_key: '',
                term_key: '',
                teaching_key: '',
            },
            intervalId: '',
            show_video: false
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
            const teaching_key = this.props.match.params.teaching_key;
            if (sessionStorage.getItem("Video") === null) {
                this.props.history.push(`/course/term/${this.state.key_id.course_key}/${this.state.key_id.term_key}`);
            } else {
                const teaching = await teaching_model.getTeaching({
                    uid: this.state.login.uid,
                    courseKey: course_key,
                    termKey: term_key,
                    teachKey: teaching_key
                })

                this.setState({
                    key_id: {
                        course_key: course_key,
                        term_key: term_key,
                        teaching_key: teaching_key,
                    },
                    teaching: JSON.parse(teaching),
                    showloading: false
                })
            }
        })
    }

    _startTeaching() {
        swal.fire({
            title: 'Do you want to start teaching?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, Start Teaching!'
        }).then((result) => {
            if (result.value) {
                let intervalId = setInterval(async () => {
                    const teaching = await teaching_model.startEmotion()
                    let emotion = JSON.parse(teaching)
                    count_time = count_time + 1
                    if (count_time === 60) {//ทุกๆ 5 นาที plot line chart
                        time.setMinutes(time.getMinutes() + 5)
                        let time_label = this.state.time_label
                        let anger = this.state.anger
                        let anxiety = this.state.anxiety
                        let joy = this.state.joy
                        let disgust = this.state.disgust
                        let surprise = this.state.surprise
                        let natural = this.state.natural
                        time_label.push(time.getHours() + ":" + time.getMinutes() + ":" + time.getSeconds())
                        anger.push(count_anger)
                        anxiety.push(count_anxiety)
                        joy.push(count_joy)
                        disgust.push(count_disgust)
                        surprise.push(count_surprise)
                        natural.push(count_natural)
                        this.setState({
                            anger: anger,
                            anxiety: anxiety,
                            joy: joy,
                            disgust: disgust,
                            surprise: surprise,
                            natural: natural,
                            time_label: time_label,
                            emotion: {
                                anger: this.state.emotion.anger + emotion.Anger,
                                anxiety: this.state.emotion.anxiety + emotion.Anxiety,
                                joy: this.state.emotion.joy + emotion.Joy,
                                disgust: this.state.emotion.disgust + emotion.Disgust,
                                surprise: this.state.emotion.surprise + emotion.Surprise,
                                natural: this.state.emotion.natural + emotion.Natural,
                            }
                        })
                        count_time = 0
                        count_anger = 0
                        count_anxiety = 0
                        count_joy = 0
                        count_disgust = 0
                        count_surprise = 0
                        count_natural = 0
                    } else {
                        count_anger = count_anger + emotion.Anger
                        count_anxiety = count_anxiety + emotion.Anxiety
                        count_joy = count_joy + emotion.Joy
                        count_disgust = count_disgust + emotion.Disgust
                        count_surprise = count_surprise + emotion.Surprise
                        count_natural = count_natural + emotion.Natural
                        this.setState({
                            emotion: {
                                anger: this.state.emotion.anger + emotion.Anger,
                                anxiety: this.state.emotion.anxiety + emotion.Anxiety,
                                joy: this.state.emotion.joy + emotion.Joy,
                                disgust: this.state.emotion.disgust + emotion.Disgust,
                                surprise: this.state.emotion.surprise + emotion.Surprise,
                                natural: this.state.emotion.natural + emotion.Natural,
                            }
                        })
                    }
                }, 5000);
                this.setState({ 
                    intervalId: intervalId,
                    show_video: true
                })
            }
        })
    }

    _endTeaching() {
        swal.fire({
            title: 'Do you want to end teaching?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, End Teaching!'
        }).then(async (result) => {
            if (result.value) {
                this._saveTeaching()
            }
        })
    }

    _saveTeaching() {
        this.setState({
            showloading: true,
        }, async () => {
            clearInterval(this.state.intervalId)
            const teaching = await teaching_model.endEmotion({
                uid: this.state.login.uid,
                courseKey: this.state.key_id.course_key,
                termKey: this.state.key_id.term_key,
                teachKey: this.state.key_id.teaching_key,
                anger: this.state.anger.length === 0 ? [this.state.emotion.anger] : this.state.anger, //ถ้าค่าของ อาเรย์มีแค่ตัวเดียวแสดงว่าเป็น 0 คือสอนยังไม่ครบ 5 นาทีให้ผลรวม 1-5 นาทีแรกเข้าไป
                anxiety: this.state.anxiety.length === 0 ? [this.state.emotion.anxiety] : this.state.anxiety,
                joy: this.state.joy.length === 0 ? [this.state.emotion.joy] : this.state.joy,
                disgust: this.state.disgust.length === 0 ? [this.state.emotion.disgust] : this.state.disgust,
                surprise: this.state.surprise.length === 0 ? [this.state.emotion.surprise] : this.state.surprise,
                natural: this.state.natural.length === 0 ? [this.state.emotion.natural] : this.state.natural,
                link_video: this.state.teaching.link_video
            })
            if (teaching === 'Success') {
                this.props.history.push(`/course/term/${this.state.key_id.course_key}/${this.state.key_id.term_key}`);
            } else {
                swal.fire({
                    title: "Delete Error",
                    icon: "error",
                    confirmButtonText: 'OK'
                })
                this.setState({
                    showloading: false
                })
            }
        })
    }

    render() {
        const data_bar = {
            labels: ['Chart for Show all the emotions that come up.'],
            datasets: [
                {
                    label: 'Natural',
                    backgroundColor: 'rgba(102, 123, 173,0.4)',
                    borderColor: '#667BAD',
                    borderWidth: 1.2,
                    data: [this.state.emotion.natural]
                },

                {
                    label: 'Anxiety',
                    backgroundColor: 'rgb(255, 157, 89,0.4)',
                    borderColor: '#ff9d59',
                    borderWidth: 1.2,
                    data: [this.state.emotion.anxiety]
                },

                {
                    label: 'Disgust',
                    backgroundColor: 'rgba(94, 188, 255,0.4)',
                    borderColor: '#5ebcff',
                    borderWidth: 1.2,
                    data: [this.state.emotion.disgust]
                },

                {
                    label: 'Surprise',
                    backgroundColor: 'rgba(63, 252, 72,0.4)',
                    borderColor: '#3ffc48',
                    borderWidth: 1.2,
                    data: [this.state.emotion.surprise]
                },

                {
                    label: 'Anger',
                    backgroundColor: 'rgba(195, 105, 132,0.4)',
                    borderColor: '#C36984',
                    borderWidth: 1.2,
                    data: [this.state.emotion.anger]
                },

                {
                    label: 'Joy',
                    backgroundColor: 'rgba(255, 204, 102,0.4)',
                    borderColor: '#FFCC66',
                    borderWidth: 1.2,
                    data: [this.state.emotion.joy]
                }
            ]
        };

        const data_line = {
            labels: this.state.time_label,
            datasets: [
                {
                    label: 'Natural',
                    fill: true,
                    backgroundColor: 'rgba(102, 123, 173,0.4)',
                    borderColor: '#667BAD',
                    borderDashOffset: 0.0,
                    pointBackgroundColor: '#fff',
                    pointHoverBorderWidth: 2,
                    pointRadius: 1,
                    pointHitRadius: 10,
                    data: this.state.natural
                },

                {
                    label: 'Anxiety',
                    fill: true,
                    backgroundColor: 'rgb(255, 157, 89,0.4)',
                    borderColor: '#ff9d59',
                    borderDashOffset: 0.0,
                    pointBackgroundColor: '#fff',
                    pointHoverBorderWidth: 2,
                    pointRadius: 1,
                    pointHitRadius: 10,
                    data: this.state.anxiety
                },

                {
                    label: 'Disgust',
                    fill: true,
                    backgroundColor: 'rgba(94, 188, 255,0.4)',
                    borderColor: '#5ebcff',
                    borderDashOffset: 0.0,
                    pointBackgroundColor: '#fff',
                    pointHoverBorderWidth: 2,
                    pointRadius: 1,
                    pointHitRadius: 10,
                    data: this.state.disgust
                },

                {
                    label: 'Surprise',
                    fill: true,
                    backgroundColor: 'rgba(63, 252, 72,0.4)',
                    borderColor: '#3ffc48',
                    borderDashOffset: 0.0,
                    pointBackgroundColor: '#fff',
                    pointHoverBorderWidth: 2,
                    pointRadius: 1,
                    pointHitRadius: 10,
                    data: this.state.surprise
                },

                {
                    label: 'Anger',
                    fill: true,
                    backgroundColor: 'rgba(195, 105, 132,0.4)',
                    borderColor: '#C36984',
                    borderDashOffset: 0.0,
                    pointBackgroundColor: '#fff',
                    pointHoverBorderWidth: 2,
                    pointRadius: 1,
                    pointHitRadius: 10,
                    data: this.state.anger
                },

                {
                    label: 'Joy',
                    fill: true,
                    backgroundColor: 'rgba(255, 204, 102,0.4)',
                    borderColor: '#FFCC66',
                    borderDashOffset: 0.0,
                    pointBackgroundColor: '#fff',
                    pointHoverBorderWidth: 2,
                    pointRadius: 1,
                    pointHitRadius: 10,
                    data: this.state.joy
                }
            ]
        };

        return (
            <div>
                <div className="row">
                    <Loading showloading={this.state.showloading} />
                    <div className="left-column-teaching">
                        <div className="card-topic-teaching" style={{ width: '100%' }}>
                            <div style={{ fontSize: '1.2rem', marginTop: '5px' }}>
                                Subject: {this.state.teaching.subject !== undefined ? this.state.teaching.subject : ''}&nbsp;&nbsp;
                                Date: {this.state.teaching.date !== undefined ? this.state.teaching.date : ''}&nbsp;&nbsp;
                            </div>
                            <div className={this.state.show_video ? "load-iframe" : "wait-load-iframe"}>
                                {sessionStorage.getItem("Video") !== null && this.state.key_id.teaching_key !== '' && this.state.show_video === true ?
                                    // <img style={{ width: '95%', height: '450px' }} src={`http://13.229.233.187:5000/api/video/open?url=${sessionStorage.getItem("Video")}&id_teaching=${this.state.key_id.teaching_key}`} />
                                    <img style={{ width: '95%', height: '450px' }} src={`http://127.0.0.1:5000/api/video/open?url=${sessionStorage.getItem("Video")}&id_teaching=${this.state.key_id.teaching_key}`} />
                                    : null
                                }
                            </div>
                            <button
                                className="btn btn-sm"
                                style={{ backgroundColor: '#118ab2', color: '#fff', borderRadius: '5px', marginLeft: '25px', marginRight: '15px' }}
                                onClick={() => this._startTeaching()}
                            >
                                Start Teaching
                            </button>
                            <button
                                className="btn btn-sm"
                                style={{ backgroundColor: '#e63946', color: '#fff', borderRadius: '5px', marginRight: '15px' }}
                                onClick={() => this._endTeaching()}
                            >
                                End Teaching
                            </button>
                        </div>
                    </div>

                    <div className="right-1-column-teaching" >
                        <div className="card-topic2-2-teaching">
                            <div style={{ fontSize: '1.2rem' }}><p>Information for show reaction</p></div>
                            <div className="flex-container-teaching">
                                <div>
                                    Natural
                                    <br></br><img src={require('../../assets/img/icons8-slightly-smiling-face-48.png')} width="35%" className="img-responsive" /><br></br>
                                    {this.state.emotion.natural}
                                </div>

                                <div>
                                    Anxiety
                                    <br></br><img src={require('../../assets/img/icons8-sad-but-relieved-face-48.png')} width="35%" className="img-responsive" /><br></br>
                                    {this.state.emotion.anxiety}
                                </div>

                                <div>
                                    Disgust
                                    <br></br><img src={require('../../assets/img/icons8-bored-48.png')} width="35%" className="img-responsive" /><br></br>
                                    {this.state.emotion.disgust}
                                </div>

                                <div>
                                    Surprise
                                    <br></br><img src={require('../../assets/img/icons8-surprised-48.png')} width="35%" className="img-responsive" /><br></br>
                                    {this.state.emotion.surprise}
                                </div>

                                <div>
                                    Anger
                                    <br></br><img src={require('../../assets/img/icons8-angry-48.png')} width="35%" className="img-responsive" /><br></br>
                                    {this.state.emotion.anger}
                                </div>

                                <div>
                                    Joy
                                    <br></br><img src={require('../../assets/img/icons8-hugging-face-48.png')} width="35%" className="img-responsive" /><br></br>
                                    {this.state.emotion.joy}
                                </div>

                                <div className="card-topic1-teaching" style={{ width: '100%', height: '300px' }}>
                                    <div style={{ width: '100%', height: '100%' }}>
                                        <Bar
                                            data={data_bar}
                                            options={{
                                                maintainAspectRatio: false,
                                                legend: { display: true },
                                                responsive: true,
                                                scales: {
                                                    yAxes: [{ ticks: { beginAtZero: true } }]
                                                }
                                            }}
                                        />
                                    </div>
                                </div>

                                <div className="card-topic2-3-teaching" style={{ width: '100%', height: '100%' }}>
                                    <div style={{ width: '100%', }}>
                                        <div className="flex-container3-teaching">
                                            <div>
                                                <div className="div-box5-teaching">
                                                    <img src={require('../../assets/img/icons8-good-quality-100.png')} width="35%" className="img-responsive" />
                                        &nbsp; &nbsp; &nbsp;  &nbsp; &nbsp;  &nbsp; Like &nbsp;
                                        {(((this.state.emotion.natural + this.state.emotion.joy + this.state.emotion.surprise) / (this.state.emotion.natural + this.state.emotion.joy + this.state.emotion.surprise + this.state.emotion.disgust + this.state.emotion.anger + this.state.emotion.anxiety)) * 100).toFixed(2)}%
                                    </div>
                                            </div>

                                            <div>
                                                <div className="div-box5-teaching">
                                                    <img src={require('../../assets/img/icons8-thumbs-down-64.png')} width="35%" className="img-responsive" />
                                        Don't Like &nbsp;
                                        {(((this.state.emotion.disgust + this.state.emotion.anger + this.state.emotion.anxiety) / (this.state.emotion.natural + this.state.emotion.joy + this.state.emotion.surprise + this.state.emotion.disgust + this.state.emotion.anger + this.state.emotion.anxiety)) * 100).toFixed(2)}%
                                    </div>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="center-column1-teaching">
                        <div className="card-topic3-teaching">
                            <div style={{ width: '100%', height: '400px' }}>
                                <Line data={data_line}
                                    redraw={count_time === 60 || count_time === 0 ? true : false}
                                    options={{
                                        maintainAspectRatio: false,
                                        legend: { display: true },
                                        responsive: true,
                                        scales: {
                                            yAxes: [{ ticks: { beginAtZero: true } }]
                                        }
                                    }} />
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        )
    }
}

