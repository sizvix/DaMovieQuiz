var api_key = 'api_key=cd0c2e17fe6cd8eae6c8cad3d0e7eec7' ;

class Timer extends React.Component {
	constructor(props){ 
		super(props);
		this.state = { time:60 } ;
	}
	start(){
		// start decrease time
		// callback when end of time 
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
	up_OK(){																				// increase score
		this.setState({OK: this.state.OK+1 });
	}
	up_KO(){																				// inscrease bad response score
		this.setState({KO: this.state.KO+1 });
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
	constructor(props){
		super(props);
		this.allFilms = [] ;															// All the first 100 films
		this.randFilms = {} ;														// Only some films ( random )
		this.listActors = [] ;
		this.getPgFilms(5);															// we need to get films ( 5pages => 100films )
		// select some films
		// get the list of actors
		// create questions
	}
	getPgFilms(nb){
		let all = [];
		for(var i=1; i<=nb ;i++)
			all.push( fetch("https://api.themoviedb.org/3/discover/movie?"+api_key+"&language=fr&sort_by=popularity.desc&include_adult=false&include_video=false&page="+i) 
			.then(data => data.json() )
			.then(data => data.results ) );
		Promise.all(all).then((arr)=>  {
			this.allFilms = arr.reduce( (p,c) => p.concat(c) );
			console.log(this);
		});
	}
	
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

