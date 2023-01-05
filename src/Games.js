import React from "react";
import './App.css';
import axios from "axios";

class Games extends React.Component{


    state={temp:"",
        toto:[],
        max:1,
        minValue:1,
        maxValue:1,
        loading:false
    }

    checkTemp=()=>{
        if(this.state.temp===""){
            this.state.temp=this.props.leagues;
        }
        if(this.state.temp!==this.props.leagues){
            this.state.temp=this.props.leagues;
            this.setState({
                toto:[],
                max:1,
                minValue:1,
                maxValue:1,
                loading:false});
            //this.state.temp=this.props.leagues;
        }
    }

    minValueChanged = (event) => {
        let val= event.target.value;
        if(val<1){
            val=1;
        }
        if(val>this.state.maxValue){
            val=this.state.maxValue;
        }
        this.setState({
            minValue: val
        });
    }
    maxValueChanged = (event) => {
        let val= event.target.value;
        if(val>this.state.max){
            val=this.state.max;
        }
        if(val<this.state.minValue){
            val=this.state.minValue;
        }
        this.setState({
            maxValue:val
        });
    }

    games=(league,min,max)=>{

        axios.get("https://app.seker.live/fm1/history/"+league)
            .then((response)=>{
                this.setState({loading:true});
                let scores=[];
                let x=response.data;
                let lastMatch=x[x.length-1].round;
                this.setState({max:lastMatch});
                let goal;
                let colTeam;
                let oppTeam;
                let colGoals=0;
                let oppGoals=0;
                x.map((q) => {
                    if(min<=q.round&&q.round<=max){
                        goal=q.goals;
                        colTeam=q.homeTeam.name;
                        oppTeam=q.awayTeam.name;
                        if (goal.length>0){

                            colGoals=(goal.filter((data) => {
                                return (data.home === true);
                            })).length;

                            oppGoals=(goal.filter((data) => {
                                return (data.home===false);
                            })).length;
                        }
                        scores.push({homeName:colTeam,homeGoals:colGoals,awayGoals:oppGoals,awayName:oppTeam});
                    }
                });
                this.setState({toto:scores,loading:false});
            });
    }
    force(league,min,max){
        this.checkTemp();
        this.games(league,min,max);
        return((<table> <tr> <td>home team</td> <td>home goals</td> <td> - </td> <td>away goals</td> <td>away team</td> </tr>
            {this.state.toto.map((q)=>{
                return(<tr>
                    <td>{q.homeName}</td> <td>{q.homeGoals}</td> <td>-</td> <td>{q.awayGoals}</td> <td>{q.awayName}</td>
                </tr>);
            })}
        </table>));
    }

    render(){
        return (
            <div className="App">
                <div>
                    min: <input type={"number"} value={this.state.minValue} onChange={this.minValueChanged}/>
                    max: <input type={"number"} value={this.state.maxValue} onChange={this.maxValueChanged}/>
                    {this.force(this.state.temp,this.state.minValue,this.state.maxValue)}
                </div>
                {(this.state.toto.length===0||this.state.loading)&&
                    <div className="three-body">
                        <div className="three-body__dot"></div>
                        <div className="three-body__dot"></div>
                        <div className="three-body__dot"></div>
                    </div>
                }
            </div>
        );
    }
}

export default Games;
