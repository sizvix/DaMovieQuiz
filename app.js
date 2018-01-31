class Timer extends React.Component {
	constructor(props){ 
		super(props);
		this.state = { time:60 } ;
	}
	render() {
		return <div className="timer" >{this.state.time} seconds</div> ;
	}
}

class Score extends React.Component {
	constructor(props){ 
		super(props);
		this.state = { OK:0 , KO:0 } ;
	}
	render() {
		return <div className="score"><div className="score_pos" > {this.state.OK} </div> <div className="score_neg" > {this.state.KO} </div></div> ;
	}
}

class Head extends React.Component {
	render() {
		return <h1 className="head_part" >Cet acteur joue-t-il dans ce film ?</h1>;
	}
}

class Main extends React.Component {
render(){
	return <div className="main_part" >
			<div className="one_quest">
				<img src="https://image.tmdb.org/t/p/w300/6jkviwPHZPHGHRu6QhECU2mbO05.jpg" />
				<img src="https://image.tmdb.org/t/p/w300/4CR1D9VLWZcmGgh4b6kKuY2NOel.jpg" />
				<div>Mad Max</div>
				<div>Tom Hardy</div>
			</div>
		</div> ;
	}
}

class Resp extends React.Component {
	render() {
		return <div className="resp_part" >
				<button className="btn_oui" > OUI </button>
				<button className="btn_non" > NON </button>
			</div> ;
	}
}

class App extends React.Component {
	render(){
		return <div className="app_base" >
				<Timer /><Score />
				<Head />
				<Main />
				<Resp />
			</div> ;
	}
}

ReactDOM.render(
	<App />,
	document.getElementById('root')
);

