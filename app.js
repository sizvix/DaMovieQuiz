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
		this.curr_num = -1 ;															// -1 because we haven't start yet
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
	selectFilms(lg=20){
		let orgList = this.allFilms.slice();									// copy the list of films 
		while(Object.keys(this.randFilms).length < lg){						// and take randomly some of them ( 20 due to tmdb request per second restriction to get credits details)
			let film = orgList.splice( Math.floor( Math.random()*orgList.length ) , 1 )[0] ;
			if(this.randFilms[film.id]==undefined)								// the other times of films selection, randFilms isn't empty
				this.randFilms[film.id] = film ;									// store films by id to link actors with it easily
		}
	}
	getActors(){																		// to load casting of the selected films
		let all = [];
		console.log('select actors');
		for(var i in this.randFilms)
			if(this.randFilms[i].cast==undefined)								// the next times, some randFilms will have cast yet
				all.push( fetch("https://api.themoviedb.org/3/movie/"+this.randFilms[i].id+"/credits?"+api_key)
				.then(data => data.json() )
				.then(data => this.randFilms[data.id].cast = data.cast ) );
		Promise.all(all).then(() => this.genQuests() );
	}
	genQuests(){
		var nb_quests = this.state.quests.length ;
		for(var i=nb_quests; i<this.curr_num+5 ;i++)							// 5 questions the first time (and we generate others one by one)
			this.append_quest( Object.keys(this.randFilms)[i],i ); 		// the next times, we fit to curr_num+5
		this.next_film();
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

		this.setState({quests:[...this.state.quests,{num , val , display:{display:'none'}
				, film:{src: "https://image.tmdb.org/t/p/w300/"+this.randFilms[id_film].poster_path, title:this.randFilms[id_film].title}
				, actor: {src: "https://image.tmdb.org/t/p/w300/"+ act.profile_path , name:act.name}
			} ]});																			// and push the question in the list of questions
	}
	loadMore(){
		this.selectFilms(Object.keys(this.randFilms).length+21);					// add 20 films randomly
		this.getActors();																	// load their casting
		// generate other questions
	}
	next_film(){
		let quests = this.state.quests;
		if(this.curr_num>-1)
			quests[this.curr_num].display={display:'none'};					// we hide and show the last and next question
		quests[this.curr_num+1].display={display:''};
		this.setState( { quests } );
		this.curr_num++;

		if( Object.keys(this.randFilms)[this.curr_num+5]!=undefined )
			this.append_quest( Object.keys(this.randFilms)[this.curr_num+5],this.curr_num+5 ) ;		// we load an other question
		else
			this.loadMore();															// when there is no other film loaded,
	}
	current_quest_resp(val){														// check the response
		return this.state.quests[this.curr_num].val==val ;
	}
	
	render(){
		return <div className="main_part" >{this.state.quests.map(quest=>
			<div style={quest.display} className="one_quest">
				<img src={quest.film.src} />
				<img src={quest.actor.src} />
				<div>{quest.film.title}</div>
				<div>{quest.actor.name}</div>
			</div>
		)}</div> ;
	}
}

class Resp extends React.Component {
	render() {
		return <div className="resp_part" >
				<button className="btn_oui" onClick={this.props.click_oui} > OUI </button>
				<button className="btn_non" onClick={this.props.click_non} > NON </button>
			</div> ;
	}
}

class App extends React.Component {
	click_oui(){
		console.log('OUI');
		if(this.main.current_quest_resp(true))
			this.score.up_OK();
		else
			this.score.up_KO();

		this.main.next_film();
	}
	click_non(){
		console.log('NON');
		if(this.main.current_quest_resp(false))
			this.score.up_OK();
		else
			this.score.up_KO();

		this.main.next_film();
	}
	render(){
		return <div className="app_base" >
				<Timer /><Score ref={e=>this.score=e} />
				<Head />
				<Main ref={e=>this.main=e} />
				<Resp click_oui={this.click_oui.bind(this)} click_non={this.click_non.bind(this)} />
			</div> ;
	}
}

ReactDOM.render(
	<App />,
	document.getElementById('root')
);

