import React, { Component, useState } from "react";
import {
  Box,
  Button,
  Collapsible,
  Heading,
  Grommet,
  Layer,
  List,
  Meter,
  ResponsiveContext,
  Paragraph
} from 'grommet';

import { FormClose, Achievement } from 'grommet-icons';

const theme = {
  global: {
    colors: {
      brand: '#333333',
      focus: '#f7c500'
    },
    font: {
      family: 'Roboto',
      size: '22px',
      height: '20px',
    }
  },
};

const AppBar = (props) => (
    <Box
        tag='header'
        direction='row'
        align='center'
        justify='between'
        background='brand'
        pad={{ left: 'medium', right: 'small', vertical: 'small' }}
        elevation='medium'
        style={{ zIndex: '1' }}
        {...props}
    />
);

class Timer extends Component {
    constructor (props) {
        super(props);
        this.state = { ogTime: 90, time: 90 }
        this.beginCounting = this.beginCounting.bind(this);
        this.restart = this.restart.bind(this);
        this.reset = this.reset.bind(this);
    }
    componentDidMount () {
        if (this.props.active) { this.restart() }
    }
    restart () {
        this.reset();
        this.beginCounting();
    }
    reset () {
        this.setState({ time: this.state.ogTime });
    }
    beginCounting () {
        var timer = setInterval(() => {
            this.setState({ time: this.state.time - 1 });
            if ((this.state.time <= 0) || (!this.props.active)) {
                clearInterval(timer);
                document.getElementById('ding').play();
            }
        }, 1000)
    }
    render() {
        const background = { color: "brand", opacity: "medium" }
        return (
            <>
                <Box>
                    <Heading level="2" size="large" margin={{top: "large", bottom: "0"}} >{this.state.time}</Heading>
                    <Paragraph>until next set</Paragraph>
                </Box>
                <Meter values={[{"value": this.state.time, "color": "#f7c500"}]} max={this.state.ogTime} round background={background} />
                <audio id="ding" src="./sounds/ding.mp3"></audio>
            </>
        )
    }
}

function Main(props) {
    const [showSidebar, setShowSidebar] = useState(false);
    return (
        <Grommet theme={theme} full>
        <ResponsiveContext.Consumer>
        {size => (
        <Box>
            <AppBar>
            <Heading level='3' margin='none'>5x5 Lifting Tracker</Heading>
            <Button
                icon={<Achievement />}
                onClick={() => setShowSidebar(!showSidebar)}
            />
            </AppBar>
            <Box direction='row' flex overflow={{ horizontal: 'hidden' }}>
            <Box flex align='center' justify='center'>
            <Box pad={{ left: 'large', right: 'large', top: 'large', bottom: 'large' }}>
                    <Box flex direction="column" align="center" style={{textAlign: "center"}}>
                        <Heading level="1">Remember to breathe!</Heading>    
                        <Box margin="medium">
                            <Box flex direction="row">
                                <Button primary size="large" label="-" onClick={props.subtractWeight} />
                                <Box justify="center" pad={{ left: 'medium', right: 'medium' }}>
                                    <Heading level="2" size="large">{props.weight}lbs</Heading>
                                </Box>
                                <Button primary size="large" label="+" onClick={props.addWeight} />
                            </Box>
                            <Paragraph>{(props.weight - 45) / 2}lb/side</Paragraph>
                        </Box>
                        <Box flex direction="row" pad="medium" wrap>
                            <Button onClick={props.finishSet} label="0" margin="small" size="medium" textAlign="center" />
                            <Button onClick={props.finishSet} label="0" margin="small" size="medium" textAlign="center" />
                            <Button onClick={props.finishSet} label="0" margin="small" size="medium" textAlign="center" />
                            <Button onClick={props.finishSet} label="0" margin="small" size="medium" textAlign="center" />
                            <Button onClick={props.finishSet} label="0" margin="small" size="medium" textAlign="center" />
                        </Box>
                        <Box>
                            { props.timerEl }
                        </Box>
                    </Box>
                </Box>
            </Box>
            {(!showSidebar || size !== 'small') ? (
                <Collapsible direction="horizontal" open={showSidebar}>
                <Box fill width='medium' background='light-2' elevation='small'>
                    <List
                        height="100%"
                        primaryKey="date"
                        secondaryKey="score"
                        data={props.weightData}
                    />
                </Box>
                </Collapsible>
                ): (
                <Layer>
                    <Box background='light-2' tag='header' justify='end' align='center' direction='row'>
                        <Button icon={<FormClose />} onClick={() => setShowSidebar(false)} />
                    </Box>
                    <Box fill background='light-2' align='center' justify='center'>
                        <List
                            primaryKey="name"
                            secondaryKey="percent"
                            data={props.weightData}
                        />
                    </Box>
                </Layer>
            )}
            </Box>
        </Box>
        )}
        </ResponsiveContext.Consumer>
        </Grommet>
    );
} 
class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            weight: 135,
            timerEl: null,
            weightData: [
                { date: '2020-04-16', score: 21 },
                { date: '2020-04-16', score: 21 },
                { date: '2020-04-16', score: 21 },
                { date: '2020-04-16', score: 21 }
            ]
        };

        this.addWeight = this.addWeight.bind(this);
      }

    addWeight = () => {
        this.setState({ weight: this.state.weight + 5 });
    }

    subtractWeight = () => {
        this.setState({ weight: this.state.weight - 5 });
    }

    finishSet = e => {
        e.target.innerHTML = '5';
        (async() => {
            await this.setState({ timerEl: null });
            await this.setState({ timerEl: <Timer active /> });
        })();
    }

    render() {
        return (
            <Main
                weight={this.state.weight}
                addWeight={this.addWeight}
                subtractWeight={this.subtractWeight}
                weightData={this.state.weightData}
                finishSet={this.finishSet}
                timerEl={this.state.timerEl}
            />
        );
    }
}

export default App;
