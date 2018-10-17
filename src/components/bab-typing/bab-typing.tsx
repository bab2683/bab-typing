import { Component, Prop, Element, State, Method, Event, EventEmitter } from "@stencil/core";

@Component({
	tag: "bab-typing",
	styleUrl: "bab-typing.scss",
})
export class BabExpand {
	@Element() container: HTMLElement;
	
	@Prop() classes:string = "";
	@Prop() duration:number = 8000;
	@Prop() text:string;
	@Prop() effect:string = "typing";
	
	@State() currentText:string = "";
	@State() currentTextArray:string[] = [];
	@State() finished:boolean = false;
	
	animation:any;
	counter:number = 0;
	step:number;
	
	@Event() typingStart: EventEmitter;
	@Event() typingFinish: EventEmitter;
	
	componentWillLoad(){
		this.calculateStep();
	}	
	componentDidLoad(){
		this.type();
	}
	type(){
		const finish:any = ()=>{
			clearInterval(this.animation);
			this.finished = true;
			this.typingFinish.emit();
		}
		this.typingStart.emit();

		this.animation = setInterval(() => {
			if(this.effect !== "typing"){
				this.currentTextArray = this.currentTextArray.concat([this.text[this.counter]]);
			}else{
				this.currentText += this.text[this.counter];
			}
			this.counter++;
			
			if(this.effect !== "typing"){
				if(this.currentTextArray.length === this.text.length){
					finish();
				}
			}else{
				if(this.currentText.length === this.text.length){
					finish();
				}
			}
		}, this.step);
	}
	calculateStep(){
		this.step = Math.trunc(this.duration / this.text.length);
	}

	@Method() reset(){
		this.counter = 0;
		this.currentText ="";
		this.currentTextArray = [];
		this.calculateStep();
		this.type();
	}	
	render() {
		let html:any;
		switch (this.effect) {
			case "typing":
				html = 
				<span class={`bab-typing ${this.effect} ${this.classes}`}>
					<span class={`text ${this.finished ? ' finished' : ""}`}>{this.currentText}</span>
				</span>;
			break;
			default:
			html = 
				<span class={`bab-typing ${this.effect} ${this.classes}`}>
					{this.currentTextArray.map(letter => {
						return (
							<span class={!/\s/.test(letter) ? "letter" : ""}>{letter}</span>
						)
					})}
				</span>;
			break;
		}
		return html;
		}
	}
			