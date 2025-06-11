// velocityChart.js - Separate Vue Component
const velocityChart = {
    props: ['velocityData'],
    
    template: `
      <div class="chart-container">
        <h3>Ball Velocity Over Time</h3>
        <div ref="chartContainer"></div>
        <div class="legend">
          <span style="color: red;">● Ball 1</span>
          <span style="color: blue; margin-left: 20px;">● Ball 2</span>
        </div>
      </div>
    `,
    
    data() {
      return {
        svg: null,
        xScale: null,
        yScale: null,
        line: null,
        width: 400,
        height: 200,
        margin: { top: 20, right: 20, bottom: 30, left: 40 }
      }
    },
    
    mounted() {
      this.initChart();
    },
    
    watch: {
      velocityData: {
        handler(newData) {
          if (newData && newData.length > 0) {
            this.updateChart(newData);
          }
        },
        deep: true
      }
    },
    
    methods: {
      initChart() {
        // Set up SVG container
        this.svg = d3.select(this.$refs.chartContainer)
          .append("svg")
          .attr("width", this.width + this.margin.left + this.margin.right)
          .attr("height", this.height + this.margin.top + this.margin.bottom)
          .append("g")
          .attr("transform", `translate(${this.margin.left},${this.margin.top})`);
        
        // Set up scales
        this.xScale = d3.scaleLinear()
          .domain([0, 59])  // 60 frames (0-59)
          .range([0, this.width]);
        
        this.yScale = d3.scaleLinear()
          .domain([0, 2])   // Will adjust dynamically
          .range([this.height, 0]);
        
        // Set up line generator
        this.line = d3.line()
          .x((d, i) => this.xScale(i))
          .y(d => this.yScale(d.velocity))
          .curve(d3.curveMonotoneX);
        
        // Add axes
        this.svg.append("g")
          .attr("class", "x-axis")
          .attr("transform", `translate(0,${this.height})`)
          .call(d3.axisBottom(this.xScale));
        
        this.svg.append("g")
          .attr("class", "y-axis")
          .call(d3.axisLeft(this.yScale));
        
        // Add axis labels
        this.svg.append("text")
          .attr("x", this.width / 2)
          .attr("y", this.height + this.margin.bottom)
          .style("text-anchor", "middle")
          .text("Frames Ago");
        
        this.svg.append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 0 - this.margin.left)
          .attr("x", 0 - (this.height / 2))
          .attr("dy", "1em")
          .style("text-anchor", "middle")
          .text("velocity");
        
        // Create line paths for each ball
        this.svg.append("path")
          .attr("class", "line ball-0")
          .attr("fill", "none")
          .attr("stroke", "red")
          .attr("stroke-width", 2);
        
        this.svg.append("path")
          .attr("class", "line ball-1")
          .attr("fill", "none")
          .attr("stroke", "blue")
          .attr("stroke-width", 2);
      },
      
      updateChart(data) {
        if (!data || data.length === 0) return;
        
        // Group data by ball
        const ball0Data = data.filter(d => d.ball === 0).slice(-60);
        const ball1Data = data.filter(d => d.ball === 1).slice(-60);
        
        // Update y-scale domain based on data range
        const maxAccel = d3.max(data, d => d.velocity) || 2;
        this.yScale.domain([0, Math.max(maxAccel * 1.1, 0.5)]);
        
        // Update y-axis
        this.svg.select(".y-axis")
          .transition()
          .duration(100)
          .call(d3.axisLeft(this.yScale));
        
        // Update line for ball 0 (red)
        if (ball0Data.length > 0) {
          this.svg.select(".ball-0")
            .datum(ball0Data)
            .transition()
            .duration(100)
            .attr("d", this.line);
        }
        
        // Update line for ball 1 (blue)
        if (ball1Data.length > 0) {
          this.svg.select(".ball-1")
            .datum(ball1Data)
            .transition()
            .duration(100)
            .attr("d", this.line);
        }
      }
    }
  };
  
  // Export for module systems or make globally available
  export default velocityChart;