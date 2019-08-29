import React, { Component } from 'react'
import * as d3 from 'd3'


class PercentRing extends Component {
    
    componentDidMount(){

        const width = 200,
            height = 200,
            pi = 2 * Math.PI;
        
        const angle = ( this.props.ringData.percentB / 100 ) * pi ;

        const svg = d3.select(this.refs.temperatures)
            .append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", `translate( ${ width/2 }, ${ (height/2) } )`)
  

        svg
        .append("path")
        .datum({endAngle: pi})
        .style("fill", this.props.ringData.colorA)
        .attr("d", this.arc); 


        svg
        .append("path")
        .datum({endAngle: 0})
        .style("fill", this.props.ringData.colorB)
        .attr("d", this.arc)
        .transition()
        .duration(1500)
        .call(this.arcAnimation, angle);

 
        svg
        .append("text")
        .attr("x", 0)
        .attr("y", 10)
        .attr("text-anchor", "middle")
        .attr("font-weight", "bold")
        .attr("font-size", "20px")
        .text( this.amountFormat( this.props.ringData.amount ) )

        svg
        .append("text")
        .attr("x", 0)
        .attr("y", -15)
        .attr("text-anchor", "middle")
        .attr("fill", "gray")
        .text( this.props.ringData.unit )
        
        this.createGraph(svg)
      
    }
    
    arc = d3.arc()
        .innerRadius(70)
        .outerRadius(75)
        .startAngle(0);

    arcAnimation = (transition, newAngle) => {
        transition.attrTween("d", (d) => {  
            const interpolate = d3.interpolate(d.endAngle, newAngle);
            return (t) => {
              d.endAngle = interpolate(t);
              return this.arc(d);
            };
        });
    }
    
    // function taken from https://medium.com/@louisemoxy/how-to-create-a-stacked-area-chart-with-d3-28a2fee0b8ca
    createGraph = (svg) => {
        const stack = d3.stack().keys(["bData"]);
        const stackedValues = stack(this.props.graphData);
        const stackedData = [];

        stackedValues.forEach((layer, index) => {
            const currentStack = [];
            layer.forEach((d, i) => {
                currentStack.push({
                    values: d,
                    year: this.props.graphData[i].year
                });
            });
            stackedData.push(currentStack);
        });
        
        const yScale = d3
            .scaleLinear()
            .range([70, 10])
            .domain([0, d3.max(stackedValues[stackedValues.length - 1], dp => dp[1])]);

        const xScale = d3
            .scaleLinear()
            .range([-70, 70])
            .domain(d3.extent(this.props.graphData, dataPoint => dataPoint.year));

        const area = d3
            .area()
            .x(dataPoint => xScale(dataPoint.year))
            .y0(dataPoint => yScale(dataPoint.values[0]))
            .y1(dataPoint => yScale(dataPoint.values[1]));

        const series = svg
            .selectAll(".series")
            .data(stackedData)
            .enter()

        series.append("clipPath")      
            .attr("id", "ellipse-clip") 
            .append("ellipse")            
            .attr("cx", 0)           
            .attr("cy", 0)            
            .attr("rx", 70)          
            .attr("ry", 70)

        series
            .append("path")
            .attr("clip-path","url(#ellipse-clip)")
            .style("fill", this.props.ringData.colorA)
            .attr("stroke", this.props.ringData.colorB)
            .attr("opacity", 0.2)
            .attr("stroke-width", 1.5)
            .attr("d", d => area(d))
    }
 
    amountFormat = amount => {
        const currency = this.props.ringData.currency ? this.props.ringData.currency : ""
        return amount.toLocaleString() + currency;
    }

    render(){
        const data = this.props.ringData
        return(
            <div className="percentRing" >
                <div ref="temperatures"></div>
                <br />
                <div className="percentRing-details">
                    <div>
                        <span style={{color: data.colorA}} className="percentRing-details-title">
                            Tablet
                        </span>
                        <br />
                        <span className="percentRing-details-percent">
                            { 100 - data.percentB }%
                        </span>
                        <span className="percentRing-details-amount">
                            { this.amountFormat( (100 - data.percentB) * data.amount / 100 ) }
                        </span>
                    </div>
                    <div>
                        <span style={{color: data.colorB}} className="percentRing-details-title">
                            Smartphone
                        </span>
                        <br />
                        <span className="percentRing-details-percent">
                            { data.percentB }%
                        </span>
                        <span className="percentRing-details-amount">
                            { this.amountFormat( data.percentB * data.amount / 100 ) }
                        </span>
                    </div>
                </div>
            </div>
        )
    }
}
export default PercentRing