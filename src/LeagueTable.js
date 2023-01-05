import React from "react";
import './App.css';
import axios from "axios";

class LeagueTable extends React.Component{
    state={be:[],players:[],clicked:false,stats:[],clickedRow:"",chart:[],game:[],temp:""
    }
    checkTemp=()=>{
        if(this.state.temp===""){
            this.state.temp=this.props.leagues;
        }
        if(this.state.temp!==this.props.leagues){
            this.state.temp=this.props.leagues;
            this.setState({be:[],players:[],clicked:false,stats:[],clickedRow:"",chart:[],game:[]});
        }
    }
    isClicked=(id)=>{
        this.state.clickedRow=id;
        alert(id+"="+this.state.clickedRow);
        if(Number.isInteger(this.state.clickedRow)){
            this.games(this.state.temp,this.state.clickedRow);
            this.squad(this.state.temp,this.state.clickedRow);
        }
    }

    groups= (league)=>{
        axios.get("https://app.seker.live/fm1/teams/"+league).then((response)=>{
            let arr=[];
            let x=response.data;
            let y;
            let z;
            x.map((q) => {
                y=q.name;
                z=q.id;
                if(!arr.filter((a)=>{return(a.id===z);}).length>0){
                    arr.push({id:z,name:y,points:0, goalBalance:0});
                }
            })
            this.setState({be:arr});
        });
        //return this.state.be;
    }

    //squad
    squad=(league,teamID)=>{
        axios.get("https://app.seker.live/fm1/squad/"+league+"/"+teamID)
            .then((response)=>{
                let x=response.data;
                let arr=[];
                x.map((q)=>{
                    return (arr.push(q.firstName+" "+q.lastName));
                });
                this.setState({players:arr});
            });
    }

    displaySquad=(league,teamID)=>{
        let arr=[];
        if (this.state.players.length>0){
            arr=this.state.players;
        }
        return(<table><tr><td>players</td></tr>
            {arr.map((q)=>{
                return(
                    <tr><td>{q}</td></tr>
                );
            })}
        </table>);
    }
    //games
    games=(league,teamID)=>{
        axios.get("https://app.seker.live/fm1/history/"+league+"/"+teamID)
            .then((response)=>{
                this.setState({loading:true});
                let scores=[];
                let x=response.data;
                let y;
                let colTeam;
                let oppTeam;
                let colGoals=0;
                let oppGoals=0;
                x.map((q) => {
                    y=q.goals;
                    colTeam=q.homeTeam.name;
                    oppTeam=q.awayTeam.name;
                    if (y.length>0){

                        colGoals=(y.filter((g) => {
                            return (g.home === true);
                        })).length;

                        oppGoals=(y.filter((g) => {
                            return (g.home===false);
                        })).length;
                    }
                    scores.push({homeName:colTeam,homeGoals:colGoals,awayGoals:oppGoals,awayName:oppTeam});
                });
                this.setState({game:scores,loading:false});
            });
    }

    historyTeamData=(league,teamID)=>{
        let arr=[];
        if (this.state.game.length>0){
            arr=this.state.game;
        }

        return(<table><tr><td>home team</td><td>goals</td><td>-</td><td>goals</td><td>away team</td></tr>
                {arr.map((q)=>{
                    return(
                        <tr><td>{q.homeName}</td><td>{q.homeGoals}</td><td>-</td><td>{q.awayGoals}</td><td>{q.awayName}</td></tr>
                    );
                })}
            </table>
        );
    }

    points= (league)=>{
        if(this.state.be.length>0){
            this.state.be.map((b)=>{
                return(
                    axios.get("https://app.seker.live/fm1/history/"+league+"/"+b.id).then((response)=>{
                        let x=response.data;
                        let sumGoals=0;
                        let db=this.state.be;
                        let wins=0;
                        let draws=0;
                        let homeTeam;
                        let goalData;
                        if(x.length>0) {
                            x.map((q) => {
                                homeTeam = q.homeTeam.id === b.id;
                                goalData = q.goals;
                                if (goalData.length > 0) {
                                    let colGoals = (goalData.filter((g) => {
                                        return (g.home === homeTeam);
                                    })).length;

                                    let oppGoals = (goalData.filter((g) => {
                                        return (g.home !== homeTeam);
                                    })).length;
                                    sumGoals = sumGoals + colGoals - oppGoals;
                                    if (colGoals > oppGoals) {
                                        wins++;
                                    } else if (colGoals === oppGoals) {
                                        draws++;
                                    }

                                } else {
                                    draws++;
                                }

                            });
                        }
                        db.map((k)=>{
                            if(k.id===b.id){
                                k.points=3*wins+draws;
                                k.goalBalance=sumGoals;
                            }
                        });
                        this.setState({be:db});
                    })
                );
            });
        }


    }
    mySort=(teams)=>{
        teams.sort((a, b) => {
            if (a.points < b.points) {
                return 1;
            }
            if (a.points > b.points) {
                return -1;
            }

            if (a.goalBalance < b.goalBalance) {
                return 1;
            }
            if (a.goalBalance > b.goalBalance) {
                return -1;
            }
            if (a.name < b.name) {
                return -1;
            }
            if (a.name > b.name) {
                return 1;
            }
            return 0;
        });
        return teams;
    }

    force(league){this.checkTemp()
        this.groups(league);
        this.points(league);
        const nonDefault=this.state.be.filter((a)=>{return(a.points===0)}).length>0;
        if(!nonDefault){
            this.state.chart=this.mySort(this.state.be);
        }
        return (<table><tr><td>rank</td> <td>name</td> <td>points</td> <td>goal balance</td> </tr>
            {this.state.chart.map((q)=>{
                return(<tr onClick={()=>{this.isClicked(q.id)}}  className={"row"+(this.state.chart.indexOf(q)+1)} ><td>{this.state.chart.indexOf(q)+1}</td><td>{q.name}</td><td>{q.points}</td><td>{q.goalBalance}</td></tr>);
            })}
        </table>);
    }

    render(){

        return (
            <div className="App">
                {}
                {((this.state.chart.filter((q)=>{return(q.points===0);}).length>0))&&
                    <div className="three-body">
                        <div className="three-body__dot"></div>
                        <div className="three-body__dot"></div>
                        <div className="three-body__dot"></div>
                    </div>
                }
                {this.force(this.state.temp)}
                {this.historyTeamData(this.state.temp,this.state.clickedRow)}
                {this.displaySquad(this.state.temp,this.state.clickedRow)}

            </div>
        );
    }
}

export default LeagueTable;
