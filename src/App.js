import React, { Component } from 'react';
import PercentRing from './PercentRing'
import './App.scss';
import {graphData, data} from './data'


class App extends Component{

    render(){
        const rings = data.map( (ring,index) => {
            return <PercentRing
                    ringData={ring}
                    graphData={graphData}
                    key={index} />
        });
        
        return (
            <div className="App">
              {rings}
            </div>
          );
    }
  
}

export default App;
