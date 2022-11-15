import React, { Component } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import '../../assets/css/dashboard-c.css';
import Loading from '../../containers/loading/loading'
import TermModel from '../../models/TermModel';


const term_model = new TermModel();
export default class Dashboard extends Component {
    constructor(props) {
        super(props)
        this.state = {
            login: JSON.parse(localStorage.getItem('login')),
            term_list: [],
            course_key: "",
            showloading: false,
            Natural: [],
            Anxiety: [],
            Disgust: [],
            Surprise: [],
            Anger: [],
            Joy: [],
            label: []
        }
    }

    componentDidMount() {
        this._fetchData()
    }

    async _fetchData() {
        this.setState({
            showloading: true,
        }, async () => {
            let Natural = [];
            let Anxiety = [];
            let Disgust = [];
            let Surprise = [];
            let Anger = [];
            let Joy = [];
            let label = [];

            const course_key = this.props.match.params.course_key;
            const term = await term_model.allTerm({
                uid: this.state.login.uid,
                courseKey: course_key
            })

            const select_term = await term_model.getAllTermDashboard({
                uid: this.state.login.uid,
                courseKey: course_key
            })

            let select_data = JSON.parse(select_term)
            let term_data = JSON.parse(term)

            for (let i = 0; i < select_data.length; i++) {
                Natural.push(select_data[i].sum_natural);
                Anxiety.push(select_data[i].sum_anxiety);
                Disgust.push(select_data[i].sum_disgust);
                Surprise.push(select_data[i].sum_surprise);
                Anger.push(select_data[i].sum_anger);
                Joy.push(select_data[i].sum_joy);
                label.push(select_data[i].name);
            }

            this.setState({
                term_list: term_data,
                course_key: course_key,
                showloading: false,
                Natural: Natural,
                Anxiety: Anxiety,
                Disgust: Disgust,
                Surprise: Surprise,
                Anger: Anger,
                Joy: Joy,
                label: label

            })
        })
    }

    async _filter(e) {
        const value = e.target.value;
        this.setState({
            showloading: true,
        }, async () => {
            let select_data;
            let Natural = [];
            let Anxiety = [];
            let Disgust = [];
            let Surprise = [];
            let Anger = [];
            let Joy = [];
            let label = [];

            if (value === "All Course") {
                const term = await term_model.getAllTermDashboard({
                    uid: this.state.login.uid,
                    courseKey: this.state.course_key
                })
                select_data = JSON.parse(term)
            } else {
                const term = await term_model.getTermDashboard({
                    uid: this.state.login.uid,
                    courseKey: this.state.course_key,
                    termKey: value
                })
                select_data = JSON.parse(term)
            }

            for (let i = 0; i < select_data.length; i++) {
                Natural.push(select_data[i].sum_natural);
                Anxiety.push(select_data[i].sum_anxiety);
                Disgust.push(select_data[i].sum_disgust);
                Surprise.push(select_data[i].sum_surprise);
                Anger.push(select_data[i].sum_anger);
                Joy.push(select_data[i].sum_joy);
                label.push(select_data[i].name);
            }

            this.setState({
                showloading: false,
                Natural: Natural,
                Anxiety: Anxiety,
                Disgust: Disgust,
                Surprise: Surprise,
                Anger: Anger,
                Joy: Joy,
                label: label
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


        if (this.state.Natural !== undefined) {
            Natural = this.state.Natural.reduce((a, b) => a + b, 0)
        }
        if (this.state.Anxiety !== undefined) {
            Anxiety = this.state.Anxiety.reduce((a, b) => a + b, 0)
        }
        if (this.state.Disgust !== undefined) {
            Disgust = this.state.Disgust.reduce((a, b) => a + b, 0)
        }
        if (this.state.Surprise !== undefined) {
            Surprise = this.state.Surprise.reduce((a, b) => a + b, 0)
        }
        if (this.state.Anger !== undefined) {
            Anger = this.state.Anger.reduce((a, b) => a + b, 0)
        }
        if (this.state.Joy !== undefined) {
            Joy = this.state.Joy.reduce((a, b) => a + b, 0)
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
            labels: this.state.label,
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
                    data: this.state.Natural !== undefined ? this.state.Natural : []
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
                    data: this.state.Anxiety !== undefined ? this.state.Anxiety : []
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
                    data: this.state.Disgust !== undefined ? this.state.Disgust : []
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
                    data: this.state.Surprise !== undefined ? this.state.Surprise : []
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
                    data: this.state.Anger !== undefined ? this.state.Anger : []
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
                    data: this.state.Joy !== undefined ? this.state.Joy : []
                }
            ]
        };


        return (
            <div style={{ marginTop: '-20px' }}>
                <div className="row">
                    <Loading showloading={this.state.showloading} />

                    <div className="center-column2-dashboard-c">
                        <div className="card-topic1-dashboard-c">

                            <div className="box">Choose Trimester :  <select name="filter" id="filter" onChange={(e) => this._filter(e)} defaultValue="All Course">
                                <option value="All Course">All Course</option>
                                {
                                    this.state.term_list.map((data, no) => (
                                        <option key={no} value={data.termKey} >{data.trimester}/{data.semester}</option>
                                    ))}
                            </select>
                            </div>
                        </div>
                    </div>

                    <div className="left-column-dashboard-c">
                        <div className="card-topic-dashboard-c" style={{ width: '100%', height: '300px' }}>
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

                    <div className="right-1-column-dashboard-c">
                        <div className="card-topic2-2-dashboard-c">
                            <div style={{ fontSize: '0.8rem' }}><p>Pie Chart for show reaction</p></div>
                            <div className="flex-container-dashboard-c">
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

                    <div className="right-2-column-dashboard-c">
                        <div className="card-topic2-2-dashboard-c">
                            <div style={{ width: '90%', }}>
                                <div style={{ fontSize: '0.8rem' }}><p>Tab for show Like or Don't Like in Percent</p></div>
                                <div className="flex-container3-dashboard-c">

                                    <div>
                                        <div className="div-box5-dashboard-c">
                                            <img src={require('../../assets/img/icons8-good-quality-100.png')} width="35%" className="img-responsive" />
                                    &nbsp; &nbsp; &nbsp;  &nbsp; &nbsp;  &nbsp; Like &nbsp;
                                    {(((Natural + Joy + Surprise) / (Natural + Joy + Surprise + Disgust + Anger + Anxiety)) * 100).toFixed(2)}%
                                </div>
                                    </div>

                                    <div>
                                        <div className="div-box5-dashboard-c">
                                            <img src={require('../../assets/img/icons8-thumbs-down-64.png')} width="35%" className="img-responsive" />
                                    Don't Like &nbsp;
                                    {(((Disgust + Anger + Anxiety) / (Natural + Joy + Surprise + Disgust + Anger + Anxiety)) * 100).toFixed(2)}%
                                </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="center-column2-dashboard-c">
                        <div className="card-topic3-dashboard-c">
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
                </div>
            </div>
        )
    }
}

