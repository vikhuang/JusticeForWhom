import * as d3 from "d3";
import { path, svg, thresholdSturges } from "d3";
import { useEffect, useRef, useState } from 'react'
import test from './test.json'

const generateDataset = () => (
    Array(10).fill(0).map(() => ([
      Math.random() * 80 + 10,
      Math.random() * 35 + 10,
    ]))
  )


  const MainViz = () => {
    const [dataset, setDataset] = useState(
       //generateDataset()
      test.slice(0,1000)
    )

    const year2Linear = d3.scaleLinear()
      .domain([36, 76]) 
      .range([0, 800])

    const penalty2Linear = d3.scaleLinear()
      .domain([0, 30])  
      .range([800, 0])

    const year2Circular = d3.scaleLinear()
      .domain([-30, 30]) 
      .range([0, 800])

    const penalty2Circular = d3.scaleLinear()
      .domain([-30, 30])  
      .range([800, 0])  

    // const line = d3.line()
    //   .x(d=> d.minD) // 設定x值要抓哪些資料
    //   .y(d=> d.maxD) // 設定y值要抓哪些資料


    const ref = useRef()
    useEffect(() => {
      const svgElement = d3.select(ref.current)
      const vector = svgElement.selectAll("vector")
        .data(dataset)
        .join("svg").attr('viewbox', '0 0 20 10')

      const tooltips = svgElement.append("rect")
          .attr('width', 100)
          .attr('height', 30)
          .attr('rx', 15)
          .attr('fill', 'red')
          .attr('fill-opacity', 0)
        
        
      vector.append('defs').append("marker")
          .attr('id', 'arrow')
          .attr('markerWidth', 9)
          .attr('markerHeight', 6)
          .attr('refX', 0)
          .attr('refY', 3)
          .attr('orient', 'auto')
        .append('path')
          .attr('d', 'M0,0 L0,6 L9,3 z')
        
      vector.append('line')
          // .attr('x1', d => year2Linear(d.minD))
          // .attr('y1', d => penalty2Linear(d.minP))
          // .attr('x2', d => year2Linear(d.maxD))
          // .attr('y2', d => penalty2Linear(d.maxP))
          .attr('x1', d => year2Circular(d.d1r))
          .attr('y1', d => penalty2Circular(d.p1r))
          .attr('x2', d => year2Circular(d.d2r))
          .attr('y2', d => penalty2Circular(d.p2r))
          .attr('stroke', '#000')
          .attr('stroke-width', 0.5)
          .attr('marker-end', 'url(#arrow)')
      
      // svgElement.selectAll('vector')
        vector.on(
          'mouseover', function(event) {
            d3.select(this).select('line').attr('stroke-width', 10);
            let pt = d3.pointer(event, this) // 抓線位置
            tooltips.attr('fill-opacity', 1)
                    .attr('x', pt[0])
                    .attr('y', pt[1])
                    .text('id:' + event.id)
            //console.log(d3.select(this).select('line'));
            console.log(tooltips);
            // 顯示tooltip
          }
        )
        .on('mousemove', function(d, event){
          let pt = d3.pointer(event, this) // 抓線位置
          // tooltips.attr('fill-opacity', 1)
          // .attr('x', pt[0])
          // .attr('y', pt[1])
          //         .html('id:' + event.id) // 抓到綁定在DOM元素的資料
          // console.log(tooltips);
          //console.log(event.id)
         })
         .on('mouseleave', function(event){
            d3.select(this).select('line').attr('stroke-width', 0.5);
            tooltips.attr('fill-opacity', 0)
         })
        
        
    }, [dataset])
  
  
  
    return (
      <div className="MainViz">
        <svg
          width='800px'
          height='800px'
          ref={ref}
        />
      </div>
    )
  }



const Circles = () => {
    const [dataset, setDataset] = useState(
      generateDataset()
    )
    const ref = useRef()
  
    useEffect(() => {
      const svgElement = d3.select(ref.current)
      svgElement.selectAll("circle")
        .data(dataset)
        .join("circle")
          .attr("cx", d => d[0])
          .attr("cy", d => d[1])
          .attr("r",  3)
    }, [dataset])
  
    // useInterval(() => {
    //   const newDataset = generateDataset()
    //   setDataset(newDataset)
    // }, 2000)
  
    return (
      <svg
        viewBox="0 0 100 50"
        ref={ref}
      />
    )
  }


  export {Circles, MainViz};