import React from "react";
import './App.css';
import axios from "axios";

class Statistics extends React.Component{


    state={
        loading1:false,
        loading2:false,
        loading3:false,
        firstHalf:0,
        secondHalf:0,
        goalRounds:[],
        goalMinutes:[],
        temp:""
    }
    checkTemp=()=>{
        if(this.state.temp===""){
            this.state.temp=this.props.leagues;
        }
        if(this.state.temp!==this.props.leagues) {
            this.state.temp = this.props.leagues;
            this.setState({
                loading1:false,
                loading2:false,
                loading3:false,
                firstHalf:0,
                secondHalf:0,
                goalRounds:[],
                goalMinutes:[]
            });
        }
    }
    extremumGoalsByRounds=(league)=>{
        axios.get("https://app.seker.live/fm1/history/"+league)
            .then((response)=> {
                this.setState({loading1:true});
                let arr=[];
                let x = response.data;
                let maxRound = x[x.length - 1].round;
                let minRound = 1;
                let sum=0;
                let totalGoals;
                for (let i = minRound; i < maxRound; i++) {
                    sum=0;
                    x.map((q)=>{
                        if(q.round===i){
                            totalGoals=q.goals.length;
                            sum=sum+totalGoals;
                        }
                    });
                    arr.push({round:i,goals:sum});
                }
                this.setState({goalRounds:this.sortingTable(arr),loading1:false});
                //sorting by goals
            });
    }

    goalsByHalves=(league)=>{
        axios.get("https://app.seker.live/fm1/history/"+league)
            .then((response)=> {
                this.setState({loading2:true});
                let x = response.data;
                let sum1=0;
                let sum2=0;
                let goal;
                x.map((q)=>{
                    goal=q.goals;
                    sum1=sum1+goal.filter((data)=>{
                        return(data.minute<=45);
                    }).length;
                    sum2=sum2+goal.filter((data)=>{
                        return(data.minute>45);
                    }).length;
                });
                this.setState({firstHalf:sum1,secondHalf:sum2,loading2:false});
            });
    }

    extremumGoalsByMinutes=(league)=>{
        axios.get("https://app.seker.live/fm1/history/"+league)
            .then((response)=>{
                this.setState({loading3:true});
                let arr=[];
                let goal;
                let x=response.data;
                x.map((q)=>{
                    goal=q.goals;
                    goal.map((data)=>{
                        if (!arr.filter((minute)=>{return(minute===data.minute);}).length>0){
                            arr.push(data.minute);
                        }
                    });
                });
                this.setState({goalMinutes:this.sortingMinutes(arr),loading3:false});
                //normal sorting
            });
    }
    //כמה גולים הובקעו במחצית הראשונה לעומת מחצית שנייה;
    // מהו הגול המוקדם ביותר שהובקע ומהו הגול המאוחר ביותר שהובקע;
    // מהו המחזור שבו הובקעו הכי הרבה שערים ומהו המחזור שבו הובקעו הכי מעט שערים.

    sortingTable = (goalsByRounds) => {
        goalsByRounds.sort((a, b) => {
            if (a.goals < b.goals) {
                return 1;
            }
            if (a.goals > b.goals) {
                return -1;
            }
            return 0;
        });
        return goalsByRounds;
    }
    sortingMinutes=(minutes)=>{
        minutes.sort((a,b)=>{
            if (a < b) {
                return 1;
            }
            if (a > b) {
                return -1;
            }
            return 0;
        });
        return minutes;
    }
    force=(league)=>{
        {this.goalsByHalves(league)}
        {this.extremumGoalsByMinutes(league)}
        {this.extremumGoalsByRounds(league)}
            return(<div>{(this.state.goalMinutes.length>0&&this.state.goalRounds.length>0&&this.state.firstHalf>0&&this.state.secondHalf>0)&&
                <div><table>
                    <tr><td>earliest goal by minute</td><td>latest goal by minute</td></tr>
                    <tr><td>{this.state.goalMinutes[this.state.goalMinutes.length-1]}</td><td>{this.state.goalMinutes[0]}</td></tr>
                </table>
                <table>
                    <tr><td>amount</td><td>goals by round(round)</td><td>goals by round(goals)</td></tr>
                    <tr><td>most</td><td>{this.state.goalRounds[0].round}</td><td>{this.state.goalRounds[0].goals}</td></tr>
                    <tr><td>least</td><td>{this.state.goalRounds[this.state.goalRounds.length-1].round}</td><td>{this.state.goalRounds[this.state.goalRounds.length-1].goals}</td></tr>
                </table>
                <table>
                    <tr><td>first half goals</td><td>second half goals</td></tr>
                    <tr><td>{this.state.firstHalf}</td><td>{this.state.secondHalf}</td></tr>
                </table></div>
            }</div>);
    }
    render(){
        return (
            <div className="App">
                {this.checkTemp()}
                {this.force(this.state.temp)}
                {(this.state.loading1||
                        this.state.loading2||
                        this.state.loading3||
                        this.state.firstHalf===0||
                        this.state.secondHalf===0)&&
                    <div className="three-body">
                    <div className="three-body__dot"></div>
                    <div className="three-body__dot"></div>
                    <div className="three-body__dot"></div>
                </div>}
            </div>
        );
    }
}

export default Statistics;
