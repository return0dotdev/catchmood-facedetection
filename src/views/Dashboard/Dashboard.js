import React, { Component } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import '../../assets/css/dashboard.css';
import Loading from '../../containers/loading/loading'
import { Player, BigPlayButton } from 'video-react';
import "../../../node_modules/video-react/dist/video-react.css";

import TeachingModel from '../../models/TeachingModel';

const teaching_model = new TeachingModel();

export default class Dashboard extends Component {
    constructor(props) {
        super(props)
        this.state = {
            login: JSON.parse(localStorage.getItem('login')),
            teaching: [],
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
            const teaching_key = this.props.match.params.teaching_key;
            const teaching = await teaching_model.getTeaching({
                uid: this.state.login.uid,
                courseKey: course_key,
                termKey: term_key,
                teachKey: teaching_key
            })
            let teaching_data = JSON.parse(teaching)
            teaching_data.emotion_anger = teaching_data.emotion_anger.split(",")
            teaching_data.emotion_anxiety = teaching_data.emotion_anxiety.split(",")
            teaching_data.emotion_disgust = teaching_data.emotion_disgust.split(",")
            teaching_data.emotion_joy = teaching_data.emotion_joy.split(",")
            teaching_data.emotion_natural = teaching_data.emotion_natural.split(",")
            teaching_data.emotion_surprise = teaching_data.emotion_surprise.split(",")
            this.setState({
                teaching: teaching_data,
                showloading: false
            })
        })
    }

    render() {
        let Natural = 0
        let Anxiety = 0;
        let Disgust = 0;
        let Surprise = 0;
        let Anger = 0;
        let Joy = 0;
        let label_line = []
        let time = new Date(0)
        time.setHours(0)
        if (this.state.teaching.emotion_natural !== undefined) {
            Natural = this.state.teaching.emotion_natural.reduce((a, b) => parseInt(a) + parseInt(b), 0)
            this.state.teaching.emotion_natural.map((item) => {
                time.setMinutes(time.getMinutes() + 5)
                label_line.push(time.getHours() + ":" + time.getMinutes() + ":" + time.getSeconds())
            })
        }
        if (this.state.teaching.emotion_anxiety !== undefined) {
            Anxiety = this.state.teaching.emotion_anxiety.reduce((a, b) => parseInt(a) + parseInt(b), 0)
        }
        if (this.state.teaching.emotion_disgust !== undefined) {
            Disgust = this.state.teaching.emotion_disgust.reduce((a, b) => parseInt(a) + parseInt(b), 0)
        }
        if (this.state.teaching.emotion_surprise !== undefined) {
            Surprise = this.state.teaching.emotion_surprise.reduce((a, b) => parseInt(a) + parseInt(b), 0)
        }
        if (this.state.teaching.emotion_anger !== undefined) {
            Anger = this.state.teaching.emotion_anger.reduce((a, b) => parseInt(a) + parseInt(b), 0)
        }
        if (this.state.teaching.emotion_joy !== undefined) {
            Joy = this.state.teaching.emotion_joy.reduce((a, b) => parseInt(a) + parseInt(b), 0)
        }

        const data_bar = {
            labels: ['Chart for Show all the emotions that come up.'],
            datasets: [
                {
                    label: 'Natural',
                    backgroundColor: 'rgba(102, 123, 173,0.4)',
                    borderColor: '#667BAD',
                    borderWidth: 1.2,
                    data: [Natural]
                },

                {
                    label: 'Anxiety',
                    backgroundColor: 'rgb(255, 157, 89,0.4)',
                    borderColor: '#ff9d59',
                    borderWidth: 1.2,
                    data: [Anxiety]
                },

                {
                    label: 'Disgust',
                    backgroundColor: 'rgba(94, 188, 255,0.4)',
                    borderColor: '#5ebcff',
                    borderWidth: 1.2,
                    data: [Disgust]
                },

                {
                    label: 'Surprise',
                    backgroundColor: 'rgba(63, 252, 72,0.4)',
                    borderColor: '#3ffc48',
                    borderWidth: 1.2,
                    data: [Surprise]
                },

                {
                    label: 'Anger',
                    backgroundColor: 'rgba(195, 105, 132,0.4)',
                    borderColor: '#C36984',
                    borderWidth: 1.2,
                    data: [Anger]
                },

                {
                    label: 'Joy',
                    backgroundColor: 'rgba(255, 204, 102,0.4)',
                    borderColor: '#FFCC66',
                    borderWidth: 1.2,
                    data: [Joy]
                }
            ]
        };

        const data_line = {
            labels: label_line,
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
                    data: this.state.teaching.emotion_natural !== undefined ? this.state.teaching.emotion_natural : []
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
                    data: this.state.teaching.emotion_anxiety !== undefined ? this.state.teaching.emotion_anxiety : []
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
                    data: this.state.teaching.emotion_disgust !== undefined ? this.state.teaching.emotion_disgust : []
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
                    data: this.state.teaching.emotion_surprise !== undefined ? this.state.teaching.emotion_surprise : []
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
                    data: this.state.teaching.emotion_anger !== undefined ? this.state.teaching.emotion_anger : []
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
                    data: this.state.teaching.emotion_joy !== undefined ? this.state.teaching.emotion_joy : []
                }
            ]
        };
        return (
            <div style={{ marginTop: '-20px', marginBottom: '20px' }}>
                <div className="row">
                    <Loading showloading={this.state.showloading} />
                    {this.state.teaching.link_video !== '' && this.state.teaching.link_video !== undefined ?
                        <div className="center-column2-dashboard">
                            <div className="card-topic3-1-dashboard">
                                <div style={{ height: '100%' }}>
                                    <div style={{ fontSize: '1.2rem', padding: '10px', float: 'left' }}><b>Show or Hide Video</b> </div>
                                    <button className="btn" style={{
                                        backgroundColor: '#ffe98f', color: 'white', float: 'right', height: '50px',
                                        borderRadius: '0px 20px 5px 0px'
                                    }}
                                        onClick={() => { this.setState({ show: !this.state.show }) }}>
                                        {this.state.show ?
                                            <img src="https://img.icons8.com/fluent/48/000000/minimize-window--v2.png" style={{ width: '30px' }} />
                                            :
                                            <img src="https://img.icons8.com/fluent/48/000000/maximize-window.png" style={{ width: '30px' }} />}
                                    </button>
                                    {this.state.show ?
                                        <div style={{ display: 'flex',marginBottom: '10px', paddingTop: '50px', justifyContent: 'center' }}>
                                            <Player width={720} height={400} fluid={false}>
                                                <BigPlayButton position="center" />
                                                <source src={this.state.teaching.status === 'video' ?
                                                    `${this.state.teaching.link_video}`
                                                    :
                                                    // `http://13.229.233.187:5000/${this.state.teaching.link_video}`
                                                    `http://127.0.0.1:5000/${this.state.teaching.link_video}`
                                                } />
                                            </Player>
                                        </div> : null
                                    }
                                </div>
                            </div>
                        </div>
                        : ''
                    }
                    <div className="center-column2-dashboard">
                        <div className="card-topic3-dashboard">
                            <div style={{ width: `100%`, height: '400px' }}>
                                <Line data={data_line}
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


                    <div className="left-column-dashboard">
                        <div className="card-topic-dashboard" style={{ width: '100%', height: '300px' }}>
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
                    </div>

                    <div className="right-1-column-dashboard">
                        <div className="card-topic2-2-dashboard">
                            <div style={{ fontSize: '0.8rem' }}><p>Pie Chart for show reaction</p></div>
                            <div className="flex-container-dashboard">
                                <div>
                                    Natural
                                <br></br><img src={require('../../assets/img/icons8-slightly-smiling-face-48.png')} width="35%" className="img-responsive" /><br></br>
                                    {Natural}
                                </div>

                                <div>
                                    Anxiety
                                <br></br><img src={require('../../assets/img/icons8-sad-but-relieved-face-48.png')} width="35%" className="img-responsive" /><br></br>
                                    {Anxiety}
                                </div>

                                <div>
                                    Disgust
                                <br></br><img src={require('../../assets/img/icons8-bored-48.png')} width="35%" className="img-responsive" /><br></br>
                                    {Disgust}
                                </div>

                                <div>
                                    Surprise
                                <br></br><img src={require('../../assets/img/icons8-surprised-48.png')} width="35%" className="img-responsive" /><br></br>
                                    {Surprise}
                                </div>

                                <div>
                                    Anger
                                <br></br><img src={require('../../assets/img/icons8-angry-48.png')} width="35%" className="img-responsive" /><br></br>
                                    {Anger}
                                </div>

                                <div>
                                    Joy
                                <br></br><img src={require('../../assets/img/icons8-hugging-face-48.png')} width="35%" className="img-responsive" /><br></br>
                                    {Joy}
                                </div>

                            </div>
                        </div>
                    </div>

                    <div className="right-2-column-dashboard">
                        <div className="card-topic2-2-dashboard">
                            <div style={{ width: '90%', }}>
                                <div style={{ fontSize: '0.8rem' }}><p>Tab for show Like or Don't Like in Percent</p></div>
                                <div className="flex-container3-dashboard">

                                    <div>
                                        <div className="div-box5-dashboard">
                                            <img src={require('../../assets/img/icons8-good-quality-100.png')} width="35%" />
                                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; Like &nbsp;
                                    {(((Natural + Joy + Surprise) / (Natural + Joy + Surprise + Disgust + Anger + Anxiety)) * 100).toFixed(2)}%
                                </div>
                                    </div>

                                    <div>
                                        <div className="div-box5-dashboard">
                                            <img src={require('../../assets/img/icons8-thumbs-down-64.png')} width="35%" />
                                    Don't Like &nbsp;
                                    {(((Disgust + Anger + Anxiety) / (Natural + Joy + Surprise + Disgust + Anger + Anxiety)) * 100).toFixed(2)}%
                                </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

