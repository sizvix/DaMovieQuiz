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
		this.getPgFilms(5);															// get films (5pages=>100films) , and chain select films and actors of those films
		this.state = { quests : [] } ;											// create questions
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
			this.selectFilms();
			this.getActors();															// we get the list of actors from the list of films
		});
	}
	selectFilms(){
		let orgList = this.allFilms.slice();									// copy the list of films 
		while(Object.keys(this.randFilms).length < 20){						// and take randomly some of them ( 20 due to tmdb request per second restriction to get credits details)
			let film = orgList.splice( Math.floor( Math.random()*orgList.length ) , 1 )[0] ;
			this.randFilms[film.id] = film ;										// store films by id to link actors with it easily
		}
	}
	getActors(){																	// to load casting of the selected films
		let all = [];
		console.log('select actors');
		for(var i in this.randFilms)
			all.push( fetch("https://api.themoviedb.org/3/movie/"+this.randFilms[i].id+"/credits?"+api_key)
			.then(data => data.json() )
			.then(data => this.randFilms[data.id].cast = data.cast ) );
		Promise.all(all).then(() => this.genQuests() );
	}
	genQuests(){
		for(var i=0; i<5 ;i++)														// 5 questions and we generate others one by one
			this.append_quest( Object.keys(this.randFilms)[i],i ); 
	}
	append_quest( id_film,num ){													// we get a num to identify the questions
		console.log('quest id:'+id_film+' num :'+num);
		var val = Math.random()<0.5? true : false ;							// choose resp true or false
		var act ;
		if(val){
			act = this.randFilms[id_film].cast[ 								// if true , we get one actor in the film
							Math.floor(Math.random()*this.randFilms[id_film].cast.length%10)							// one of the 10 first actors to not have questions too hard
						];
		}else{																			// else we get an actor in another film
			let keys = Object.keys(this.randFilms);
			let choose ;
			do{																			// to be sure we don't take the same film ^^U
				choose = keys[ Math.floor(Math.random()*keys.length) ];
			}while(choose!=id_film);
			act = this.randFilms[choose].cast[ Math.floor(Math.random()*this.randFilms[choose].cast.length) ];	// one of the actors of this film
		}

		this.setState({quests:[...this.state.quests,{num , val 
				, film:{src: "https://image.tmdb.org/t/p/w300/"+this.randFilms[id_film].poster_path, title: "https://image.tmdb.org/t/p/w300/"+this.randFilms[id_film].title}
				, actor: {src: "https://image.tmdb.org/t/p/w300/"+ act.profile_path , name:"https://image.tmdb.org/t/p/w300/"+act.name}
			} ]});																			// and push the question in the list of questions
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

