import React from "react";
import "./App.css";
import {BrowserRouter, NavLink, Route, Routes, Router} from "react-router-dom";
import LeagueTable from "./LeagueTable";
import ScorerTable from "./ScorerTable";
import Statistics from "./Statistics";
import Games from "./Games";
import logo from "./LOGO.jpg";
class App extends React.Component{
    state={
        league:1,
        loading:false
    }
    leagueChange = (event) => {
        this.setState({
            league: event.target.value
        });

    }


    render() {
        return(
            <div className="one">
                <img src={logo} style={{width:200,height:100}}/>
                <select value={this.state.league} onChange={this.leagueChange}>
                <option value={""} disabled={true}>select league</option>
                <option value={1}>english</option>
                <option value={2}>spanish</option>
                <option value={3}>italian</option>
                </select>
                <BrowserRouter>
                    <NavLink to={"/"} style={{borderColor:"gold",borderStyle:"solid",backgroundColor:"#FFD70080"}}>league table</NavLink>
                    <NavLink to={"/ScorerTable"} style={{borderColor:"gold",borderStyle:"solid",backgroundColor:"#FFD70080"}}> top scorer table</NavLink>
                    <NavLink to={"/Games"} style={{borderColor:"gold",borderStyle:"solid",backgroundColor:"#FFD70080"}}>Games</NavLink>
                    <NavLink to={"/Statistics"} style={{borderColor:"gold",borderStyle:"solid",backgroundColor:"#FFD70080"}}>statistics</NavLink>
                    <Routes>
                        <Route path={"/"} element={<LeagueTable leagues={this.state.league}/>}/>
                        <Route path={"/ScorerTable"} element={<ScorerTable leagues={this.state.league}/>}/>
                        <Route path={"/Games"} element={<Games leagues={this.state.league}/>}/>
                        <Route path={"/Statistics"} element={<Statistics leagues={this.state.league}/>}/>
                    </Routes>
                </BrowserRouter>
            </div>
        )
    }
}
export default App;