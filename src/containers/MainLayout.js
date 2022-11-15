import React, { Component, Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import Swal from 'sweetalert2';
import styled from 'styled-components';
import { Container } from 'reactstrap';
import { Link } from 'react-router-dom';
import SideNav, { Toggle, Nav, NavItem, NavIcon, NavText } from '@trendmicro/react-sidenav';
import '@trendmicro/react-sidenav/dist/react-sidenav.css';
import '../assets/css/span-color-nav.css'
import routes from '../routes';
import Loading from '../containers/loading/loading'

import CourseModel from '../models/CourseModel';

const course_model = new CourseModel();

const Main = styled.main`
    position: relative;
    overflow: hidden;
    transition: all .15s;
    padding: 0 20px;
    margin-left: ${props => (props.expanded ? 240 : 64)}px;
`;
const NavHeader = styled.div`
    display: ${props => (props.expanded ? 'block' : 'none')};
    white-space: nowrap;
    > * {
        color: inherit;
        background-color: inherit;
    }
`;

const NavTitle = styled.div`
    font-size: 2em;
    line-height: 20px;
    padding: 10px 0;
`;

class MainLayout extends Component {
    constructor(props) {
        super(props)
        this.state = {
            active_menu: '',
            login: JSON.parse(localStorage.getItem('login')),
            course_list: [],
            expanded: false,
            showloading: false,
        }
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.location.pathname !== nextProps.location.pathname) {
            this.setState({
                active_menu: nextProps.location.pathname
            })
        }
    }

    componentDidMount() {
        this._fetchData()
    }

    async _fetchData() {
        this.setState({
            showloading: true,
        }, async () => {
            const course = await course_model.allCourse({ uid: this.state.login.uid })
            this.setState({
                course_list: JSON.parse(course),
                showloading: false
            })
        })
    }

    _onLogout() {
        localStorage.removeItem('login');
        window.location.reload()
    }
    _onToggle = (expanded) => {
        this.setState({ expanded: expanded });
    };

    async _showFrom() {
        const { value: formValues } = await Swal.fire({
            title: 'Add Courses',
            html:
                '<div class="row">' +
                '<div class="col-3 text-input-box">Course ID </div>' +
                '<div class="col-9 row-padding"><input id="swal-input1" class="swal2-input input-box" ></div>' +
                '</div>' +
                '<div class="row">' +
                '<div class="col-3 text-input-box">Course Name </div>' +
                '<div class="col-9 row-padding"><input id="swal-input2" class="swal2-input input-box"></div>' +
                '</div>',
            customClass: 'swal-wide',
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonText: 'OK',
            confirmButtonColor: '#667BAD',
            preConfirm: () => {
                return [
                    document.getElementById('swal-input1').value,
                    document.getElementById('swal-input2').value
                ]
            }
        })

        if (formValues) {
            if (formValues[0] === "" || formValues[1] === "") {
                Swal.fire({
                    icon: 'warning',
                    title: 'Please Input Course ID and Course Name',
                })
            } else {
                this.setState({
                    showloading: true,
                }, async () => {
                    const course = await course_model.createCourse({
                        uid: this.state.login.uid,
                        courseId: formValues[0],
                        courseName: formValues[1],
                    })

                    if (course === "Success") {
                        Swal.fire({
                            icon: 'success',
                            title: 'Create Course Success',
                        }).then((res) => {
                            window.location.reload()
                        })    
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Create Course Error',
                        })
                    }
                    this.setState({
                        showloading: false
                    })
                })
            }
        }
    }
    render() {
        const { login, expanded } = this.state
        return (
            <div className="app">
                <Loading showloading={this.state.showloading} />
                <div id="wrapper" style={{ marginLeft: "0" }}>
                    <SideNav
                        onSelect={(selected) => {
                            const to = '/' + selected;
                            if (this.props.location.pathname !== to) {
                                this.props.history.push(to);
                            }
                        }}
                        onToggle={this._onToggle}
                        className="nav-style"
                    >
                        <Toggle className="color-span" style={{ width: '40px' }} />
                        <NavHeader expanded={expanded} style={{ direction: 'ltr' }}>
                            <NavTitle style={{ fontSize: '1.2rem', color: '#707070', fontWeight: 'bold' }}>
                                <img src={require('../assets/img/icons8-cat-head-482x.png')} width="40px" style={{ marginRight: '5px' }} />
                                Catch Mood
                            </NavTitle>
                        </NavHeader>
                        <Nav expanded={expanded} style={{ direction: 'ltr' }}>
                            <NavItem disabled className={"add-course-background"} onClick={() => this._showFrom()}>
                                <NavIcon>
                                    <i
                                        className="fa fa-plus"
                                        style={{ fontSize: '1.5em', color: "#000", paddingTop: '15px', paddingRight: '5px' }}
                                    />
                                </NavIcon>
                                <NavText style={{ color: "#707070" }} > Add Courses </NavText>
                            </NavItem>
                            {this.state.course_list.map((item, no) => (
                                <NavItem
                                    key={no}
                                    eventKey={`course/${item.courseKey}`}
                                    className={"menu-default " + (this.state.active_menu === `/course/${item.courseKey}` ? ' menu-background' : '')}
                                >
                                    <NavIcon>
                                        <i
                                            className="fas fa-book-open"
                                            style={{ fontSize: '1.5em', color: "#000", paddingTop: '15px', paddingRight: '5px' }}
                                        />
                                    </NavIcon>
                                    <NavText style={{ color: this.state.active_menu === `/course/${item.courseKey}` ? '#fff' : '#707070' }} > {item.courseName} </NavText>
                                </NavItem>
                            ))}
                        </Nav>
                    </SideNav>

                    {/* <------Menu------> */}
                    {/* <------Content------> */}
                    <Main expanded={expanded}>
                        <div className="app-header navbar">
                            <div className="app-header-sub">
                                <ul className="ml-auto navbar-nav" style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', paddingRight: '50px' }}>
                                    <div>
                                        <li className="nav-item dropdown show">
                                            <Link to='/EditProfile' style={{ width: '100%', color: 'black' }}>
                                                <i className="fa fa-user" style={{ color: "black" }}></i>&nbsp;&nbsp;
                                                {login !== null ? login.firstname + " " + login.lastname : null}
                                            </Link>&nbsp;&nbsp;
                                            <i className="fa fa-sign-out" aria-hidden="true" style={{ color: "black", cursor: 'pointer' }} onClick={() => this._onLogout()}></i>
                                        </li>
                                    </div>
                                </ul>
                            </div>
                        </div>
                        <Container fluid style={{ marginTop: '30px' }}>
                            <Suspense fallback={null}>
                                <Switch>
                                    {routes.map((route, idx) => {
                                        return route.component ? (
                                            <Route
                                                key={idx}
                                                path={route.path}
                                                exact={route.exact}
                                                name={route.name}
                                                render={props => (
                                                    <route.component {...props} />
                                                )} />
                                        ) : (null);
                                    })}
                                    <Redirect from="/" to="/" />
                                </Switch>
                            </Suspense>
                        </Container>
                    </Main>
                    {/* <------Content------> */}
                </div>
            </div>
        )
    }
}

export default MainLayout;