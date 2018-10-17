import {
	Component,
	Prop,
	Element,
	State,
	Method,
	Event,
	EventEmitter
} from "@stencil/core";

@Component({
	tag: "bab-typing",
	styleUrl: "bab-typing.scss"
})
export class BabExpand {
	@Element()
	container: HTMLElement;

	@Prop()
	classes: string = "";
	@Prop()
	duration: number = 8000;
	@Prop()
	text: string;
	@Prop()
	effect: string = "typing";
	@Prop()
	delay: number = 0;

	@State()
	currentText: string = "";
	@State()
	currentTextArray: string[] = [];
	@State()
	finished: boolean = false;

	animation: any;
	counter: number = 0;
	step: number;

	@Event()
	typingStart: EventEmitter;
	@Event()
	typingFinish: EventEmitter;

	componentWillLoad() {
		this.calculateStep();
	}
	componentDidLoad() {
		this.start();
	}
	start() {
		if (this.delay) {
			setTimeout(() => {
				this.type();
			}, this.delay);
		} else {
			this.type();
		}
	}

	type() {
		const finish: any = () => {
			clearInterval(this.animation);
			this.finished = true;
			this.typingFinish.emit();
		};
		this.typingStart.emit();

		this.animation = setInterval(() => {
			this.currentTextArray = this.currentTextArray.concat([
				this.text[this.counter]
			]);
			this.counter++;
			if (this.currentTextArray.length === this.text.length) {
				finish();
			}
		}, this.step);
	}

	calculateStep() {
		this.step = Math.trunc(this.duration / this.text.length);
	}

	@Method()
	reset() {
		this.counter = 0;
		this.currentText = "";
		this.currentTextArray = [];
		this.finished = false;
		this.calculateStep();
		this.start();
	}
	render() {
		return (
			<span
				class={`bab-typing ${this.effect} ${this.classes} ${
					this.finished && this.effect === "typing" ? "finished" : ""
				}`}
			>
				{this.currentTextArray.map(letter => {
					return (
						<span class={!/\s/.test(letter) ? "letter" : ""}>
							{letter}
						</span>
					);
				})}
			</span>
		);
	}
}
