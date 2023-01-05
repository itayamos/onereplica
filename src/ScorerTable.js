import React from "react";
import './App.css';
import axios from "axios";

class League extends React.Component{


    state={
        loading:true,
        temp:"",
        top:[]
    }

    checkTemp=()=>{
        if(this.state.temp===""){
            this.state.temp=this.props.leagues;
        }
        if(this.state.temp!==this.props.leagues){
            this.state.temp=this.props.leagues;
            this.setState({top:[],loading:false});
        }
    }

    topScorers=(league)=>{
        axios.get("https://app.seker.live/fm1/history/"+league)
            .then((response)=>{
                this.setState({loading:true});
                let arr=[];

                let x=response.data;
                let y;
                let scorer;
                let scorerId;
                let scorerName;
                x.map((q) => {
                    //games
                    y = q.goals;
                    if (y.length > 0) {
                        y.map((g) => {
                            //goals
                            scorer=g.scorer;
                            scorerName=scorer.firstName+" "+scorer.lastName;
                            scorerId=scorer.id;
                            if(!arr.filter((z)=>{return(scorerId===z.id)}).length>0){
                                arr.push({id:scorerId,name:scorerName,goals:0});
                            }
                            if(arr.filter((z)=>{return(scorerId===z.id)}).length>0){
                                arr.map((w)=>{
                                    if(w.id===scorerId){
                                        return(w.goals=w.goals+1);
                                    }
                                });
                            }
                        });
                    }
                });
                this.setState({top:arr,loading:false});
            });
        return this.state.top;
    }


    sortingTable = (scorers) => {
        scorers.sort((a, b) => {
            if (a.goals < b.goals) {
                return 1;
            }
            if (a.goals > b.goals) {
                return -1;
            }
            return 0;
        });
        return scorers;
    }
    force(league){
        this.checkTemp();
        this.topScorers(league);
        //this.setState({top:this.sortingTable(this.state.top)});
        let tempArr=this.sortingTable(this.state.top),arr=[];
        if (tempArr.length>4){
            //for (let i = 0; i < 5; i++) {arr.push(this.state.top[i]);}
            arr=tempArr.filter((player)=>{
                return(0<=tempArr.indexOf(player)&&tempArr.indexOf(player)<=4);
            });
        }

        return(
            <table>
                <tr> <td>rank</td> <td>name</td> <td>goals</td> </tr>
                {arr.map((player)=>{
                    return(
                        <tr> <td>{arr.indexOf(player)+1}</td> <td>{player.name}</td> <td>{player.goals}</td> </tr>
                    );
                })}
            </table>
        );
    }


    render(){
        return (
            <div className="App">
                {(this.state.top.length===0||this.state.loading)&&
                    <div className="three-body">
                        <div className="three-body__dot"></div>
                        <div className="three-body__dot"></div>
                        <div className="three-body__dot"></div>
                    </div>
                }
                top scorers: {this.force(this.state.temp)}
            </div>
        );
    }
}

export default League;
